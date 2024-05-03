"use client"
import { useAppSelector } from '@/app/src/hooks/useRedux'
import React from 'react'
import { MapContainer } from 'react-leaflet'
import { createTileLayerComponent, createElementObject, LayerProps, withPane, updateGridLayer } from '@react-leaflet/core'
import 'leaflet/dist/leaflet.css';
import Locations from './locations';

import type { Coords, LayerOptions, TileLayerOptions } from 'leaflet'
import { TileLayer as LeafLetTileLayer } from 'leaflet'
import { Bound } from '@/app/src/models'


export interface TileLayerProps extends TileLayerOptions, LayerProps {
    url: string;
    customBounds: Record<number, Bound>
}

const createLeafletTileLayer = (url: string, options: LayerOptions, customBounds: Record<number, Bound>) => {
    const NewInstanse = LeafLetTileLayer.extend({
        getTileUrl: function ({ x, y, z }: Coords) {
            const instance = this as LeafLetTileLayer;
            const url = (instance as any)._url as string;

            const bounds = customBounds[z];
            if (bounds.x.min > x || bounds.x.max < x || bounds.y.min > y || bounds.y.max < y) {
                console.log(`x${x}, y:${y}, z:${z} is invalid`);

                return `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNYDfg6m0bfgKRb4yDPeThQLBlKXFwPekg9Ihg6G_cCA&s`;
            }

            const newUrl = url.replace("{x}", x.toString()).replace("{y}", y.toString()).replace("{z}", z.toString())
            return newUrl
        }
    }) as any as typeof LeafLetTileLayer;

    return new NewInstanse(url, options);
}//create a custom tileLayer class to overide url

export const TileLayer = createTileLayerComponent<LeafLetTileLayer, TileLayerProps>(
    function createTileLayer({ url, customBounds, ...options }, context) {
        const layer = createLeafletTileLayer(url, withPane(options, context), customBounds);
        return createElementObject(layer, context)
    },
    function updateTileLayer(layer, props, prevProps) {
        updateGridLayer(layer, props, prevProps)
        const { url } = props
        if (url != null && url !== prevProps.url) {
            layer.setUrl(url)
        }
    }
)// create a custom tileLayer component

const Map = () => {
    const map = useAppSelector(x => x.map.map);
    if (map) {
        const { mapConfig } = map;
        const tileSet = mapConfig.tile_sets[0];


        const tileLevel = tileSet.min_zoom;
        const degreesPerTile = 360 / Math.pow(2, tileLevel);
        const minBoundZoom = tileSet.bounds[tileSet.min_zoom];
        const min = minBoundZoom.x.min;
        const max = minBoundZoom.x.max;
        const long = degreesPerTile;
        const lat = degreesPerTile;
        const bounds: [[number, number], [number, number]] = [
            [lat * ((max - min)), -long * ((max - min + 1))], 
            [0, 0],
        ];

        const maxBounds: [[number, number], [number, number]] = [
            [lat * ((max - min + 2)), -long * ((max - min + 2))],//the number two is margin so user can actuly move a little
            [-lat, lat],
        ];


        return (
            <MapContainer
                className='w-full h-screen'
                zoom={tileSet.min_zoom}
                center={[mapConfig.start_lat, mapConfig.start_lng]}
                maxZoom={tileSet.max_zoom}
                minZoom={tileSet.min_zoom}
                maxBoundsViscosity={0.1}
                boundsOptions={{
                    padding: [0, 0]
                }}
                bounds={bounds}
                maxBounds={maxBounds}
                scrollWheelZoom={true}>
                <TileLayer
                    bounds={bounds}
                    customBounds={tileSet.bounds}
                    url={`https://tiles.mapgenie.io/games/${tileSet.pattern}`}
                />
                {/* <Pane name="yellow-rectangle" style={{ zIndex: 499 }}>
                    <Rectangle bounds={maxBounds} pathOptions={{ color: 'yellow' }} />
                </Pane> */}
                <Locations />
            </MapContainer>
        )
    }
}

export default React.memo(Map)