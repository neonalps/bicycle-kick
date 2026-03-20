import { VenueId } from "@src/util/domain-types";

export interface Venue {
    id: VenueId;
    name: string;
    shortName: string;
    city: string;
    district?: string;
    countryCode: string;
    capacity: number;
    latitude?: number;
    longitude?: number;
}