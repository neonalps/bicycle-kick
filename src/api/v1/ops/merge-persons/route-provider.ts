import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { Capability } from "@src/model/internal/capabilities";
import { MergePersonsRequestDto } from "@src/model/external/dto/merge-persons-request";
import { MergePersonRouteHandler } from "./handler";

export class MergePersonsRouteProvider implements RouteProvider<MergePersonsRequestDto, void> {

    private readonly handler: MergePersonRouteHandler;

    constructor(handler: MergePersonRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<MergePersonsRequestDto, void> {
        const schema: RequestSchema = {
            body: {
                type: 'object',
                required: ['personIds'],
                properties: {
                    personIds: { type: 'array', items: { type: 'number' } },
                },
                additionalProperties: false,
            }
        };

        return {
            name: 'MergePersons',
            method: 'POST',
            path: '/api/v1/ops/merge-persons',
            schema,
            handler: this.handler,
            authenticated: true,
            requiredCapabilities: [
                Capability.WritePerson,
                Capability.WriteGame,
            ]
        }
    }

}