import { HttpMethod } from "@src/http/constants";
import { ObjectType } from "@src/model/external/validation/types";
import { Account } from "@src/model/internal/account";
import { Capability } from "@src/model/internal/capabilities";

export type AuthenticationContext = {
    authenticated: boolean,
    account: Account | null,
}

export enum ApplicationHeader {
    ContentHash = 'x-content-hash',
}

export type RouteDefinition<S, T> = {
    name?: string,
    path: string,
    method: HttpMethod,
    schema: RequestSchema,
    handler: RouteHandler<S, T>,
    authenticated: boolean,
    response?: ResponseSchema,
    requiredCapabilities?: Capability[],
}

export type HandlerFunction<S, T> = (principal: AuthenticationContext, _: S, headers: Record<string, string>) => Promise<T>;

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

type ContentHash = {
    contentHash: string;
}
export type CacheableResponse<T> = (T & ContentHash) | null;