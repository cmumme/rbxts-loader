export namespace Loader {
    /**
     * Loads modules in the folder and its subfolders
     * 
     * @param Folder The folder to load
     */
    export function Load(Folder: Folder): void {
        for (const Child of Folder.GetChildren()) {
            if(Child.IsA("ModuleScript")) {
                require(Child)
            } else if(Child.IsA("Folder")) {
                Loader.Load(Child)
            }
        }
    }
}