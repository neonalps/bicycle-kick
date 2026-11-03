import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { Capability } from "@src/model/internal/capabilities";
import { SetPersonAvatarRequestDto } from "@src/model/external/dto/set-person-avatar-request";
import { BasicPersonDto } from "@src/model/external/dto/basic-person";
import { SetPersonAvatarRouteHandler } from "./handler";

export class SetPersonAvatarRouteProvider implements RouteProvider<SetPersonAvatarRequestDto, BasicPersonDto> {

    private readonly handler: SetPersonAvatarRouteHandler;

    constructor(handler: SetPersonAvatarRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<SetPersonAvatarRequestDto, BasicPersonDto> {
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
            name: 'SetPersonAvatar',
            method: 'PUT',
            path: '/api/v1/people/:personId/avatar',
            schema,
            handler: this.handler,
            authenticated: true,
            fileUpload: true,
            requiredCapabilities: [
                Capability.WritePerson,
            ],
        }
    }

}