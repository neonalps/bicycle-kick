import { OAuthLoginHandler } from "./handler";
import { requireNonNull } from "@src/util/common";
import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { AuthResponseDto } from "@src/model/external/dto/auth-response";
import { OauthLoginRequestDto as OAuthLoginRequestDto } from "@src/model/external/dto/oauth-login-request";
import { AuthProvider } from "@src/module/auth/oauth/constants";

export class OAuthLoginRouteProvider implements RouteProvider<OAuthLoginRequestDto, AuthResponseDto> {

    private readonly handler: OAuthLoginHandler;

    constructor(handler: OAuthLoginHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<OAuthLoginRequestDto, AuthResponseDto> {
        const schema: RequestSchema = {
            body: {
                type: 'object',
                required: ['provider', 'code'],
                properties: {
                    provider: { type: 'string', enum: [AuthProvider.Google] },
                    code: { type: 'string' },
                },
            }
        };

        return {
            name: 'OAuthLogin',
            method: 'POST',
            path: '/api/v1/auth/oauth',
            schema, 
            handler: this.handler,
            authenticated: false,
        };
    }

}