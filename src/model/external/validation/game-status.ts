import { GameStatus } from "@src/model/type/game-status";
import { StringEnumType } from "./types";

export const gameStatusValidation: StringEnumType = {
    type: 'string',
    enum: [GameStatus.Finished, GameStatus.Ongoing, GameStatus.Postponed, GameStatus.Scheduled, GameStatus.Abandoned],
} as const;