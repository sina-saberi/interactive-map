"use client"
import { useAppDispatch, useAppSelector } from '@/app/src/hooks/useRedux'
import { Location } from '@/app/src/models'
import { toggleLocation } from '@/app/src/store/slices/map'
import { DivIcon, Icon, Marker as MarkerClass, Popup as PopupClass } from 'leaflet'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useRef } from 'react'
import { Marker, Popup, useMap, useMapEvent } from 'react-leaflet'
import Markdown from 'react-markdown'
import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

interface AppMarkerProps {
    location: Location
}

const EVENT_NAME = "open-popup";
const AppMarker = ({ location }: AppMarkerProps) => {
    const ref = useRef<MarkerClass>(null);
    const popupRef = useRef<PopupClass>(null)
    const { pointers } = useAppSelector(x => x.pointer);
    const dispatch = useAppDispatch();
    const map = useMap();

    const path = usePathname();
    const [, slug] = path.split("/");

    React.useEffect(() => {
        const onOpen = (e: CustomEvent<number>) => {
            if (e.detail === location.id && map && ref.current && popupRef.current && ref.current) {
                map.flyTo([location.latitude, location.longitude], map.getZoom());
                console.log("popup:", popupRef.current, "map:", map);
                if (ref.current && popupRef.current) {
                    popupRef.current.setLatLng([location.latitude, location.longitude]);
                    popupRef.current.openOn(map);
                }
            }
        }
        window.addEventListener(EVENT_NAME, onOpen as any);
        return document.removeEventListener(EVENT_NAME, onOpen as any);
    }, [location, map, popupRef, ref])

    const onLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const url = new URL((e.target as HTMLAnchorElement).href);
        const id = url.searchParams.get("locationIds");
        if (id) {
            window.dispatchEvent(new CustomEvent(EVENT_NAME, {
                detail: parseInt(id)
            }))
        }
    }

    const icon = React.useMemo(() => {
        const [, slug] = path.split("/");
        if (!pointers || !slug) return;
        const pointer = pointers[location.category.id];
        if (pointer) {
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
        }
        return new Icon({
            iconUrl: "/images/marker-icon.png",
            iconAnchor: [12, 3],
        })
    }, [pointers, path, location])


    return (
        <Marker
            ref={ref}
            icon={icon}
            key={location.id}
            position={[location.latitude, location.longitude]}
        >
            <Popup ref={popupRef} minWidth={400}>
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

                        {location.description && (
                            <Markdown
                                components={{
                                    a: ({ href, ...props }) => {
                                        if (href) {
                                            return (
                                                <Link
                                                    {...props}
                                                    onClick={onLinkClick}
                                                    href={href.replace(`https://mapgenie.io`, window.location.origin)}
                                                />)
                                        }
                                    }
                                }}
                            >
                                {location.description}
                            </Markdown>
                        )}
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
}

export default React.memo(AppMarker);