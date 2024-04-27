"use client"
import { useAppDispatch, useAppSelector } from '@/app/src/hooks/useRedux';
import React from 'react'
import Filter from './filter';
import { addListOfFilters, clearAllFilters, toggleCategories, toggleCategory, toggleChecked } from '@/app/src/store/slices/filters';
import { usePathname } from 'next/navigation';
import { resetMap } from '@/app/src/store/slices/map';

const SideBar = () => {
    const path = usePathname();
    const [, slug] = path.split("/");
    const { map } = useAppSelector(x => x.map);
    const { categories, checked } = useAppSelector(x => x.filters);
    const dispatch = useAppDispatch();
    const [search, setSearch] = React.useState("");

    const getDoneItems = React.useCallback<() => [number, number]>(() => {
        return [map!.locations.length, map!.locations.filter(x => x.checked).length]
    }, [map]);

    const getCategoryLocations = React.useCallback<(id: number) => [number, number]>((id) => {
        return [map!.locations.filter(x => x.category_id === id).length, map!.locations.filter(x => x.category_id === id && x.checked).length]
    }, [map])

    const onReset = React.useCallback(async () => {
        const result = confirm("are you shure you want to reset this map?");
        if (result && slug) {
            dispatch(resetMap(slug));
        }
    }, [dispatch, slug])


    if (map) {
        const { groups, locations } = map;
        return (
            <div className='border-r w-[450px] px-5 flex-shrink-0  overflow-y-auto overflow-x-hidden max-h-screen  bg-gray-300 shadow-md'>
                <link href={`https://cdn.mapgenie.io/css/themes/${slug}.css`} rel='stylesheet' />
                <link href={`https://cdn.mapgenie.io/css/themes/icons/${slug}-icons.css`} rel="stylesheet" />
                <div className='flex items-center justify-center mt-4'>
                    <button className='border px-2 py-1' onClick={() => dispatch(clearAllFilters())}>show all</button>
                    <button className='border px-2 py-1' onClick={() => dispatch(addListOfFilters(Object.values(map.categories).map(x => x.id)))}>hide all</button>
                    <button className='border px-2 py-1' onClick={onReset}>reset</button>
                </div>

                <div className='flex mt-4 mx-auto'>
                    <input value={search} onChange={(e) => setSearch(e.target.value)} className='border px-2 py-1 w-full' placeholder='search' />
                </div>

                {search && (
                    <div className='flex flex-col gap-3 mt-4 max-w-[350px]'>
                        {locations.filter(x => x.title.toLowerCase().search(search.toLowerCase()) > -1).map((x, index) => (
                            <button
                                key={index}
                                className='flex transition-all flex-col items-start justify-start text-start py-2 hover:bg-gray-100 px-3 border-b last:border-0'>
                                <div className='font-bold'>
                                    {x.title}
                                </div>
                                <div className='max-h-full mt-2'>
                                    {x.description}
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                <div className='mt-5 pb-10'>
                    <Filter name='global' >
                        <Filter.FilterItem
                            badge={getDoneItems}
                            name='checked'
                            active={checked}
                            onClick={() => dispatch(toggleChecked())} />
                    </Filter>
                    {groups.filter(x => x.categories.length > 0).map(group => (
                        <Filter onGroupClick={x => dispatch(toggleCategories({ hide: x, ids: group.categories.map(x => x.id) }))} name={group.title} key={group.id} >
                            {group.categories.map(category => (
                                <Filter.FilterItem
                                    key={category.id}
                                    icon={category.icon}
                                    name={category.title}
                                    badge={getCategoryLocations.bind(undefined, category.id)}
                                    active={categories.some(x => x === category.id)}
                                    onClick={() => dispatch(toggleCategory(category.id))}
                                />
                            ))}
                        </Filter>
                    ))}
                </div>
            </div>
        )
    }
}

export default React.memo(SideBar);