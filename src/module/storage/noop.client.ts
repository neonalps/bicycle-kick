import { StorageClient } from "./client";

export class NoopClient implements StorageClient {

    async uploadFile(path: string, filename: string): Promise<void> {
        console.log(`noop storage client received file with path '${path}' and filename '${filename}'`);
    }

}