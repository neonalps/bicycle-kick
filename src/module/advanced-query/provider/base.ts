import { FilterDescriptor } from "@src/module/advanced-query/filter/descriptor";

export interface FilterProvider<T> {
    provide(descriptor: FilterDescriptor): T;
}