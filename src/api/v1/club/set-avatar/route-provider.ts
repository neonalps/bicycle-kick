import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { Capability } from "@src/model/internal/capabilities";
import { SetClubAvatarRouteHandler } from "./handler";
import { SetClubAvatarRequestDto } from "@src/model/external/dto/set-club-avatar-request";
import { BasicClubDto } from "@src/model/external/dto/basic-club";

export class SetClubAvatarRouteProvider implements RouteProvider<SetClubAvatarRequestDto, BasicClubDto> {

    private readonly handler: SetClubAvatarRouteHandler;

    constructor(handler: SetClubAvatarRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<SetClubAvatarRequestDto, BasicClubDto> {
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
            name: 'SetClubAvatar',
            method: 'PUT',
            path: '/api/v1/clubs/:clubId/avatar',
            schema,
            handler: this.handler,
            authenticated: true,
            fileUpload: true,
            requiredCapabilities: [
                Capability.WriteClub,
            ],
        }
    }

}