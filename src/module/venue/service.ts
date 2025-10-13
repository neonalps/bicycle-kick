import { Venue } from "@src/model/internal/venue";
import { VenueMapper } from "./mapper";
import { validateNotBlank, validateNotNull } from "@src/util/validation";
import { VenueId } from "@src/util/domain-types";
import { CreateVenue } from "@src/model/internal/create-venue";
import { normalizeForSearch } from "@src/util/search";
import { isDefined } from "@src/util/common";
import { UpdateVenue } from "@src/model/internal/update-venue";

export class VenueService {

    constructor(private readonly mapper: VenueMapper) {}

    async create(createVenue: Omit<CreateVenue, 'normalizedSearch'>): Promise<Venue> {
        validateNotNull(createVenue, "createVenue");
        validateNotBlank(createVenue.name, "createVenue.name"),
        validateNotBlank(createVenue.shortName, "createVenue.shortName");
        validateNotBlank(createVenue.city, "createVenue.city");
        validateNotBlank(createVenue.countryCode, "createVenue.countryCode");
        validateNotNull(createVenue.capacity, "createVenue.capacity");

        const createdVenueId = await this.mapper.create({
            ...createVenue,
            normalizedSearch: normalizeForSearch([createVenue.name, createVenue.city, createVenue.district].filter(item => isDefined(item)).join(" ")),
        });
        const createdVenue = await this.getById(createdVenueId);
        if (createdVenue === null) {
            throw new Error(`Something went wrong while creating venue`);
        }
        return createdVenue;
    }

    async updateById(venueId: VenueId, updateVenue: Omit<UpdateVenue, 'normalizedSearch'>): Promise<Venue> {
        validateNotNull(venueId, "venueId");
        validateNotNull(updateVenue, "updateVenue");
        validateNotBlank(updateVenue.name, "updateVenue.name"),
        validateNotBlank(updateVenue.shortName, "updateVenue.shortName");
        validateNotBlank(updateVenue.city, "updateVenue.city");
        validateNotBlank(updateVenue.countryCode, "updateVenue.countryCode");
        validateNotNull(updateVenue.capacity, "updateVenue.capacity");

        await this.requireById(venueId);

        await this.mapper.updateById(venueId, {
            ...updateVenue,
            normalizedSearch: normalizeForSearch([updateVenue.name, updateVenue.city, updateVenue.district].filter(item => isDefined(item)).join(" ")),
        });
        
        return await this.requireById(venueId);
    }

    async getById(id: VenueId): Promise<Venue | null> {
        validateNotNull(id, "id");

        return await this.mapper.getById(id);
    }

    async requireById(id: VenueId): Promise<Venue> {
        const venue = await this.getById(id);
        if (venue === null) {
            throw new Error(`No venue with ID ${id} exists`);
        }
        return venue;
    }

    async getMultipleByIds(ids: VenueId[]): Promise<Map<number, Venue>> {
        validateNotNull(ids, "ids");
        if (ids.length === 0) {
            return new Map();
        }

        return await this.mapper.getMapByIds(ids);
    }

    async search(parts: string[]): Promise<Venue[]> {
        validateNotNull(parts, "parts");

        return await this.mapper.search(parts);
    }

}