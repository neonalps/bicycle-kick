import { HttpClient } from "@src/http/client";

export interface BunnyClientConfig {
    accessKey: string;
    storageZoneName: string;
}

export class BunnyClient {

    constructor(
        private readonly config: BunnyClientConfig,
        private readonly httpClient: HttpClient,
    ) {}

    async uploadFile(path: string, filename: string) {
        return await this.httpClient.put(`https://storage.bunnycdn.com/${this.config.storageZoneName}/${path}/${filename}`, 
            {
                headers: {
                    'AccessKey': this.config.accessKey,
                    'Content-Type': 'application/octet-stream',
                },
            }
        );
    }

}