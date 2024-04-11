"use client"
import { useAppDispatch } from '@/app/src/hooks/useRedux'
import { getGameMap } from '@/app/src/store/slices/map';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import React from 'react';
import SideBar from './sideBar';

const Map = dynamic(() => import("./map"), {
    ssr: false
})

const GameMap = () => {
    const path = usePathname();
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        const [, slug, mapSlug] = path.split("/");

        dispatch(getGameMap({
            mapSlug,
            slug
        }));
    }, [dispatch, path])


    return (
        <div className='w-full flex min-h-screen'>
            <SideBar />
            <Map />
        </div>
    )
}

export default React.memo(GameMap)