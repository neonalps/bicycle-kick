import { GameId } from "@src/util/domain-types";

export interface AccountGameInformationDto {
    attended: GameId[];
    stars: GameId[];
}