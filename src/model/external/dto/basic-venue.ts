export interface BasicVenueDto {
    id: number;
    name: string;
    shortName: string;
    city: string;
    district?: string;
    countryCode: string;
    capacity?: number;
    latitude?: number;
    longitued?: number;
}