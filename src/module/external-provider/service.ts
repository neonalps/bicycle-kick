import { ExternalProvider } from "@src/model/type/external-provider";
import { validateNotBlank, validateNotNull } from "@src/util/validation";
import { ExternalProviderMapper } from "./mapper";
import { ExternalProviderPerson } from "@src/model/internal/external-provider-person";
import { ExternalPersonDto } from "@src/model/external/dto/external-person";
import { PersonService } from "@src/module/person/service";
import { ClubId } from "@src/util/domain-types";

export class ExternalProviderService {

    constructor(private readonly mapper: ExternalProviderMapper, private readonly personService: PersonService) {}

    async getOrCreateExternalPerson(externalPerson: ExternalPersonDto): Promise<number> {
        validateNotNull(externalPerson, "externalPerson");
        validateNotBlank(externalPerson.provider, "externalPerson.provider");
        validateNotBlank(externalPerson.id, "externalPerson.id");

        const existingExternalProviderPerson = await this.getPersonIdByExternalProvider(externalPerson.provider, externalPerson.id);
        if (existingExternalProviderPerson !== null) {
            return existingExternalProviderPerson.personId;
        }

        const createdPerson = await this.personService.create({
            firstName: externalPerson.firstName,
            lastName: externalPerson.lastName,
            birthday: externalPerson.birthday,
            avatar: externalPerson.avatarUrl,
        });

        await this.createExternalProviderPerson(externalPerson.provider, externalPerson.id, createdPerson.id);
        
        return createdPerson.id;
    }

    async getMultipleClubIdsByExternalProvider(provider: ExternalProvider, externalIds: ReadonlyArray<string>): Promise<Map<string, ClubId>> {
        validateNotNull(provider, "provider");
        validateNotNull(externalIds, "externalIds");

        return await this.mapper.getMultipleClubIdsByExternalProvider(provider, externalIds);
    }

    private async createExternalProviderPerson(provider: ExternalProvider, externalId: string, personId: number): Promise<ExternalProviderPerson> {
        validateNotNull(provider, "provider");
        validateNotBlank(externalId, "externalId");
        validateNotNull(personId, "personId");

        return await this.mapper.createExternalProviderPerson(provider, externalId, personId);
    }

    private async getPersonIdByExternalProvider(provider: ExternalProvider, externalId: string): Promise<ExternalProviderPerson | null> {
        validateNotNull(provider, "provider");
        validateNotBlank(externalId, "externalId");

        return await this.mapper.getPersonByExternalProvider(provider, externalId);
    }

}