import { DateFormat } from "@src/model/type/date-format";
import { GameMinuteFormat } from "@src/model/type/game-minute-format";
import { Language } from "@src/model/type/language";
import { ScoreFormat } from "@src/model/type/score-format";

export interface ProfileSettingsDto {
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
    language: Language;
    dateFormat: DateFormat;
    scoreFormat: ScoreFormat;
    gameMinuteFormat: GameMinuteFormat;
}