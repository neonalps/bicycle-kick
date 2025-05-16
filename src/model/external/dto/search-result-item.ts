import { SearchEntity } from "@src/module/search/entities";

export interface SearchResultItemDto {
    type: SearchEntity,
    entityId: number;
    icon?: string;
    title: string;
    sub?: string;
    popularity?: number;
}