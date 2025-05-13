import hash from 'object-hash';

export class CacheService {

    public getContentHash(input: object): string {
        return hash(input, {
            excludeKeys: key => this.shouldKeyBeExcluded(key),
        });
    }

    private shouldKeyBeExcluded(key: string): boolean {
        return key.startsWith("account");
    }

}