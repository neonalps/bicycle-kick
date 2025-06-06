import { ScenarioDescriptor } from "@src/module/advanced-query/scenario/descriptor";
import { Language } from "@src/module/advanced-query/scenario/constants";

export interface TokenizerResult {
    id: string;
    language: Language;
    descriptor: ScenarioDescriptor;
}

export interface Tokenizer {
    getLanguage(): Language;
    tokenize(raw: string): Promise<ScenarioDescriptor | null>;
}