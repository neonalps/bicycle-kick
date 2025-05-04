import { ExternalVenueDto } from "./external-venue";

export interface VenueInputDto {
    venueId?: number;
    externalVenue?: ExternalVenueDto;
}