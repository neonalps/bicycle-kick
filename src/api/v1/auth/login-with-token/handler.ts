import { AuthResponseDto } from "@src/model/external/dto/auth-response";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { IdentityDto } from "@src/model/external/dto/identity";
import { ApiHelperService } from "@src/module/api-helper/service";
import { LoginWithTokenRequestDto } from "@src/model/external/dto/login-with-token-request";
import { AuthService } from "@src/module/auth/service";

export class LoginWithTokenHandler implements RouteHandler<LoginWithTokenRequestDto, AuthResponseDto> {

    constructor(private readonly apiHelperService: ApiHelperService, private readonly authService: AuthService) {}

    public async handle(_: AuthenticationContext, dto: LoginWithTokenRequestDto): Promise<AuthResponseDto> {
        const identity = await this.authService.handleLoginWithToken(dto.token);

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