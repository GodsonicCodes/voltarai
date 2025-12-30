import React from 'react';
import ChatbotAgent from "../../../../../public/assets/ai/chat-ai-agent.png";
import Image from 'next/image';

const Agent = () => {
  return (
    <div className='bg-transparent flex flex-col gap-3 max-w-[80%] w-full mx-auto items-center text-center mb-8 md:mb-8 justify-center z-100'>
        <Image src={ChatbotAgent} alt="Chatbot Image" />
        <p className='hidden md:block font-medium text-base text-[#1E1E1E]'>How can I assist you today?</p>
        <p className='md:hidden font-medium text-sm text-[#000000B2]'>How can I assist you today?</p>
        <div className='hidden md:block font-[375] text-sm text-[#1E1E1E] items-center justify-center flex'>I am <span className='font-medium text-[#004AE9]'>&nbsp;V-Agent</span>, Voltar AI's Intelligent Assistant.</div>
        <div className='md:hidden font-[375] text-xs text-[#000000B2] flex items-center justify-center'>I am <span className='font-medium text-[#004AE9]'>&nbsp;V-Agent</span>, Voltar AI's Intelligent Assistant.</div>
        <p className='hidden md:block font-[375] text-sm text-[#1E1E1E]'>I go beyond answering questions - I qualify leads, schedule demos, and deliver strategic automation advice tailored to your business.</p>
        <p className='md:hidden font-[375] text-xs text-[#000000B2]'>I go beyond answering questions - I qualify leads, schedule demos, and deliver strategic automation advice tailored to your business.</p>
    </div>
  )
}

export default Agent;