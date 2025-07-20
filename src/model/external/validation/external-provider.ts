import { ExternalProvider } from "@src/model/type/external-provider";
import { StringEnumType } from "./types";

export const externalProviderValidation: StringEnumType = {
    type: 'string',
    enum: [ ExternalProvider.Fotmob, ExternalProvider.Sofascore, ExternalProvider.User ],
} as const;