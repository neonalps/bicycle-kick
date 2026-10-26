import { StorageClient } from "./client";

export class NoopClient implements StorageClient {

    async uploadFile(path: string, filename: string): Promise<void> {}

}