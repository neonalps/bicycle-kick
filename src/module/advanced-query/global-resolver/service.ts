import { ClubService } from "@src/module/club/service";
import { CompetitionService } from "@src/module/competition/service";
import { PersonService } from "@src/module/person/service";
import { EntityName } from "@src/module/advanced-query/scenario/constants";

export interface GlobalResolveServiceConfig {

}

export interface Block {
    content: string[];
}

export interface ResolvedEntity {
    name: EntityName;
    id: number;
}

export interface InputElement {
    raw?: string;
    block?: Block;
    resolvedEntity?: ResolvedEntity;
}

export class GlobalResolveService {

    constructor(
        private readonly config: GlobalResolveServiceConfig,
        private readonly clubService: ClubService,
        private readonly competitionService: CompetitionService,
        private readonly personService: PersonService,
    ) {}

    async resolve(input: string[], dictionaryContent: string[]): Promise<InputElement[]> {
        const inputElements = this.getInputElements(input, new Set(dictionaryContent));

        for (const element of inputElements) {
            if (element.raw !== undefined) {
                continue;
            }

            // TODO call services
            /*element.resolvedEntity = {
                name: EntityName.Person,
                id: Math.floor(Math.random() * 100) + 1,
            }*/
        }

        return inputElements;
    }

    private getInputElements(input: string[], dictionary: Set<string>): InputElement[] {
        const elements: InputElement[] = [];

        let currentBlockContent: string[] = [];
        for (const part of input) {
            if (!dictionary.has(part)) {
                currentBlockContent.push(part);
            } else {
                if (currentBlockContent.length > 0) {
                    elements.push({
                        block: {
                            content: currentBlockContent,
                        },
                    });
                    currentBlockContent = [];
                }
                
                elements.push({
                    raw: part,
                });
            }
        }

        return elements;
    }

}