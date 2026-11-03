import { ClubId, VenueId } from "@src/util/domain-types";

export interface UpdateClubByIdRequestDto {
    clubId: ClubId;
    name: string;
    shortName: string;
    primaryColour?: string;
    secondaryColour?: string;
    city: string;
    district?: string;
    countryCode: string;
    homeVenueId: VenueId;
}