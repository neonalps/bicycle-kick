import { AdvancedQueryService } from "@src/module/advanced-query/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { MagicSearchRequestDto } from "@src/model/external/dto/magic-search-request";
import { MagicSearchResponseDto } from "@src/model/external/dto/magic-search-response";
import { AdvancedQueryResult } from "@src/module/advanced-query/result";
import { ApiHelperService } from "@src/module/api-helper/service";
import { SearchAnswerDto } from "@src/model/external/dto/search-answer";
import { ParagraphType, TextParagraph } from "@src/module/advanced-query/answer/composer";
import { assertUnreachable } from "@src/util/common";

export class MagicSearchRouteHandler implements RouteHandler<MagicSearchRequestDto, MagicSearchResponseDto> {

    constructor(private readonly advancedQueryService: AdvancedQueryService, private readonly apiHelperService: ApiHelperService) {}

    public async handle(_: AuthenticationContext, dto: MagicSearchRequestDto): Promise<MagicSearchResponseDto> {
        const queryResult = await this.advancedQueryService.search(dto.inquiry) as AdvancedQueryResult;
        
        const games = queryResult.games;
        const detailedResults = await this.apiHelperService.getOrderedDetailedGameDtos(games.map(game => game.id));

        const answerDto: SearchAnswerDto = {
            paragraphs: [],
        };

        for (const paragraph of queryResult.answer.paragraphs) {
            const paragraphType = paragraph.type;
            switch (paragraphType) {
                case ParagraphType.Text:
                    answerDto.paragraphs.push({
                        type: ParagraphType.Text,
                        content: (paragraph as TextParagraph).content,
                    })
                    break;
                default:
                    assertUnreachable(paragraphType);
            }
        }

        return {
            gameDetails: detailedResults,
            response: queryResult.query,
            answer: answerDto,
        }
    }

}