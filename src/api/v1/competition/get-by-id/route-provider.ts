import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { GetCompetitionByIdRequestDto } from "@src/model/external/dto/get-competition-by-id-request";
import { CompetitionResponseDto } from "@src/model/external/dto/competition-response";
import { GetCompetitionByIdRouteHandler } from "./handler";

export class GetCompetitionByIdRouteProvider implements RouteProvider<GetCompetitionByIdRequestDto, CompetitionResponseDto> {

    private readonly handler: GetCompetitionByIdRouteHandler;
    
    constructor(handler: GetCompetitionByIdRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<GetCompetitionByIdRequestDto, CompetitionResponseDto> {
        const schema: RequestSchema = {};

        return {
            name: 'GetCompetitionById',
            method: 'GET',
            path: '/api/v1/competitions/:competitionId',
            schema,
            handler: this.handler,
            authenticated: true,
            requiredCapabilities: []
        }
    }

}