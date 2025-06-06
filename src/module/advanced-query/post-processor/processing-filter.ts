import { Filter } from "@src/module/advanced-query/filter/base";

export interface PostProcessingFilter extends Filter {
    process(input: unknown): boolean;
}

export function isPostProcessingFilter(object: any): object is PostProcessingFilter {
    return 'process' in object;
}