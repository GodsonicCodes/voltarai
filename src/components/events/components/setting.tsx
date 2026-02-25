import React from 'react';
import Image from 'next/image';
import Location from "../../../../public/assets/icons/events/location.png";
import Calender from "../../../../public/assets/icons/events/calender.png";

interface SettingProps {
    detail: "location" | "date";
    location?: string;
    venue?: string;
    date?: string;
    timeRange?: string;
}

const Setting = ({ detail, location, venue, date, timeRange }: SettingProps) => {
    return detail == "location" ?
        (
            <div className='flex gap-[12px]'>
                <div className='flex justify-center items-center h-[60px] w-[60px]'><Image src={Location} alt="location" className='h-[20px] w-[14px]' /></div>
                <div className='flex flex-col gap-[5px]'>
                    <p className='text-base md:text-lg lg:text-xl font-medium text-white'>{location ? location : "Tema, Community 1"}</p>
                    <p className='text-sm md:text-base lg:text-lg font-[375] text-[#FFFFFFB2]'>{venue ? venue : "Burbs Hotel, Opposite NY FM 101.6"}</p>
                </div>
            </div>
        )
        :
        (
            <div className='flex gap-[12px]'>
                <div className='flex justify-center items-center h-[60px] w-[60px]'><Image src={Calender} alt="calendar" className='h-[18px] w-[18px]' /></div>
                <div className='flex flex-col gap-[5px]'>
                    <p className='text-base md:text-lg lg:text-xl font-medium text-white'>{date ? date : "Monday, April 4, 2026"}</p>
                    <p className='text-sm md:text-base lg:text-lg font-[375] text-[#FFFFFFB2]'>{timeRange ? timeRange : "18:00-23:00 PM (GMT +07:00)"}</p>
                </div>
            </div>
        )
}

export default Setting;