import { ClarificationQueryDto } from "@src/model/external/dto/clarification-query";

export interface MagicSearchResponseDto {
    response: string;
    clarification?: ClarificationQueryDto;
}