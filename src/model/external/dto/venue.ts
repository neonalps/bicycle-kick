export interface VenueDto {
    id: number;
    name: string;
    city: string;
    countryCode: string;
    lat: number;
    lng: number;
    capacity: number;
    brandings: string[];
}