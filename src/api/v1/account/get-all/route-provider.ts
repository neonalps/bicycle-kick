import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { PaginatedResponseDto } from "@src/model/external/dto/paginated-response";
import { PAGINATED_REQUEST_QUERYSTRING_SCHEMA_PROPERTIES } from "@src/module/pagination/constants";
import { Capability } from "@src/model/internal/capabilities";
import { GetAccountsRequestDto } from "@src/model/external/dto/get-accounts-request";
import { AccountDto } from "@src/model/external/dto/account";
import { GetAllAccountsRouteHandler } from "./handler";

export class GetAllAccountsRouteProvider implements RouteProvider<GetAccountsRequestDto, PaginatedResponseDto<AccountDto>> {

    private readonly handler: GetAllAccountsRouteHandler;

    constructor(handler: GetAllAccountsRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<GetAccountsRequestDto, PaginatedResponseDto<AccountDto>> {
        const schema: RequestSchema = {
            querystring: {
                type: 'object',
                required: [],
                properties: {
                    ...PAGINATED_REQUEST_QUERYSTRING_SCHEMA_PROPERTIES,
                    role: { type: 'string' },
                    search: { type: 'string' },
                },
                additionalProperties: false,
            },
        };

        return {
            name: 'GetAccounts',
            method: 'GET',
            path: '/api/v1/accounts',
            schema,
            handler: this.handler,
            authenticated: true,
            requiredCapabilities: [
                Capability.ReadUser,
            ]
        }
    }

}