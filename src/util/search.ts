export function normalizeForSearch(input: string): string {
    return input.normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replaceAll('ø', 'o')
        .toLocaleLowerCase();
}