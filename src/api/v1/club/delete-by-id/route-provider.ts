import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { DeleteClubByIdRouteHandler } from "./handler";
import { Capability } from "@src/model/internal/capabilities";
import { DeleteClubByIdRequestDto } from "@src/model/external/dto/delete-club-by-id-request";

export class DeleteClubByIdRouteProvider implements RouteProvider<DeleteClubByIdRequestDto, void> {

    private readonly handler: DeleteClubByIdRouteHandler;

    constructor(handler: DeleteClubByIdRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<DeleteClubByIdRequestDto, void> {
        const schema: RequestSchema = {
            params: {
                type: 'object',
                required: [ 'clubId' ],
                properties: {
                    clubId: { type: 'string' },
                },
                additionalProperties: false,
            },
        };

        return {
            name: 'DeleteClubById',
            method: 'DELETE',
            path: '/api/v1/clubs/:clubId',
            schema,
            handler: this.handler,
            authenticated: true,
            requiredCapabilities: [
                Capability.ReadClub,
                Capability.WriteClub,
            ],
        }
    }

}