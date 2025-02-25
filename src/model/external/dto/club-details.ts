import { BasicGameDto } from "./basic-game";
import { VenueDto } from "./venue";

export interface ClubDetailsDto {
    id: number;
    name: string;
    shortName: string;
    city: string;
    countryCode: string;
    iconSmall: string;
    iconLarge: string;
    primaryColour: string;
    secondaryColour: string;
    homeVenue: VenueDto;
    lastGames: BasicGameDto[];
    nextGame?: BasicGameDto;
}