type UnknownFunction = (...args: unknown[])=>unknown
interface ModuleValue {
    Start?: (this: ModuleValue)=>void
}

type ModuleConstructor<T extends ModuleValue = ModuleValue> = { new(...Args: never[]): T }

const ActiveModules: Map<ModuleConstructor, ModuleValue> = new Map()

export namespace Loader {
    /**
     * Returns the currently used instance of the module
     * 
     * @param ModuleConstructor The module to get
     * @returns The active instance of that module
     */
    export function Get<T extends ModuleValue>(Constructor: ModuleConstructor<T>): T {
        const InitialQuery = ActiveModules.get(Constructor) as T
        if(!InitialQuery) {
            while(!ActiveModules.get(Constructor)) { task.wait(0.001) } // kms?
        }

        return ActiveModules.get(Constructor) as T
    }

    /**
     * Loads modules in the folder and its subfolders
     * 
     * @param Folder The folder to load
     * @returns An array of the loaded modules' return values
     */
    export function Load<T extends defined = defined>(Folder: Folder): T[] {
        const LoadedModules = [ ]

        for (const Child of Folder.GetChildren()) {
            if(Child.IsA("ModuleScript")) {
                LoadedModules.push(require(Child) as T)
            } else if(Child.IsA("Folder")) {
                (LoadedModules.push as UnknownFunction)(...Load(Child) as T[])
            }
        }

        return LoadedModules
    }

    /**
     * A decorator intended to be applied to a namespace.
     * 
     * When this decorator is applied, it will call the ``Start()`` function of the class if it exists.
     * 
     * Also makes the resulting class instance available via .Get()
     * 
     * @example
     * ```ts
     * ＠AutoLoad
     * export class MyService {
     *     Start() {
     *         print("Hey there! We're all ready to go!")
     *     } // This will be called immediately
     * }
     * 
     * Loader.Get(MyService) // -> MyService
     * ```
     */
    export function AutoLoad(Target: ModuleConstructor) {
        const Module = new Target()

        ActiveModules.set(Target, Module)

        Module.Start && Module.Start()
    }
}