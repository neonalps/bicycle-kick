import { VenueFlavorId, VenueId } from "@src/util/domain-types";

export interface VenueFlavor {
    id: VenueFlavorId;
    venueId: VenueId;
    name: string;
}