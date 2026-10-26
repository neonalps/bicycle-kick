import { BunnyClient } from "./bunny.client";

export class StorageService {

    constructor(
        private readonly bunnyClient: BunnyClient,
    ) {}

}