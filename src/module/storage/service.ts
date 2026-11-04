import { BusboyFileStream } from "node_modules/@fastify/busboy/types";
import { StorageClient } from "./client";

export type StorageFile = {
    path: string;
    filename: string;
}

export class StorageService {

    constructor(
        private readonly storageClient: StorageClient,
    ) {}

    async uploadFile(file: StorageFile, stream: BusboyFileStream): Promise<void> {
        return await this.storageClient.uploadFile(file, stream);
    }

    async deleteFile(file: StorageFile): Promise<void> {
        return await this.storageClient.removeFile(file);
    }

}