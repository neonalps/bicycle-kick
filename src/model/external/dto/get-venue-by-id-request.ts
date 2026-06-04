import { VenueId } from "@src/util/domain-types";

export interface GetVenueByIdRequestDto {
    venueId: string;
    includeHomeVenueFor?: boolean;
}