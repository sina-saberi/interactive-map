"use client"
import { useAppDispatch, useAppSelector } from '@/app/src/hooks/useRedux'
import { Location } from '@/app/src/models';
import { toggleLocation } from '@/app/src/store/slices/map';
import { getPointers } from '@/app/src/store/slices/pointer';
import { DivIcon } from 'leaflet';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React from 'react'
import { Marker, Popup } from 'react-leaflet';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';



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

    const getIcon = React.useCallback((location: Location) => {
        const [, slug] = path.split("/");
        if (!pointers || !slug) return;
        const pointer = pointers[location.category.id];
        if (!pointer) return
        const image = document.createElement("div");
        image.style.backgroundImage = `url("https://cdn.mapgenie.io/images/games/${slug}/markers@2x.png?NTY1OTIz")`;
        image.style.width = `${pointer.width}px`;
        image.style.height = `${pointer.height}px`;
        image.style.backgroundPosition = `-${pointer.x}px ${-(pointer.y)}px`;
        image.style.transform = `scale(0.60)`;
        image.style.position = "absolute";
        image.style.bottom = "-100%";
        image.style.right = "-220%";
        image.style.opacity = location.checked ? "0.5" : "1"
        return new DivIcon({
            html: image,
            className: "relative",
        });
    }, [pointers, path])

    const [, slug] = path.split("/");
    if (pointers)
        return filteredLocations?.map(location => {
            const descriptionTitle = location.description?.match(/^\*\*[\w ]+\*\*./)?.[0];
            return (
                <Marker
                    icon={getIcon(location)}
                    key={location.id}
                    position={[location.latitude, location.longitude]}
                >
                    <Popup minWidth={400}>
                        <div className='w-full flex flex-col items-center'>
                            {(location.media && location.media.length > 0) && (
                                <div className='max-w-[420px]'>
                                    <Swiper
                                        modules={[Pagination]}
                                        pagination={{
                                            enabled: true
                                        }}
                                        centeredSlides
                                        className='w-full'
                                        slidesPerView={1}>
                                        {location.media.map((media) => (
                                            <SwiperSlide key={media.id} className='h-60 w-full '>
                                                <Image alt='' src={media.url} className='w-auto h-auto' width={450} height={200} />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            )}
                            <div className='flex w-full flex-col gap-3 mt-4'>
                                <div className='text-xl font-bold'>
                                    {location.title}
                                </div>
                                <div className='text-lg font-bold'>
                                    {location.category.title}
                                </div>
                                <div dangerouslySetInnerHTML={{
                                    __html: location.description?.replace(/^\*\*[\w ]+\*\*./, `<div class="font-bold">${descriptionTitle}</div>`)
                                        || ""
                                }} />
                            </div>
                            <div
                                className='flex items-center justify-center mt-3 text-lg'>
                                <label className='flex items-center gap-2'>
                                    found
                                    <input
                                        value={""}
                                        onChange={() => dispatch(toggleLocation({
                                            id: location.id,
                                            slug
                                        }))}
                                        checked={location.checked}
                                        type='checkbox'
                                    />
                                </label>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            )
        })
    else return <React.Fragment></React.Fragment>
}

export default React.memo(Locations);