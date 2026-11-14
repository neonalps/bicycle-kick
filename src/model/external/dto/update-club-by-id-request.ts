import { VenueFlavorId } from "@src/util/domain-types";

export interface UpdateClubByIdRequestDto {
    clubId: string;
    name: string;
    shortName: string;
    primaryColour?: string;
    secondaryColour?: string;
    city: string;
    district?: string;
    countryCode: string;
    homeVenueFlavorId: VenueFlavorId;
}