import React from 'react';
import Image from 'next/image';
import AiImage from "../../../../../public/assets/ai/chat-ai-agent.png";

const TypingIndicator = () => {
  return (
    <div className='flex items-center gap-2'>
      {/* Image section - same as chat component */}
      <Image src={AiImage} alt='AI agent Image' className='hidden md:block w-5 h-5' />
      <Image src={AiImage} alt='AI agent Image' className='md:hidden w-4 h-4' />

      {/* Chat bubble with typing dots - responsive */}
      <div className='hidden md:block w-fit h-fit px-[13px] py-[11px] bg-[#00000008] rounded-bl-[12px] rounded-t-[12px]'>
        <div className='flex items-center gap-1'>
          <div className='w-2 h-2 bg-black rounded-full animate-pulse'></div>
          <div className='w-2 h-2 bg-gray-700 rounded-full animate-pulse delay-75'></div>
          <div className='w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150'></div>
        </div>
      </div>

      <div className='md:hidden w-fit h-fit px-[10px] py-[8px] bg-[#00000008] rounded-bl-[10px] rounded-t-[10px]'>
        <div className='flex items-center gap-1'>
          <div className='w-1.5 h-1.5 bg-black rounded-full animate-pulse'></div>
          <div className='w-1.5 h-1.5 bg-gray-700 rounded-full animate-pulse delay-75'></div>
          <div className='w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse delay-150'></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
