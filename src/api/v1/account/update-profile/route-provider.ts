import { AccountProfileDto } from "@src/model/external/dto/account-profile";
import { RequestSchema, RouteDefinition, RouteProvider } from "@src/router/types";
import { requireNonNull } from "@src/util/common";
import { UpdateAccountProfileDto } from "@src/model/external/dto/update-account-profile";
import { UpdateAccountProfileRouteHandler } from "./handler";
import { GameMinuteFormat } from "@src/model/type/game-minute-format";
import { ScoreFormat } from "@src/model/type/score-format";
import { DateFormat } from "@src/model/type/date-format";
import { Language } from "@src/model/type/language";

export class UpdateAccountProfileRouteProvider implements RouteProvider<UpdateAccountProfileDto, AccountProfileDto> {

    private readonly handler: UpdateAccountProfileRouteHandler;

    constructor(handler: UpdateAccountProfileRouteHandler) {
        this.handler = requireNonNull(handler);
    }

    provide(): RouteDefinition<UpdateAccountProfileDto, AccountProfileDto> {
        const schema: RequestSchema = {
            body: {
                type: 'object',
                required: ['firstName', 'lastName', 'language', 'dateFormat', 'scoreFormat', 'gameMinuteFormat'],
                properties: {
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    language: { type: 'string', enum: [Language.AustrianGerman, Language.BritishEnglish] },
                    dateFormat: { type: 'string', enum: [DateFormat.American, DateFormat.British, DateFormat.European] },
                    scoreFormat: { type: 'string', enum: [ScoreFormat.Colon, ScoreFormat.Hyphen] },
                    gameMinuteFormat: { type: 'string', enum: [GameMinuteFormat.Apostrophe, GameMinuteFormat.Dot] },
                },
                additionalProperties: false,
            }
        };

        return {
            name: 'UpdateAccountProfile',
            method: 'PUT',
            path: '/api/v1/account/profile',
            schema,
            handler: this.handler,
            authenticated: true,
        }
    }

}