import { DateFormat } from "@src/model/type/date-format";
import { Language } from "@src/model/type/language";
import { ScoreFormat } from "@src/model/type/score-format";
import { GameMinuteFormat } from "../type/game-minute-format";

export interface ProfileSettings {
    firstName?: string;
    lastName?: string;
    hasProfilePicture: boolean;
    language: Language;
    dateFormat: DateFormat;
    scoreFormat: ScoreFormat;
    gameMinuteFormat: GameMinuteFormat;
}