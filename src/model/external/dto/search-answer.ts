import { ParagraphType } from "@src/module/advanced-query/answer/composer"
import { BasicGameDto } from "./basic-game";

export interface TextParagraphDto {
    type: ParagraphType.Text,
    content: string;
}

export interface GameLinkParagraphDto {
    type: ParagraphType.GameLink,
    content: BasicGameDto;
}

export interface SearchAnswerDto {
    paragraphs: (TextParagraphDto | GameLinkParagraphDto)[];
}