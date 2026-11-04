import { BusboyFileStream } from "node_modules/@fastify/busboy/types";
import { StorageFile } from "./service";

export interface StorageClient {
    uploadFile(file: StorageFile, stream: BusboyFileStream): Promise<void>;
    removeFile(file: StorageFile): Promise<void>;
}