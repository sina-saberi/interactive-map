"use client"
import { useAppSelector } from '@/app/src/hooks/useRedux'
import React from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import Locations from './locations';

const Map = () => {
    const map = useAppSelector(x => x.map.map);
    if (map) {
        const { mapConfig } = map;
        const tileSet = mapConfig.tile_sets[0];
        return (
            <MapContainer
                className='w-full h-screen'
                center={[mapConfig.start_lat, mapConfig.start_lng]}
                zoom={mapConfig.initial_zoom}
                maxZoom={tileSet.max_zoom}
                minZoom={tileSet.min_zoom}
                scrollWheelZoom={true}>
                <TileLayer
                    url={`https://tiles.mapgenie.io/games/${tileSet.pattern}`}
                />
                <Locations />
            </MapContainer>
        )
    }
}

export default React.memo(Map)