import { HttpMethod } from "@src/http/constants";
import { ProfileDao } from "@src/models/internal/dao/profile";
import { FastifySchema } from "fastify";

export type AuthenticationContext = {
    authenticated: boolean,
    profile: ProfileDao | null,
}

export type RouteDefinition<S, T> = {
    name?: string,
    path: string,
    method: HttpMethod,
    schema: FastifySchema,
    handler: RouteHandler<S, T>,
    authenticated: boolean,
    response?: ResponseSchema,
}

export type HandlerFunction<S, T> = (principal: AuthenticationContext, _: S) => Promise<T>;

export interface RouteProvider<S, T> {
    provide: () => RouteDefinition<S, T>;
}

export interface RouteHandler<S, T> {
    handle: HandlerFunction<S, T>;
}

export type RequestSchema = {
    body?: unknown
    params?: unknown,
    querystring?: unknown,
}

export type ResponseSchema = {
    statusCode: number,
}