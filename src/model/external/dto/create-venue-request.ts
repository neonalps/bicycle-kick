export interface CreateVenueRequestDto {
    name: string;
    shortName: string;
    city: string;
    district?: string;
    countryCode: string;
    capacity?: number;
    latitude?: number;
    longitude?: number;
}