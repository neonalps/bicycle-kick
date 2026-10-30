import { BusboyFileStream } from "node_modules/@fastify/busboy/types";

export interface StorageClient {
    uploadFile(path: string, filename: string, stream: BusboyFileStream): Promise<void>;
}