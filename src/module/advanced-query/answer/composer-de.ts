import { Language } from "@src/module/advanced-query/scenario/constants";
import { Answer, AnswerComposer, ParagraphType, TextParagraph } from "./composer";

export class GermanAnswerComposer implements AnswerComposer {

    getLanguage() {
        return Language.German;
    }

    async answer(): Promise<Answer> {
        const content: TextParagraph[] = [
            { type: ParagraphType.Text, content: "Sturm hat das letzte Mal am *09.03.2025* ein Derby gegen Grazer AK gewonnen. Das Spiel wurde mit *1:2* gewonnen, die Torschützen waren *Otar Kiteishvili* und *Malick Yalcouye*." }
        ];

        return {
            paragraphs: content,
        };
    }

}