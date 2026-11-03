import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { RemoveClubAvatarRouteHandler } from "./handler";
import { Capability } from "@src/model/internal/capabilities";
import { RemoveClubAvatarRequestDto } from "@src/model/external/dto/remove-club-avatar-request";

export class RemoveClubAvatarRouteProvider implements RouteProvider<RemoveClubAvatarRequestDto, void> {

    private readonly handler: RemoveClubAvatarRouteHandler;

    constructor(handler: RemoveClubAvatarRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<RemoveClubAvatarRequestDto, void> {
        const schema: RequestSchema = {
            params: {
                type: 'object',
                required: [ 'personId' ],
                properties: {
                    personId: { type: 'string' },
                },
                additionalProperties: false,
            },
        };

        return {
            name: 'RemoveClubAvatar',
            method: 'DELETE',
            path: '/api/v1/clubs/:clubId/avatar',
            schema,
            handler: this.handler,
            authenticated: true,
            requiredCapabilities: [
                Capability.WriteClub,
            ],
            response: {
                statusCode: 204,
            },
        }
    }

}