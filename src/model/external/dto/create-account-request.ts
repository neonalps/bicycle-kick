import { AccountRole } from "@src/model/type/account-role";
import { GameMinuteFormat } from "@src/model/type/game-minute-format";
import { Language } from "@src/model/type/language";
import { ScoreFormat } from "@src/model/type/score-format";

export interface CreateAccountRequestDto {
    email: string;
    firstName: string;
    lastName: string;
    role: AccountRole;
    language?: Language;
    gameMinuteFormat?: GameMinuteFormat;
    scoreFormat?: ScoreFormat;
    skipInvitationMail?: boolean;
}