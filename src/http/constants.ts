export type HttpMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'TRACE' | 'PATCH';

export const HTTP_METHOD: Record<string, HttpMethod> = {
    GET: 'GET',
    HEAD: 'HEAD',
    POST: 'POST',
};

export const HTTP_STATUS: Record<string, number> = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
};

export const HEADER: Record<string, string> = {
    ACCEPT: 'Accept',
    AUTHORIZATION: 'Authorization',
    CONTENT_TYPE: 'Content-Type',
};

export const CONTENT_TYPE: Record<string, string> = {
    JSON: 'application/json',
    FORM_URLENCODED: 'application/x-www-form-urlencoded',
};

export const AUTHORIZATION: Record<string, string> = {
    BASIC: 'Basic',
    BEARER: 'Bearer',
};