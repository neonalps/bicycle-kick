import { ParagraphType } from "@src/module/advanced-query/answer/composer"

export interface TextParagraphDto {
    type: ParagraphType.Text,
    content: string;
}

export interface SearchAnswerDto {
    paragraphs: TextParagraphDto[];
}