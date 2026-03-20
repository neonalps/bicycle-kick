import { AccountRole } from "@src/model/type/account-role";
import { Nullish } from "@src/util/types";
import { Language } from "@src/model/type/language";
import { DateFormat } from "@src/model/type/date-format";
import { ScoreFormat } from "@src/model/type/score-format";
import { GameMinuteFormat } from "@src/model/type/game-minute-format";

export interface CreateAccountDto {
    email: string;
    firstName?: string;
    lastName?: string;
    role: AccountRole;
    language: Nullish<Language>;
    dateFormat: Nullish<DateFormat>;
    scoreFormat: Nullish<ScoreFormat>;
    gameMinuteFormat: Nullish<GameMinuteFormat>;
}