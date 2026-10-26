export interface StorageClient {
    uploadFile(path: string, filename: string): Promise<void>;
}