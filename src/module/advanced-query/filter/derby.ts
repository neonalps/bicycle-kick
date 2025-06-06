import { QueryContext } from "@src/module/advanced-query/context";
import { Filter } from "@src/module/advanced-query/filter/base";
import { OpponentFilter } from "@src/module/advanced-query/filter/opponent";

export interface DerbyFilterPayload {
    city?: string[];
    district?: string[];
};

export class DerbyFilter implements Filter {

    constructor(private readonly payload: DerbyFilterPayload) {}

    apply(context: QueryContext): void {
        if (this.payload.city !== undefined) {
            new OpponentFilter({ fromCity: this.payload.city }).apply(context);
        } else if (this.payload.district !== undefined) {
            new OpponentFilter({ fromDistrict: this.payload.district }).apply(context);
        }
    }
    
}