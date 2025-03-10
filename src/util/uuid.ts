export class UuidSource {

    getRandom(): string {
        return crypto.randomUUID();
    }

}