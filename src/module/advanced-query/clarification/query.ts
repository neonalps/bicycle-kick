import { ResolvePossibility } from "@src/module/advanced-query/id-resolver/base";
import { FilterParameter } from "@src/module/advanced-query/filter/parameter";

export interface ClarificationQueryItem {
    parameter: Pick<FilterParameter, 'id' | 'value'>;
    possibilities: ResolvePossibility[];
}

export interface ClarificationQuery {
    required: ClarificationQueryItem[];
}