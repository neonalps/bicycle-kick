export type QueryComparator = '>' | '>=' | '<' | '<=' | '=';

export type ValueWithModifier = {
    modifier: QueryComparator;
    value: number;
}