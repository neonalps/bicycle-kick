import { ClarificationQueryDto } from "@src/model/external/dto/clarification-query";
import { DetailedGameDto } from "./detailed-game";
import { SearchAnswerDto } from "./search-answer";

export interface MagicSearchResponseDto {
    response: string;
    clarification?: ClarificationQueryDto;
    gameDetails?: DetailedGameDto[];
    answer: SearchAnswerDto;
}