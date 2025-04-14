import { ExternalProvider } from "@src/model/type/external-provider";
import { validateNotBlank, validateNotNull } from "@src/util/validation";
import { ExternalProviderMapper } from "./mapper";
import { ExternalProviderPerson } from "@src/model/internal/external-provider-person";

export class ExternalProviderService {

    constructor(private readonly mapper: ExternalProviderMapper) {}

    private async createExternalProviderPerson(provider: ExternalProvider, externalId: string, personId: number): Promise<ExternalProviderPerson> {
        validateNotNull(provider, "provider");
        validateNotBlank(externalId, "externalId");
        validateNotNull(personId, "personId");

        return await this.mapper.createExternalProviderPerson(provider, externalId, personId);
    }

    private async getPersonIdByExternalProvider(provider: ExternalProvider, externalId: string): Promise<number | null> {
        validateNotNull(provider, "provider");
        validateNotBlank(externalId, "externalId");

        const externalProviderPerson = await this.mapper.getPersonByExternalProvider(provider, externalId);
        return externalProviderPerson === null ? null : externalProviderPerson.personId;
    }

}