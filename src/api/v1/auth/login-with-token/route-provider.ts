import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { AuthResponseDto } from "@src/model/external/dto/auth-response";
import { LoginWithTokenRequestDto } from "@src/model/external/dto/login-with-token-request";
import { LoginWithTokenHandler } from "./handler";

export class LoginWithTokenRouteProvider implements RouteProvider<LoginWithTokenRequestDto, AuthResponseDto> {

    constructor(private readonly handler: LoginWithTokenHandler) {}

    provide(): RouteDefinition<LoginWithTokenRequestDto, AuthResponseDto> {
        const schema: RequestSchema = {
            body: {
                type: 'object',
                required: ['token'],
                properties: {
                    token: { type: 'string' },
                },
                additionalProperties: false,
            }
        };

        return {
            name: 'LoginWithToken',
            method: 'POST',
            path: '/api/v1/auth/login-with-token',
            schema, 
            handler: this.handler,
            authenticated: false,
        };
    }

}