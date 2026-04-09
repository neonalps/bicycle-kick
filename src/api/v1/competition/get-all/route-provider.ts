import { BasicCompetitionDto } from "@src/model/external/dto/basic-competition";
import { GetAllCompetitionsRequestDto } from "@src/model/external/dto/get-all-competitions-request";
import { PaginatedResponseDto } from "@src/model/external/dto/paginated-response";
import { CacheableResponse, RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { GetAllCompetitionsRouteHandler } from "./handler";
import { requireNonNull } from "@src/util/common";

export class GetAllCompetitionsRouteProvider implements RouteProvider<GetAllCompetitionsRequestDto, CacheableResponse<PaginatedResponseDto<BasicCompetitionDto>>> {

    private readonly handler: GetAllCompetitionsRouteHandler;
    
    constructor(handler: GetAllCompetitionsRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<GetAllCompetitionsRequestDto, CacheableResponse<PaginatedResponseDto<BasicCompetitionDto>>> {
        const schema: RequestSchema = {};

        return {
            name: 'GetAllCompetitions',
            method: 'GET',
            path: '/api/v1/competitions',
            schema,
            handler: this.handler,
            authenticated: true,
            requiredCapabilities: []
        }
    }

}