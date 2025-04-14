import { requireNonNull } from "@src/util/common";
import { validateNotBlank } from "@src/util/validation";

export interface GoogleOAuthClientConfig {
    clientId: string;
    clientSecret: string;
}

export class GoogleOAuthClient {

    private readonly config: GoogleOAuthClientConfig;

    constructor(config: GoogleOAuthClientConfig) {
        this.config = requireNonNull(config);

        validateNotBlank(config.clientId, "config.clientId");
        validateNotBlank(config.clientSecret, "config.clientSecret");
    }

}