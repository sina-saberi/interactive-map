"use client"
import React from 'react'
import { useAppDispatch, useAppSelector } from '../src/hooks/useRedux'
import { getGameMaps } from '../src/store/slices/map';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const GameMaps = () => {
    const [loading, setLoading] = React.useState(true);
    const path = usePathname();
    const { maps } = useAppSelector(x => x.map);
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        const getData = async () => {
            setLoading(true);
            await dispatch(getGameMaps(path))
            setLoading(false);
        }

        getData();
    }, [dispatch, path, setLoading]);

    if (!loading)
        return (
            <main className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 p-4'>
                {maps?.map((x, i) => (
                    <div key={i} className='h-72 '>
                        <Link href={`${path}/maps/${x.slug}`} className='text-blue-400 h-full  text-center flex items-center justify-start flex-col gap-3 hover:bg-gray-200/15 rounded-md p-4'>
                            <Image loading='eager' className='border rounded-md' src={`https://cdn.mapgenie.io/images/games${path}/maps/${x.slug}.jpg`} alt={path + "-" + x.slug} width={300} height={300} />
                            {x.title}
                        </Link>
                    </div>
                ))}
            </main>
        )
}

export default React.memo(GameMaps)