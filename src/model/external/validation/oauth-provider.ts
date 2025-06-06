import { StringEnumType } from "./types";
import { AuthProvider } from "@src/module/auth/oauth/constants";

export const oAuthProviderValidation: StringEnumType = {
    type: 'string',
    enum: [AuthProvider.Google],
} as const;