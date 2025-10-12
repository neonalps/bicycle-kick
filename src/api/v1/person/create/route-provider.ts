import { BasicPersonDto } from "@src/model/external/dto/basic-person";
import { CreatePersonRequestDto } from "@src/model/external/dto/create-person-request";
import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { CreatePersonRouteHandler } from "./handler";
import { requireNonNull } from "@src/util/common";
import { Capability } from "@src/model/internal/capabilities";

export class CreatePersonRouteProvider implements RouteProvider<CreatePersonRequestDto, BasicPersonDto> {

    private readonly handler: CreatePersonRouteHandler;

    constructor(handler: CreatePersonRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<CreatePersonRequestDto, BasicPersonDto> {
        const schema: RequestSchema = {
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
            name: 'CreatePerson',
            method: 'POST',
            path: '/api/v1/people',
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