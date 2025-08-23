import { RefreshTokenRequestDto } from "@src/model/external/dto/refresh-token-request";
import { TokenResponseDto } from "@src/model/external/dto/token-response";
import { AuthService, TokenConfig } from "@src/module/auth/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { DateSource } from "@src/util/date";
import { TimeSource } from "@src/util/time";
import { parseJwt } from "@src/util/token";
import { validateNotBlank, validateNotEmpty, validateNotNull } from "@src/util/validation";

export class RefreshTokenRouteHandler implements RouteHandler<RefreshTokenRequestDto, TokenResponseDto> {

    constructor(
        private readonly authService: AuthService,
        private readonly dateSource: DateSource,
        private readonly timeSource: TimeSource,
        private readonly tokenConfig: TokenConfig,
    ) {}

    public async handle(_: AuthenticationContext, dto: RefreshTokenRequestDto): Promise<TokenResponseDto> {
        const oldRefreshToken = dto.refreshToken;

        const parsedToken = parseJwt(oldRefreshToken);

        const issuer = parsedToken["iss"] as string;
        validateNotBlank(issuer, "issuer");
        if (issuer !== this.tokenConfig.issuer) {
            throw new Error("Invalid token issuer");
        }

        const audience = parsedToken["aud"] as string;
        validateNotBlank(audience, "audience");
        if (audience !== this.tokenConfig.audience) {
            throw new Error("Invalid token audience");
        }

        const expiresAt = parsedToken["exp"] as number;
        validateNotNull(expiresAt, "expiresAt");
        if (this.dateSource.getDateFromUnixTimestamp(expiresAt) < this.timeSource.getNow()) {
            throw new Error(`Refresh token has already expired`);
        }

        const userId = parsedToken["sub"] as string;
        validateNotBlank(userId, "userId");

        const scopes = parsedToken["scp"] as Set<string>;
        validateNotEmpty(scopes, "scopes");

        const scopesArray = Array.from(scopes);

        const newAccessToken = this.authService.createSignedAccessToken(userId, scopesArray);
        const newRefreshToken = this.authService.createSignedRefreshToken(userId, scopesArray);

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
    }

}