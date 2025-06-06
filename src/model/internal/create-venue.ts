export interface CreateVenue {
    name: string;
    shortName: string;
    city: string;
    capacity: number;
    countryCode: string;
    latitude?: number;
    longitude?: number;
    district?: string;
    normalizedSearch: string;
}