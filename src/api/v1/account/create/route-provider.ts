import { AccountDto } from "@src/model/external/dto/account";
import { Capability } from "@src/model/internal/capabilities";
import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { CreateAccountRouteHandler } from "./handler";
import { requireNonNull } from "@src/util/common";
import { CreateAccountRequestDto } from "@src/model/external/dto/create-account-request";
import { Language } from "@src/model/type/language";
import { GameMinuteFormat } from "@src/model/type/game-minute-format";
import { ScoreFormat } from "@src/model/type/score-format";

export class CreateAccountRouteProvider implements RouteProvider<CreateAccountRequestDto, AccountDto> {

    private readonly handler: CreateAccountRouteHandler;

    constructor(handler: CreateAccountRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<CreateAccountRequestDto, AccountDto> {
        const schema: RequestSchema = {
            body: {
                type: 'object',
                required: ['email', 'firstName', 'lastName', 'role'],
                properties: {
                    email: { type: 'string' },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    role: { type: 'string' },
                    language: { type: 'string', enum: [Language.AustrianGerman, Language.BritishEnglish] },
                    gameMinuteFormat: { type: 'string', enum: [GameMinuteFormat.Apostrophe, GameMinuteFormat.Dot] },
                    scoreFormat: { type: 'string', enum: [ScoreFormat.Colon, ScoreFormat.Hyphen] },
                    skipInvitationMail: { type: 'boolean' },
                },
                additionalProperties: false,
            },
        };

        return {
            name: 'CreateAccount',
            method: 'POST',
            path: '/api/v1/accounts',
            schema,
            handler: this.handler,
            authenticated: true,
            requiredCapabilities: [
                Capability.WriteAccount,
            ]
        }
    }

}