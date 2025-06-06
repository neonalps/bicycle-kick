import { ClarificationQueryDto } from "@src/model/external/dto/clarification-query";
import { DetailedGameDto } from "./detailed-game";

export interface MagicSearchResponseDto {
    response: string;
    clarification?: ClarificationQueryDto;
    gameDetails?: DetailedGameDto[]; 
}