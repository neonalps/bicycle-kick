import { PostProcessingHandler } from "@src/module/advanced-query/post-processor/handler";
import { ParameterName } from "@src/module/advanced-query/scenario/constants";

export interface FilterParameter {
    id: string;
    name: ParameterName;
    value: string[];
    needsResolving: boolean;
    postProcessing?: PostProcessingHandler;
}