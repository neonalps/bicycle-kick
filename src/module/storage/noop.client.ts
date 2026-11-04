import { StorageClient } from "./client";
import { StorageFile } from "./service";

export class NoopClient implements StorageClient {

    async uploadFile(file: StorageFile): Promise<void> {
        console.log(`noop storage client received upload file with path '${file.path}' and filename '${file.filename}'`);
    }

    async removeFile(file: StorageFile): Promise<void> {
        console.log(`noop storage client received delete file with path '${file.path}' and filename '${file.filename}'`);
    }

}