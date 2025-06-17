export function normalizeForSearch(input: string): string {
    return input.normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replaceAll('ı', 'i')
        .replaceAll('ł', 'l')
        .replaceAll('ø', 'o')
        .replaceAll('æ', 'ae')
        .toLocaleLowerCase();
}