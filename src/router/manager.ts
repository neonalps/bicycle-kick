import { FastifyError, FastifyInstance, FastifyReply, FastifyRequest, FastifySchema } from "fastify";
import fastifyJwt from "@fastify/jwt";
import { ApplicationHeader, AuthenticationContext, RequestSchema, ResponseSchema, RouteDefinition, RouteProvider } from "./types";
import { HttpMethod } from "@src/http/constants";
import logger from "@src/log";
import dependencyManager from "@src/di/manager";
import { IllegalStateError } from "@src/api/error/illegal-state";
import { isDefined, requireNonNull } from "@src/util/common";
import { AuthenticationError } from "@src/api/error/authentication";
import { Dependencies } from "@src/di/dependencies";
import { AccountService } from "@src/module/account/service";
import { PermissionService } from "@src/module/permission/service";

export class RouteManager {

    private static readonly EMPTY_AUTHENTICATION: AuthenticationContext = {
        authenticated: false,
        account: null,
    }

    private constructor() {}

    public static registerRoutes(server: FastifyInstance, providers: RouteProvider<unknown, unknown>[]): void {
        for (const provider of providers) {
            this.registerRoute(server, provider.provide() as RouteDefinition<unknown, unknown>);
        }
    }

    public static registerJwtParser(server: FastifyInstance, secret: string, issuer: string, audience: string): void {
        server.register(fastifyJwt, {
            formatUser: (user: any) => user.sub,
            secret,
            verify: {
                allowedAud: audience,
                allowedIss: issuer,
            }
        });
    }

    private static registerRoute(server: FastifyInstance, route: RouteDefinition<unknown, unknown>): void {
        server.route({
            method: route.method,
            url: route.path,
            schema: RouteManager.convertRequestSchema(route.schema),
            onRequest: async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
                if (route.authenticated !== true) {
                    return;
                }

                try {
                    await request.jwtVerify();
                } catch (ex: unknown) {
                    const error = ex as FastifyError;
                    this.sendErrorResponse(reply, route, error.statusCode, new Error(error.message));
                }
            },
            preHandler: async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
                const authenticationContext = await RouteManager.buildAuthenticationContext(route.authenticated, request.user as any);
                
                if (route.authenticated === true && !RouteManager.hasValidAuthenthicationContextForAuthenticatedRequest(authenticationContext)) {
                    this.sendErrorResponse(reply, route, 401, new Error("Unauthorized"));
                    return;
                }

                // validate whether the user has the correct capabilities required by the route
                if (route.authenticated === true && route.requiredCapabilities && route.requiredCapabilities.length > 0) {
                    const permissionService = dependencyManager.get<PermissionService>(Dependencies.PermissionService);
                    const accountRole = requireNonNull(authenticationContext.account).roles;
                    const missingCapabilities = permissionService.determineMissingCapabilities(accountRole, route.requiredCapabilities);
                    
                    if (missingCapabilities.length > 0) {
                        console.log(`Denying route access because of missing capabilities`, missingCapabilities);
                        this.sendErrorResponse(reply, route, 401, new Error(`The authentication provided is lacking the following permissions: ${ missingCapabilities.join(', ') }`));
                        return;
                    }
                }

                (request as any).principal = authenticationContext;
            },
            handler: async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
                const principal: AuthenticationContext = (request as any)['principal'];

                const body = RouteManager.mergeRequestContext(request) as unknown;

                const applicationHeaders: Record<string, string> = {};
                const responseHashHeader = request.headers[ApplicationHeader.ContentHash];
                if (isDefined(responseHashHeader) && !Array.isArray(responseHashHeader)) {
                    applicationHeaders[ApplicationHeader.ContentHash] = responseHashHeader;
                }

                try {
                    const response = await route.handler.handle(principal, body, applicationHeaders);
                    this.sendSuccessResponse(reply, route, response);
                } catch (ex) {
                    if (ex instanceof AuthenticationError) {
                        this.sendErrorResponse(reply, route, 401, ex);
                        return;
                    } else if (ex instanceof IllegalStateError) {
                        this.sendErrorResponse(reply, route, 400, ex);
                        return;
                    }

                    console.error(ex);
                    logger.error(`Error while handling ${route.path} (${route.name}): ${ex}`);
                    this.sendErrorResponse(reply, route, 500, ex);
                }
            },
        })
    }

    private static async buildAuthenticationContext(isRouteAuthenticated: boolean, publicUserId: string | null): Promise<AuthenticationContext> {
        if (!isRouteAuthenticated) {
            return RouteManager.EMPTY_AUTHENTICATION;
        }

        if (typeof publicUserId !== 'string') {
            throw new Error("No user ID for authenticated route while building authentication context");
        }

        const account = await dependencyManager.get<AccountService>(Dependencies.AccountService).getByPublicId(publicUserId);
        if (account === null) {
            throw new Error("No account with this user ID was found");
        }

        if (account.enabled === false) {
            throw new Error("Account is disabled");
        }

        return {
            authenticated: true,
            account,
        };
    }

    private static hasValidAuthenthicationContextForAuthenticatedRequest(context: AuthenticationContext): boolean {
        return !!context && context.authenticated === true && context.account !== null;
    }

    private static sendSuccessResponse(reply: FastifyReply, route: RouteDefinition<unknown, unknown>, responseBody: unknown): void {
        const statusCode = isDefined(route.response?.statusCode) ? (route.response as ResponseSchema).statusCode : this.getCodeFromMethod(route.method, !responseBody);

        reply
            .code(statusCode)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send(responseBody);
    }

    private static sendErrorResponse(reply: FastifyReply, route: RouteDefinition<unknown, unknown>, statusCode: number | undefined, ex: unknown) {
        const errorMessage = (ex as any)?.message || "An error occurred";
        const code = statusCode || 500;

        reply
            .code(code)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send({ message: errorMessage });
    }

    private static getCodeFromMethod(method: HttpMethod, isResponseBodyEmpty: boolean): number {
        if (isResponseBodyEmpty) {
            return 204;
        }

        if (method === "POST") {
            return 201;
        }

        return 200;
    }

    private static convertRequestSchema(schema: RequestSchema): FastifySchema {
        let requestSchema = {};

        if (isDefined(schema.body)) {
            requestSchema = { ...requestSchema, body: { ...schema.body as object } };
        }

        if (isDefined(schema.params)) {
            requestSchema = { ...requestSchema, params: { ...schema.params as object } };
        }

        if (isDefined(schema.querystring)) {
            requestSchema = { ...requestSchema, querystring: { ...schema.querystring as object } };
        }

        return requestSchema;
    }

    private static mergeRequestContext(request: FastifyRequest): unknown {
        let requestContext = {};

        if (typeof request.body === 'object') {
            requestContext = { ...requestContext, ...request.body };
        }

        if (typeof request.query === 'object') {
            requestContext = { ...requestContext, ...request.query };
        }

        if (typeof request.params === 'object') {
            requestContext = { ...requestContext, ...request.params,  };
        }

        return requestContext;
    }

}