import { ScenarioDescriptor } from "@src/module/advanced-query/scenario/descriptor";

export interface Tokenizer {
    tokenize(raw: string): ScenarioDescriptor | null;
}