import { VenueId } from "@src/util/domain-types";

export interface CreateVenueFlavor {
    venueId: VenueId;
    name: string;
    normalizedSearch: string;
}