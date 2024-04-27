"use server"
import { MapData } from "@/app/src/models";
import fs from "fs";
import path from "path";

const dir = path.join(process.cwd());
const dataDir = path.join(dir, "app", "data");

const getFiles = async () => new Promise<string[]>((success, reject) => {
    fs.readdir(dataDir, (er, files) => {
        if (er) {
            reject(er);
        }
        success(files);
    })
})

const getJsonFile = <TData extends any = MapData>(fileName: string) => new Promise<TData>((success, reject) => {
    fs.readFile(path.join(dataDir, `${fileName}.json`), 'utf8', (er, file) => {
        if (er) {
            reject(er);
            return;
        }
        success(JSON.parse(file));
    })
});

const saveJsonFile = (fileName: string, data: MapData) => new Promise((_, reject) => {
    fs.writeFile(path.join(dataDir, `${fileName}.json`), JSON.stringify(data), e => {
        if (e) reject(e);
    })
})

export const getGamesAction = async () => {
    const result = await getFiles();
    return result.filter(x => x.endsWith(`.json`)).map(x => x.replace(`.json`, ""));
}

export const checkLocation = async (slug: string, id: number) => {
    const data = await getJsonFile(slug);
    data.locations.map(x => {
        if (x.id === id) {
            x.checked = !x.checked
        }
        return x;
    });
    saveJsonFile(slug, data);
    return data;
}

export const reset = async (slug: string) => {
    const data = await getJsonFile(slug);
    data.locations.map(x => {
        delete x.checked;
        return x;
    });
    saveJsonFile(slug, data);
    return data;
}

export const getMaps = async (slug: string) => {
    const data = await getJsonFile(slug);
    return data.maps;
}

export const getMapAction = async (slug: string) => {
    const data = await getJsonFile(slug);
    return data;
}

export const getMapPointers = async (...slug: string[]) => {
    const data = await getJsonFile<Record<string, any>>("pointers/" + slug.join("/"));
    return data
}