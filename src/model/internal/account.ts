import { AccountRole } from "@src/model/type/account-role";
import { Language } from "@src/model/type/language";
import { DateFormat } from "@src/model/type/date-format";
import { ScoreFormat } from "@src/model/type/score-format";
import { GameMinuteFormat } from "@src/model/type/game-minute-format";

export interface Account {
    id: number;
    publicId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    roles: AccountRole;
    enabled: boolean;
    hasProfilePicture: boolean;
    language: Language;
    dateFormat: DateFormat;
    scoreFormat: ScoreFormat;
    gameMinuteFormat: GameMinuteFormat;
    createdAt: Date;
}