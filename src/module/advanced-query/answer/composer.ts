import { BasicGameDto } from "@src/model/external/dto/basic-game";
import { Language } from "@src/module/advanced-query/scenario/constants";

export enum ParagraphType {
    GameLink = "gameLink",
    Text = "text",
}

export interface Paragraph {
    type: ParagraphType;
}

export interface GameLinkParagraph extends Paragraph {
    type: ParagraphType.GameLink;
    content: BasicGameDto;
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