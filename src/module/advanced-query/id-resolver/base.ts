import { FilterParameter } from "@src/module/advanced-query/filter/parameter";

export interface ResolvePossibility {
    id: number;
    name: string;
    position?: number;
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
        return await Promise.all(parameters
            .filter(parameter => parameter.needsResolving === true)
            .map(parameter => this.resolveSingle(parameter))
        );
    }

    private async resolveSingle(parameter: FilterParameter): Promise<IdResolveResult> {
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
                possibilities: possibilities.map((item, idx) => {
                    return { id: item.id, position: idx + 1, name: item.name };
                })
            }
        }
    }

}