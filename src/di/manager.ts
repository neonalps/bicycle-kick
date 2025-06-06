import { validateNotNull } from "@src/util/validation";
import { Dependencies } from "./dependencies";

class DependencyManager {

    private dependencies: Map<Dependencies, any>;

    constructor() {
        this.dependencies = new Map();
    }

    public get<T>(key: Dependencies): T {
        return this.dependencies.get(key);
    }

    public register(key: Dependencies, instance: any): void {
        validateNotNull(instance, "instance");

        this.dependencies.set(key, instance);
    }

    public registerAll(dependencies: Map<Dependencies, any>) {
        validateNotNull(dependencies, "dependencies");

        for (const [key, value] of dependencies) {
            this.register(key, value);
        }
    }

}

const manager = new DependencyManager();

export default manager;