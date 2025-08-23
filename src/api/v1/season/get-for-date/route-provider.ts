import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { SmallSeasonDto } from "@src/model/external/dto/small-season";
import { GetSeasonForDateHandler } from "./handler";
import { GetSeasonForDateRequestDto } from "@src/model/external/dto/get-season-for-date-request";
import { Capability } from "@src/model/internal/capabilities";

export class GetSeasonForDateRouteProvider implements RouteProvider<GetSeasonForDateRequestDto, SmallSeasonDto> {

    private readonly handler: GetSeasonForDateHandler;

    constructor(handler: GetSeasonForDateHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<GetSeasonForDateRequestDto, SmallSeasonDto> {
        const schema: RequestSchema = {
            querystring: {
                type: 'object',
                required: ['date'],
                properties: {
                    date: { type: 'string' }
                },
                additionalProperties: false,
            },
        };

        return {
            name: 'GetSeasonForDate',
            method: 'GET',
            path: '/api/v1/seasons/by-date',
            schema,
            handler: this.handler,
            authenticated: true,
            requiredCapabilities: [
                Capability.ReadSeason,
            ]
        }
    }

}