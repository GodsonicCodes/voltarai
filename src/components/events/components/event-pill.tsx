import React from 'react'


interface EventPillProps {
    className?: string;
}

const EventPill: React.FC<EventPillProps> = ({ className }) => {
    return (
        <div className={` ${className} bg-white rounded-[90px] w-fit lg:bg-[#FFFFFF0D] flex items-center justify-center`}>
            <p className='px-[21.5px] py-[4px] text-black font-medium text-[10px] lg:text-[23px] lg:text-white'>Event</p>
        </div>
    )
}

export default EventPill;