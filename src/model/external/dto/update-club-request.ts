import { ClubId, VenueId } from "@src/util/domain-types";

export interface UpdateClubRequestDto {
    id: ClubId;
    name: string;
    shortName: string;
    iconSmall?: string;
    iconLarge?: string;
    primaryColour?: string;
    secondaryColour?: string;
    city: string;
    district?: string;
    countryCode: string;
    homeVenueId: VenueId;
}