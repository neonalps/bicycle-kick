import { BusboyFileStream } from "node_modules/@fastify/busboy/types";
import { StorageClient } from "./client";

export class StorageService {

    constructor(
        private readonly storageClient: StorageClient,
    ) {}

    async uploadFile(path: string, filename: string, stream: BusboyFileStream): Promise<void> {
        return await this.storageClient.uploadFile(path, filename, stream);
    }

}