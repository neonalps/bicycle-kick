import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { RemovePersonAvatarRouteHandler } from "./handler";
import { Capability } from "@src/model/internal/capabilities";
import { RemovePersonAvatarRequestDto } from "@src/model/external/dto/remove-person-avatar-request";

export class RemovePersonAvatarRouteProvider implements RouteProvider<RemovePersonAvatarRequestDto, void> {

    private readonly handler: RemovePersonAvatarRouteHandler;

    constructor(handler: RemovePersonAvatarRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<RemovePersonAvatarRequestDto, void> {
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
            name: 'RemovePersonAvatar',
            method: 'DELETE',
            path: '/api/v1/people/:personId/avatar',
            schema,
            handler: this.handler,
            authenticated: true,
            requiredCapabilities: [
                Capability.WritePerson,
            ],
            response: {
                statusCode: 204,
            },
        }
    }

}