"use client"
import { useAppDispatch, useAppSelector } from '@/app/src/hooks/useRedux'
import { getPointers } from '@/app/src/store/slices/pointer';
import { usePathname } from 'next/navigation';
import React from 'react'
import AppMarker from './appMarker';

const Locations = () => {
    const path = usePathname();
    const dispatch = useAppDispatch();
    const { map } = useAppSelector(x => x.map);
    const { categories, checked } = useAppSelector(x => x.filters);
    const { pointers } = useAppSelector(x => x.pointer);

    React.useEffect(() => {
        const [, slug] = path.split("/");
        dispatch(getPointers(slug));
    }, [dispatch, path])

    const locatins = React.useMemo(() => map?.locations, [map]);

    const filteredLocations = React.useMemo(() =>
        locatins
            ?.filter(x => checked ? !x.checked : true)
            .filter(x => !categories.some(c => x.category_id === c))
        , [checked, categories, locatins])


    if (pointers) return filteredLocations?.map(location => <AppMarker key={location.id} location={location} />)

    else return <React.Fragment></React.Fragment>
}

export default React.memo(Locations);