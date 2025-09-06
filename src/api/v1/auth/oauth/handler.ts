import { AuthResponseDto } from "@src/model/external/dto/auth-response";
import { OauthLoginRequestDto } from "@src/model/external/dto/oauth-login-request";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { OAuthService } from "@src/module/auth/oauth/service";
import { AuthProvider } from "@src/module/auth/oauth/constants";
import { IdentityDto } from "@src/model/external/dto/identity";
import { isDefined } from "@src/util/common";
import { ApiHelperService } from "@src/module/api-helper/service";

export class OAuthLoginHandler implements RouteHandler<OauthLoginRequestDto, AuthResponseDto> {

    constructor(private readonly apiHelperService: ApiHelperService, private readonly oAuthService: OAuthService) {}

    public async handle(_: AuthenticationContext, dto: OauthLoginRequestDto): Promise<AuthResponseDto> {
        const identity = await this.oAuthService.handleOAuthLogin(dto.provider as AuthProvider, dto.code);

        const identityDto: IdentityDto = {
            email: identity.email,
            publicId: identity.publicId,
            role: identity.role,
        }

        return {
            identity: identityDto,
            profileSettings: this.apiHelperService.convertProfileSettingsToDto(identity.publicId, identity.profileSettings),
            token: {
                accessToken: identity.accessToken,
                refreshToken: identity.refreshToken,
            }
        }
    }

}