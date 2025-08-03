import { Sql } from "@src/db";
import { ExternalProviderPerson } from "@src/model/internal/external-provider-person";
import { ExternalProviderClubDaoInterface } from "@src/model/internal/interface/external-provider-club.interface copy";
import { ExternalProviderPersonDaoInterface } from "@src/model/internal/interface/external-provider-person.interface";
import { IdInterface } from "@src/model/internal/interface/id.interface";
import { ExternalProvider } from "@src/model/type/external-provider";
import { ClubId, PersonId } from "@src/util/domain-types";

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

    async getExternalProvidersForPerson(personId: PersonId): Promise<ReadonlyArray<ExternalProviderPerson>> {
        const result = await this.sql<ExternalProviderPersonDaoInterface[]>`select * from external_provider_person where person_id = ${ personId }`;
        if (result.length === 0) {
            return [];
        }

        return result.map(item => this.convertToEntity(item));
    }

    async getMultipleClubIdsByExternalProvider(provider: ExternalProvider, externalIds: ReadonlyArray<string>): Promise<Map<string, ClubId>> {
        const result = await this.sql<ExternalProviderClubDaoInterface[]>`select * from external_provider_club where external_provider = ${ provider } and external_id in ${ this.sql(externalIds) }`;
        if (result.length === 0) {
            return new Map();
        }

        return result.reduce((acc, current) => {
            acc.set(current.externalId, current.clubId);
            return acc;
        }, new Map<string, ClubId>());
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