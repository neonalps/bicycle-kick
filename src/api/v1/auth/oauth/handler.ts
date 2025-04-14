import { AuthResponseDto } from "@src/model/external/dto/auth-response";
import { OauthLoginRequestDto } from "@src/model/external/dto/oauth-login-request";
import { AuthenticationContext, RouteHandler } from "@src/router/types";

export class OAuthLoginHandler implements RouteHandler<OauthLoginRequestDto, AuthResponseDto> {

    public async handle(_: AuthenticationContext, dto: OauthLoginRequestDto): Promise<AuthResponseDto> {
        // TODO implement
        throw new Error();
    }

}