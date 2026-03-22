import { VenueFlavorId, VenueId } from "@src/util/domain-types";

export interface GameVenueDto {
    id: VenueId;
    flavorId: VenueFlavorId;
    branding: string;
    city: string;
}