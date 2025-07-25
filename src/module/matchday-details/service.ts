import { ClubService } from "@src/module/club/service";
import { MatchdayDetailsProvider } from "./provider";
import { ExternalProviderService } from "@src/module/external-provider/service";

export class MatchdayDetailsService {

    constructor(private readonly clubService: ClubService, private readonly externalProviderService: ExternalProviderService) {}

    async getDetails(provider: MatchdayDetailsProvider): Promise<void> {
        const matchdayDetails = await provider.provideMatchDetails();

        const externalProviderClubsIds = new Set<string>();

        matchdayDetails.fixtures?.forEach(fixture => {
            externalProviderClubsIds.add(fixture.home.name);
            externalProviderClubsIds.add(fixture.away.name);
        });

        matchdayDetails.table?.forEach(position => {
            externalProviderClubsIds.add(position.club.name);
        });

        const resolvedClubIds = await this.externalProviderService.getMultipleClubIdsByExternalProvider(provider.getName(), Array.from(externalProviderClubsIds));
        const clubDetailsMap = await this.clubService.getMapByIds(Array.from(resolvedClubIds.values()));

        
    }

}