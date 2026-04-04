import { validateNotBlank, validateNotNull } from "@src/util/validation";
import { IllegalStateError } from "@src/api/error/illegal-state";
import { PaginationQueryParams } from "@src/module/pagination/constants";
import { Base64Utils } from "@src/util/base64";
import { isDefined, isNotDefined } from "@src/util/common";
import { Nullish } from "@src/util/types";

export class PaginationService {

    constructor(private readonly base64Utils: Base64Utils) {}

    public validateQueryParams(params: PaginationQueryParams) {
        if (isDefined(params.nextPageKey) && (isDefined(params.order) || isDefined(params.limit))) {
            throw new IllegalStateError("When nextPageKey is passed no other query parameters are allowed");
        }
    }

    public validatePaginatedRequest<T extends PaginationQueryParams>(request: T, validatePropertiesPredicate?: (requestProperties: string[]) => Nullish<string>) {
        const requestProperties = Object.getOwnPropertyNames(request);

        if (requestProperties.includes('nextPageKey') && requestProperties.length > 1) {
            throw new IllegalStateError(`When nextPageKey is passed no other properties are allowed`);
        }

        if (isDefined(validatePropertiesPredicate)) {
            const validateError = validatePropertiesPredicate(requestProperties);
            if (isDefined(validateError)) {
                throw new IllegalStateError(validateError);
            }
        }
    }

    public getLastElement<T>(input: T[]): T {
        if (isNotDefined(input) || input.length === 0) {
            throw new IllegalStateError("Unable to get last element of undefined or empty array");
        }

        return input[input.length - 1];
    }

    public decode<T>(source: string): T {
        validateNotBlank(source, "source");

        const decoded = JSON.parse(this.base64Utils.decode(source)) as T;
        this.validateNextPageKey(decoded);
        return decoded;
    }
    
    public encode(source: unknown): string {
        validateNotNull(source, "source");

        return this.base64Utils.encode(JSON.stringify(source));
    }

    private validateNextPageKey(params: any) {
        if (!params.limit || !params.order || !params.lastSeen) {
            throw new IllegalStateError("Invalid next page key passed");
        }
    }
    
}