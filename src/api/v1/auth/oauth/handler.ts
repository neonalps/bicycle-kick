import { AuthResponseDto } from "@src/model/external/dto/auth-response";
import { OauthLoginRequestDto } from "@src/model/external/dto/oauth-login-request";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { OAuthService } from "@src/module/auth/oauth/service";
import { AuthProvider } from "@src/module/auth/oauth/constants";
import { IdentityDto } from "@src/model/external/dto/identity";
import { isDefined } from "@src/util/common";

export class OAuthLoginHandler implements RouteHandler<OauthLoginRequestDto, AuthResponseDto> {

    constructor(private readonly oAuthService: OAuthService) {}

    public async handle(_: AuthenticationContext, dto: OauthLoginRequestDto): Promise<AuthResponseDto> {
        const identity = await this.oAuthService.handleOAuthLogin(dto.provider as AuthProvider, dto.code);

        const identityDto: IdentityDto = {
            email: identity.email,
            publicId: identity.publicId,
            role: identity.role,
        }

        if (isDefined(identity.firstName)) {
            identityDto.firstName = identity.firstName;
        }

        if (isDefined(identity.lastName)) {
            identityDto.lastName = identity.lastName;
        }

        return {
            identity: identityDto,
            token: {
                accessToken: identity.accessToken,
                refreshToken: identity.refreshToken,
            }
        }
    }

}