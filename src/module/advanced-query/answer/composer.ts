import { Language } from "@src/module/advanced-query/scenario/constants";

export enum ParagraphType {
    Text = "text",
}

export interface Paragraph {
    type: ParagraphType;
}

export interface TextParagraph extends Paragraph {
    type: ParagraphType.Text;
    content: string;
}

export type Answer = {
    paragraphs: Array<Paragraph>;
}

export interface AnswerComposer {
    getLanguage(): Language;
    answer(): Promise<Answer>;
}