import { BasicGameDto } from "./basic-game";
import { UserGameInformationDto } from "./user-game-information";

export type UserBasicGameDto = BasicGameDto & UserGameInformationDto;