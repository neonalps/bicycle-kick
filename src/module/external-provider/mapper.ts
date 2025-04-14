import { Sql } from "@src/db";
import { ExternalProviderPerson } from "@src/model/internal/external-provider-person";
import { ExternalProviderPersonDaoInterface } from "@src/model/internal/interface/external-provider-person.interface";
import { IdInterface } from "@src/model/internal/interface/id.interface";
import { ExternalProvider } from "@src/model/type/external-provider";

export class ExternalProviderMapper {

    constructor(private readonly sql: Sql) {}

    async createExternalProviderPerson(provider: ExternalProvider, externalId: string, personId: number): Promise<ExternalProviderPerson> {
        const result = await this.sql<IdInterface[]>`insert into external_provider_person (external_provider, external_id, person_id) values (${provider}, ${externalId}, ${personId}) returning id`;
        if (result.length !== 1) {
            this.throwCouldNotInsertError();
        }

        const createdExternalProviderPerson = await this.getPersonById(result[0].id);
        if (createdExternalProviderPerson === null) {
            this.throwCouldNotInsertError();
        }

        return createdExternalProviderPerson as ExternalProviderPerson;
    }

    async getPersonByExternalProvider(provider: ExternalProvider, externalId: string): Promise<ExternalProviderPerson | null> {
        const result = await this.sql<ExternalProviderPersonDaoInterface[]>`select * from external_provider_person where external_provider = ${ provider } and external_id = ${ externalId }`;
        if (result.length !== 1) {
            return null;
        }

        return this.convertToEntity(result[0]);
    }

    private async getPersonById(id: number): Promise<ExternalProviderPerson | null> {
        const result = await this.sql<ExternalProviderPersonDaoInterface[]>`select * from external_provider_person where id = ${ id }`;
        if (result.length !== 1) {
            return null;
        }

        return this.convertToEntity(result[0]);
    }

    private convertToEntity(item: ExternalProviderPersonDaoInterface): ExternalProviderPerson {
        return {
            id: item.id,
            externalProvider: item.externalProvider as ExternalProvider,
            externalId: item.externalId,
            personId: item.personId,
        }
    }

    private throwCouldNotInsertError(): void {
        throw new Error(`Could not insert external provider person`);
    }

}