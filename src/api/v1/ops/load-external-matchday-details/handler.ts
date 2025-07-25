import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { WeltfussballClient } from "@src/module/external-provider/weltfussball/client";
import { ExternalProviderService } from "@src/module/external-provider/service";
import { ExternalProvider } from "@src/model/type/external-provider";
import { MatchdayDetailsResponseDto } from "@src/model/external/dto/matchday-details-response";
import { ClubService } from "@src/module/club/service";

export class LoadExternalMatchdayDetailsRouteHandler implements RouteHandler<void, MatchdayDetailsResponseDto> {

    constructor(
        private readonly client: WeltfussballClient,
        private readonly externalProviderService: ExternalProviderService,
    ) {}

    public async handle(_: AuthenticationContext, dto: void): Promise<MatchdayDetailsResponseDto> {
        //const matchdayDetails = await this.client.loadMatchdayDetails();

        throw new Error();

        // TODO match clubs 
    }

}