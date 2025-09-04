import { DateFormat } from "@src/model/type/date-format";
import { Language } from "@src/model/type/language";
import { ScoreFormat } from "@src/model/type/score-format";

export interface UpdateAccountProfileDto {
    firstName: string;
    lastName: string;
    language: Language;
    dateFormat: DateFormat;
    scoreFormat: ScoreFormat;
}