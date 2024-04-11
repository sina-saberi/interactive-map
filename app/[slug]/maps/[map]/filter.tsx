import React from 'react'

const Filter: React.FC<React.PropsWithChildren & { name: string, onGroupClick?: (e: boolean) => void }> = ({ children, name, onGroupClick }) => {
    const [counter, setCounter] = React.useState(0);
    return (
        <div className='mt-6'>
            <div
                onClick={() => {
                    if (onGroupClick) {
                        onGroupClick(counter % 2 == 0);
                        setCounter(x => x + 1);
                    }
                }}
                className='cursor-pointer font-bold text-xl'>
                {name}
            </div>
            <div className='grid grid-cols-2 gap-x-4 mt-2'>
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
        <div className='col-span-1'>
            <button onClick={() => onClick(!active)} className='w-full'>
                <div className='flex justify-between'>
                    <div className='flex gap-2'>
                        <div className={`icon icon-${icon} w-5`}></div>
                        <div className='text-sm data-[active=false]:line-through' data-active={!active}>{name}</div>
                    </div>
                    {values && (
                        <div className='text-xs'>{values?.amount}/{values?.total}</div>
                    )}
                </div>
            </button>
        </div>
    )
}

export default Object.assign(React.memo(Filter), {
    FilterItem: React.memo(FilterItem)
})