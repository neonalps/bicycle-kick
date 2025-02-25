export enum SortOrder {
    ASCENDING = "asc",
    DESCENDING = "desc",
};

export interface PaginationParams<T> {
    lastSeen: T;
    limit: number;
    order: SortOrder;
}

export interface PaginationQueryParams {
    nextPageKey?: string;
    limit?: number;
    order?: SortOrder;
}

export const PAGINATED_REQUEST_QUERYSTRING_SCHEMA_PROPERTIES = {
    limit: { type: 'number' },
    order: { type: 'string', enum: [ SortOrder.ASCENDING, SortOrder.DESCENDING ] },
    nextPageKey: { type: 'string' },
};