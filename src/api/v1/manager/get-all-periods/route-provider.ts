import { GetManagerPeriodsRequestDto } from "@src/model/external/dto/get-manager-periods-request";
import { ManagerPeriodDto } from "@src/model/external/dto/manager-period";
import { PaginatedResponseDto } from "@src/model/external/dto/paginated-response";
import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { GetAllManagerPeriodsRouteHandler } from "./handler";
import { PAGINATED_REQUEST_QUERYSTRING_SCHEMA_PROPERTIES } from "@src/module/pagination/constants";
import { Capability } from "@src/model/internal/capabilities";

export class GetAllManagerPeriodsRouteProvider implements RouteProvider<GetManagerPeriodsRequestDto, PaginatedResponseDto<ManagerPeriodDto>> {

    private readonly handler: GetAllManagerPeriodsRouteHandler;

    constructor(handler: GetAllManagerPeriodsRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<GetManagerPeriodsRequestDto, PaginatedResponseDto<ManagerPeriodDto>> {
        const schema: RequestSchema = {
            querystring: {
                type: 'object',
                required: [],
                properties: {
                    ...PAGINATED_REQUEST_QUERYSTRING_SCHEMA_PROPERTIES,
                },
                additionalProperties: false,
            }
        };

        return {
            name: 'GetManagerPeriods',
            method: 'GET',
            path: '/api/v1/managers/periods',
            schema,
            handler: this.handler,
            authenticated: true,
            requiredCapabilities: [
                Capability.ReadGame,
                Capability.ReadPerson,
                Capability.ReadStats,
            ]
        }
    }

}