import { RefreshTokenRequestDto } from "@src/model/external/dto/refresh-token-request";
import { TokenResponseDto } from "@src/model/external/dto/token-response";
import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { RefreshTokenRouteHandler } from "./handler";
import { requireNonNull } from "@src/util/common";

export class RefreshTokenRouteProvider implements RouteProvider<RefreshTokenRequestDto, TokenResponseDto> {

    private readonly handler: RefreshTokenRouteHandler;

    constructor(handler: RefreshTokenRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<RefreshTokenRequestDto, TokenResponseDto> {
        const schema: RequestSchema = {
            body: {
                type: 'object',
                required: ['refreshToken'],
                properties: {
                    refreshToken: { type: 'string' },
                },
                additionalProperties: false,
            }
        };

        return {
            name: 'RefreshToken',
            method: 'POST',
            path: '/api/v1/auth/refresh-token',
            schema, 
            handler: this.handler,
            authenticated: false,
        };
    }

}