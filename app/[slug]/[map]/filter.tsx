import React from 'react'

const Filter: React.FC<React.PropsWithChildren & { name: string }> = ({ children, name }) => {
    return (
        <div className='w-full flex flex-col'>
            <div className='font-bold text-xl'>
                {name}
            </div>
            <div className='grid grid-cols-2 gap-x-20 gap-y-2 whitespace-nowrap'>
                {children}
            </div>
        </div>
    )
}

interface FilterItemProps {
    onClick: (active: boolean) => void;
    active: boolean;
    name: string;
    badge?: () => [number, number];
    icon?: string;
}

const FilterItem: React.FC<FilterItemProps> = ({ active, badge, name, onClick, icon }) => {
    const values = React.useMemo(() => {
        if (badge) {
            const [amount, total] = badge();
            return { amount, total }
        }
    }, [badge])
    return (
        <button onClick={() => onClick(!active)} className='w-full'>
            <div className='flex gap-2 flex-shrink-0 '>
                <div className={`icon icon-${icon} w-5`}></div>
                <div className='text-sm data-[active=false]:line-through' data-active={!active}>{name}</div>
                {values && (
                    <div className='text-xs font-bold text-white bg-gray-600 rounded-full px-2 h-6 flex-shrink-0 flex items-center justify-center'>{values?.amount}/{values?.total}</div>
                )}
            </div>
        </button>
    )
}

export default Object.assign(React.memo(Filter), {
    FilterItem: React.memo(FilterItem)
})