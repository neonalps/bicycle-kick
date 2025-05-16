import { SearchEntity } from "@src/module/search/entities";

export interface RegularSearchRequestDto {
    search: string;
    filters?: SearchEntity[];
}