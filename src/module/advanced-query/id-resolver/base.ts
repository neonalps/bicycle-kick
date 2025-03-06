import { FilterParameter } from "@src/module/advanced-query/filter/parameter";

export interface ResolvePossibility {
    id: number;
    name: string;
    description?: string;
}

export interface IdResolveResult {
    forId: string;
    resolved?: number;
    possibilities?: ResolvePossibility[];
}

export abstract class IdResolver {

    abstract fetchPossibilities(parameter: FilterParameter): Promise<ResolvePossibility[]>;

    async resolve(parameters: FilterParameter[]): Promise<IdResolveResult[]> {
        return Promise.all(parameters.map(parameter => this.resolveSingle(parameter)));
    }

    private async resolveSingle(parameter: FilterParameter): Promise<IdResolveResult> {
        if (parameter.needsResolving === false) {
            throw new Error(`Parameter passed that does not need resolving`);
        }

        const possibilities = await this.fetchPossibilities(parameter);
        if (possibilities.length === 1) {
            return {
                forId: parameter.id,
                resolved: possibilities[0].id,
            };
        } else if (possibilities.length >= 10) {
            throw new Error("Too many possibilities, try using a more precise term");
        } else {
            return {
                forId: parameter.id,
                possibilities: possibilities.map(item => {
                    return { id: item.id, name: item.name };
                })
            }
        }
    }

}