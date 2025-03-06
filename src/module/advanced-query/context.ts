export interface QueryContext {
    select: string[];
    from: string[];
    where: string[];
    orderBy: string[];
    limit?: string;
}