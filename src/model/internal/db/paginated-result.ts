import { Query } from "./query";

export interface PaginatedResult<T> {
    items: T[];
    query: Query;
}