import React from 'react';
import Image from 'next/image';
import AiImage from "../../../../../public/assets/ai/chat-ai-agent.png"

const Header = () => {
  return (
    <div className='flex gap-[6px] items-center bg-white bg-[linear-gradient(0deg,rgba(0,0,0,0.025),rgba(0,0,0,0.025))] rounded-[80px] px-[11px] py-[7px]'>
        <Image src={AiImage} alt='AI agent Image' className='w-5 h-5' />
        <p className='font-medium text-[10px] text-black'>V-Agent</p>
    </div>
  )
}

export default Header;