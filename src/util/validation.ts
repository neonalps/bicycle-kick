import { isDefined } from "@src/util/common";

export function validateNotNull(input: unknown, property: string): void {
    if (!isDefined(input)) {
        throw new Error(`${property} must not be null or undefined`);
    }
}

export function validateNotEmpty(input: Set<unknown>, property: string): void {
    if (!input || input.size === 0) {
        throw new Error(`${property} must not be empty`);
    }
}

export function validateNotBlank(input: string, property: string): void {
    if (!input || input.trim().length <= 0) {
        throw new Error(`${property} must not be blank`);
    }
}

export function validateTrue(input: boolean, errorMessage: string): void {
    if (input !== true) {
        throw new Error(errorMessage);
    }
}

export function validateFalse(input: boolean, errorMessage: string): void {
    if (input !== false) {
        throw new Error(errorMessage);
    }
};