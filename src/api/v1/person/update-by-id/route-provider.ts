import { BasicPersonDto } from "@src/model/external/dto/basic-person";
import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { Capability } from "@src/model/internal/capabilities";
import { UpdatePersonRequestDto } from "@src/model/external/dto/update-person-request";
import { UpdatePersonByIdRouteHandler } from "./handler";

export class UpdatePersonByIdRouteProvider implements RouteProvider<UpdatePersonRequestDto, BasicPersonDto> {

    private readonly handler: UpdatePersonByIdRouteHandler;

    constructor(handler: UpdatePersonByIdRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<UpdatePersonRequestDto, BasicPersonDto> {
        const schema: RequestSchema = {
            params: {
                type: 'object',
                required: ['personId'],
                properties: {
                    personId: { type: 'string' }
                },
                additionalProperties: false,
            },
            body: {
                type: 'object',
                required: [ 'lastName' ],
                properties: {
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    birthday: { type: 'string' },
                    deathday: { type: 'string' },
                    avatar: { type: 'string' },
                    nationalities: { type: 'array', items: { type: 'string' } },
                },
                additionalProperties: false,
            },
        };

        return {
            name: 'UpdatePersonById',
            method: 'PUT',
            path: '/api/v1/people/:personId',
            schema,
            handler: this.handler,
            authenticated: true,
            requiredCapabilities: [
                Capability.ReadPerson,
                Capability.WritePerson,
            ]
        }
    }

}