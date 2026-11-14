import { HttpClient } from "@src/http/client";
import { StorageClient } from "./client";
import { BusboyFileStream } from "node_modules/@fastify/busboy/types";
import { StorageFile } from "./service";

export interface BunnyClientConfig {
    accessKey: string;
    storageZoneName: string;
}

export class BunnyClient implements StorageClient {

    constructor(
        private readonly config: BunnyClientConfig,
        private readonly httpClient: HttpClient,
    ) {}

    async uploadFile(file: StorageFile, fileStream: BusboyFileStream): Promise<void> {
        const response = await this.httpClient.put(`https://storage.bunnycdn.com/${this.config.storageZoneName}/${file.path}/${file.filename}`, 
            {
                headers: {
                    'AccessKey': this.config.accessKey,
                    'Content-Type': 'application/octet-stream',
                },
                body: fileStream,
            }
        );

        if (response.statusCode !== 201) {
            throw new Error(`Failed to upload file: ${response.errorMessage}`);
        }
    }

    async removeFile(file: StorageFile): Promise<void> {
        const response = await this.httpClient.del(`https://storage.bunnycdn.com/${this.config.storageZoneName}/${file.path}/${file.filename}`, 
            {
                headers: {
                    'AccessKey': this.config.accessKey,
                },
            }
        );

        if (response.statusCode !== 200) {
            throw new Error(`Failed to remove file: ${response.errorMessage}`);
        }
    }

}