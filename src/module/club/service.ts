import { Club } from "@src/model/internal/club";
import { ClubMapper } from "./mapper";
import { validateNotBlank, validateNotNull } from "@src/util/validation";
import { ClubId } from "@src/util/domain-types";
import { CreateClub } from "@src/model/internal/create-club";
import { normalizeForSearch } from "@src/util/search";
import { isDefined } from "@src/util/common";
import { UpdateClub } from "@src/model/internal/update-club";

export class ClubService {

    constructor(private readonly mapper: ClubMapper) {}

    async create(createClub: Omit<CreateClub, 'normalizedSearch'>): Promise<Club> {
        validateNotNull(createClub, "createClub");
        validateNotBlank(createClub.name, "createClub.name");
        validateNotBlank(createClub.shortName, "createClub.shortName");
        validateNotBlank(createClub.countryCode, "createClub.countryCode");

        const createdClubId = await this.mapper.create({
            ...createClub,
            normalizedSearch: normalizeForSearch([createClub.name, createClub.city, createClub.district].filter(item => isDefined(item)).join(" ")),
        });

        const createdClub = await this.getById(createdClubId);
        if (createdClub === null) {
            throw new Error(`Something went wrong while creating club`);
        }

        return createdClub;
    }

    async updateById(clubId: ClubId, updateClub: Omit<UpdateClub, 'normalizedSearch'>): Promise<Club> {
        validateNotNull(updateClub, "updateClub");

        await this.mapper.updateById(clubId, {
            ...updateClub,
            normalizedSearch: normalizeForSearch([updateClub.name, updateClub.city, updateClub.district].filter(item => isDefined(item)).join(" ")),
        });
        
        return await this.requireById(clubId);
    }

    async getById(id: ClubId): Promise<Club | null> {
        validateNotNull(id, "id");

        return await this.mapper.getById(id);
    }

    async requireById(id: ClubId): Promise<Club> {
        const club = await this.getById(id);
        if (club === null) {
            throw new Error(`No club with ID ${id} exists`);
        }
        return club;
    }

    async getMapByIds(ids: number[]): Promise<Map<ClubId, Club>> {
        validateNotNull(ids, "ids");
        if (ids.length === 0) {
            return new Map();
        }

        return await this.mapper.getMapByIds(ids);
    }

    async search(parts: string[]): Promise<Club[]> {
        validateNotNull(parts, "parts");

        return await this.mapper.search(parts);
    }

}