import { HttpMethod } from "@src/http/constants";
import { ObjectType } from "@src/model/external/validation/types";
import { Account } from "@src/model/internal/account";
import { FastifySchema } from "fastify";

export type AuthenticationContext = {
    authenticated: boolean,
    account: Account | null,
}

export type RouteDefinition<S, T> = {
    name?: string,
    path: string,
    method: HttpMethod,
    schema: RequestSchema,
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
    body?: ObjectType,
    params?: ObjectType,
    querystring?: ObjectType,
}

export type ResponseSchema = {
    statusCode: number,
}