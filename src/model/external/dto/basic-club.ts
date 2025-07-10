import { BasicGameDto } from "./basic-game";
import { BasicVenueDto } from "./basic-venue";

export interface BasicClubDto {
    id: number;
    name: string;
    shortName: string;
    iconSmall?: string;
    iconLarge?: string;
    primaryColour?: string;
    secondaryColour?: string;
    city: string;
    district?: string;
    countryCode: string;
    homeVenue?: BasicVenueDto;
    lastGames?: BasicGameDto[];
}