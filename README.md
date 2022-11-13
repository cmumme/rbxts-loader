# @rbxts/loader
A simple module loader for Roblox-TS.

```ts
import { Loader } from "@rbxts/loader"
import { ReplicatedStorage } from "@rbxts/services"

const MyScriptsFolder = ReplicatedStorage.WaitForChild("MyScripts") as Folder

Loader.Load(MyScriptsFolder) // Loads all scripts in ReplicatedStorage.MyScripts and subfolders.
```