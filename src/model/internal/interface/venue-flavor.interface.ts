import { VenueFlavorId, VenueId } from "@src/util/domain-types";

export interface VenueFlavorDaoInterface {
    id: VenueFlavorId;
    venueId: VenueId;
    name: string;
}