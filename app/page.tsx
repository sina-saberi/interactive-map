"use client"
import React from 'react';
import { useAppDispatch, useAppSelector } from './src/hooks/useRedux';
import { getGames } from './src/store/slices/games';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const dispatch = useAppDispatch();
  const { games } = useAppSelector(x => x.games);

  React.useEffect(() => {
    dispatch(getGames());
  }, [dispatch])

  return (
    <main className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 p-4'>
      {games?.map((x, i) => (
        <div key={i} className='h-72 '>
          <Link className='text-blue-400 h-full  text-center flex items-center justify-start flex-col gap-3 hover:bg-gray-200/15 rounded-md p-4' href={`/${x}`}>
            <Image className='border rounded-md' src={`https://cdn.mapgenie.io/images/games/${x}/preview.jpg`} alt={x} width={300} height={300} />
            {x.replaceAll("-", " ")}
          </Link>
        </div>
      ))}
    </main>
  )
}
