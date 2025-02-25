export interface PaginatedResponseDto<T> {
    items: T[];
    nextPageKey?: string;
}