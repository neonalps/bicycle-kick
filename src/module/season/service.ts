import { Season } from "@src/model/internal/season";

export class SeasonService {

    searchByName(parts: string[]): Promise<Season[]> {
        return new Promise((resolve) => {
            setTimeout(() => resolve([
                
            ]), 89);
        });
    }

    getCurrent(): Promise<Season> {
        return new Promise((resolve) => {
            setTimeout(() => resolve(
                { id: 30, name: "2024/2025", shortName: "24/25", from: new Date(), to: new Date(), }
            ), 108);
        });
    }

    getLast(): Promise<Season> {
        return new Promise((resolve) => {
            setTimeout(() => resolve(
                { id: 31, name: "2023/2024", shortName: "23/24", from: new Date(), to: new Date(), }
            ), 108);
        });
    }

}