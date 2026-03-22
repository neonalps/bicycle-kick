import { ExternalVenueDto } from "./external-venue";

export interface VenueInputDto {
    venueFlavorId?: number;
    externalVenue?: ExternalVenueDto;
}