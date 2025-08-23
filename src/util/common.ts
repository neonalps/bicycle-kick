import { SortOrder } from "@src/module/pagination/constants";

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const charactersLength = characters.length;
const allowedHttpMethods = ["GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS", "TRACE", "PATCH"];

export const getQueryString = (params: Record<string, any>): string => {
    return new URLSearchParams(params).toString();
};

export const generateRandomString = (size: number) => {
    const result = [];
    for (let i = 0; i < size; i++ ) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join("");
};

export const removeNull = <T> (item: T): boolean => item !== null;

export const requireNonNull = <T> (arg: T | null | undefined): T => {
    if (isNotDefined(arg)) {
        throw new Error(`null argument passed to requireNonNull`);
    }

    return arg as T;
}

export function isDefined<T>(toCheck: T): toCheck is NonNullable<T> {
    return toCheck !== null && toCheck !== undefined;
}

export function isNotDefined(toCheck: unknown) {
    return !isDefined(toCheck);
}

export function isBlank(toCheck: string | undefined | null): boolean {
    return isNotDefined(toCheck) || (toCheck as string).trim().length === 0;
}

export function isNotBlank(toCheck: string | undefined | null): boolean {
    return !isBlank(toCheck);
}

export function checkValidHttpMethod(method: string): boolean {
    return allowedHttpMethods.includes(method);
}

export function getAllowedHttpMethods(): string[] {
    return [...allowedHttpMethods];
}

export function getOrThrow<T>(map: Map<unknown, T>, key: unknown, errorMessage: string): T {
    const value = map.get(key);
    if (value === undefined) {
        throw new Error(errorMessage);
    }

    return value;
}

export function uniqueArrayElements<T>(array: T[]): T[] {
    return Array.from(new Set(array));
}

export function getUrlSlug(id: number, name: string): string {
    return [id, ...name.split(" ").map(item => item.toLowerCase())].join("-").replace(/[^a-zA-Z0-9-_]/g, '');
}

export function getSortOrderString(sortOrder: SortOrder): string {
    return sortOrder === SortOrder.Ascending ? "asc" : "desc";
}

export function requireSingleArrayElement<T>(array: T[], errorMessage?: string): T {
    if (array === undefined || array === null || array.length !== 1) {
        throw new Error(errorMessage || "Expected single array element");
    }

    return array[0];
}

export type ArrayNonEmpty<T> = [T, ...T[]];

export async function promiseAllObject<T extends Record<string, Promise<any>>>(obj: T): Promise<{ [K in keyof T]: Awaited<T[K]> }> {
  const entries = Object.entries(obj);
  const results = await Promise.all(entries.map(([key, promise]) => promise.then((value) => [key, value])));
  return Object.fromEntries(results) as { [K in keyof T]: Awaited<T[K]> };
}

export function ensureNotNullish<T>(input: T | null | undefined, errorMessage?: string): T {
    if (input === undefined || input === null) {
        throw new Error(errorMessage ?? `Expected not nullish value but got nullish`);
    }

    return input;
}

export function convertNumberString(input: string): number {
    return Number(input);
}

export function assertUnreachable(x: never, errorMessage?: string): never {
  errorMessage ||= `This should be unreachable. Unexpected value ${JSON.stringify(x)}`;
  throw new Error(errorMessage);
}

export function groupBy<K extends PropertyKey, V>(array: V[], keyFn: (value: V) => K): Record<K, V[]> {
  return array.reduce(
    (acc, item) => {
      const key = keyFn(item);
      if (acc[key] === undefined) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    },
    {} as Record<K, V[]>
  );
}