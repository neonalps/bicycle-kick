import { BunnyClient } from "./bunny.client";
import { NoopClient } from "./noop.client";

export class StorageService {

    constructor(
        private readonly bunnyClient: BunnyClient,
        private readonly noopClient: NoopClient,
    ) {}

}