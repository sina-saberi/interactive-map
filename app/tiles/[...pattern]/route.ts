import axios from 'axios';
import { headers } from 'next/headers'
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { notFound } from 'next/navigation';
import fetch from 'node-fetch';

export const dynamic = 'force-dynamic' // defaults to auto

const readFileAsync = (path: string) => new Promise<Buffer>((accept, reject) => {
    fs.readFile(path, (error, file) => {
        if (error) {
            reject(error);
        }
        accept(file);
    })
});

const handleImageBodyAsync = (body: NodeJS.ReadableStream | null, stream: fs.WriteStream) => new Promise((accept) => {
    body?.on('data', (chunk) => {
        stream.write(chunk);
    });

    body?.on('end', () => {
        stream.end();
        accept(undefined);
    });
})

export async function GET(request: Request) {
    const url = new URL(request.url);
    const [, , game, map, version, z, x, y] = url.pathname.split("/");
    const cwd = process.cwd();
    const imageURl = `https://tiles.mapgenie.io/games/${game}/${map}/${version}/${z}/${x}/${y}`;
    const DirPath = path.join(cwd, "public", "images", "tiles", game, map, version, z, x);
    const filePath = path.join(cwd, "public", "images", "tiles", game, map, version, z, x, y);

    // const test = path.join(cwd, "public", "tiles", "assassins-creed-revelations", "constantinople", "default-v2", "12", "2033", "2035.png")

    if (fs.existsSync(filePath)) {
        const file = await readFileAsync(filePath);
        if (file) {
            return new Response(file)
        }
    }

    const image = await fetch(imageURl, {
        headers: {
            "content-type": request.headers.get("content-type") || "image/svg+xml", // Fix the typo here
        }
    });

    if (image.ok) {
        if (!fs.existsSync(DirPath)) {
            fs.mkdirSync(DirPath, { recursive: true });
        }

        if (!fs.existsSync(filePath)) {
            const writeStream = fs.createWriteStream(filePath);
            await handleImageBodyAsync(image.body, writeStream)
        }
    }
    return await GET(request);
}