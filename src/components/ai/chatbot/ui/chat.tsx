import React, { Fragment } from 'react';
import Image from 'next/image';
import AiImage from "../../../../../public/assets/ai/chat-ai-agent.png";

// Function to parse markdown and convert **text** to bold, handle line breaks, and format lists
const parseMarkdown = (text: string) => {
  // First, handle line breaks by splitting the text
  const lines = text.split('\n');
  
  const elements: any[] = [];
  
  lines.forEach((line, lineIndex) => {
    // Process each line for bold text
    const boldRegex = /\*\*(.*?)\*\*/g;
    const lineParts: any[] = [];
    let lastIndex = 0;
    let match;
    
    while ((match = boldRegex.exec(line)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        lineParts.push(line.substring(lastIndex, match.index));
      }
      
      // Add the bold text
      lineParts.push(<strong key={`bold-${lineIndex}-${match.index}`}>{match[1]}</strong>);
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text after the last match in this line
    if (lastIndex < line.length) {
      lineParts.push(line.substring(lastIndex));
    }
    
    // Add the processed line
    elements.push(
      <Fragment key={`line-${lineIndex}`}>
        {lineParts}
        {lineIndex < lines.length - 1 && <br />} {/* Add line break except for the last line */}
      </Fragment>
    );
  });
  
  return elements;
};

interface ChatProps {
  isAi: boolean;
  value: string;
}

const Chat = ({ isAi, value }: ChatProps) => {
  return isAi ? (
    // AI message – LEFT
    <div className='flex items-start gap-2 justify-start'>
      {/* AI avatar on the left */}
      <div className='flex-shrink-0'>
        <Image
          src={AiImage}
          alt='AI agent Image'
          className='hidden md:block w-8 h-8 rounded-full'
        />
        <Image
          src={AiImage}
          alt='AI agent Image'
          className='md:hidden w-6 h-6 rounded-full'
        />
      </div>

      {/* Chat bubble */}
      <div className='max-w-[75%]'>
        <div className='hidden md:block px-4 py-3 bg-[#00000008] rounded-br-[12px] rounded-tl-[12px] rounded-tr-[12px]'>
          <p className='font-[375] text-base text-[#1E1E1E]'>{parseMarkdown(value)}</p>
        </div>
        <div className='md:hidden px-3 py-2 bg-[#00000008] rounded-br-[10px] rounded-tl-[10px] rounded-tr-[10px]'>
          <p className='font-[375] text-sm text-[#000000B2]'>{parseMarkdown(value)}</p>
        </div>
      </div>
    </div>
  ) : (
    // USER message – RIGHT
    <div className='flex items-center gap-2 justify-end'>
      {/* Chat bubble */}
      <div className='max-w-[75%]'>
        <div className='hidden md:block px-4 py-3 bg-[#004AE9] rounded-bl-[12px] rounded-tl-[12px] rounded-tr-[12px]'>
          <p className='font-[375] text-base text-white'>{parseMarkdown(value)}</p>
        </div>
        <div className='md:hidden px-3 py-2 bg-[#004AE9] rounded-bl-[10px] rounded-tl-[10px] rounded-tr-[10px]'>
          <p className='font-[375] text-sm text-white'>{parseMarkdown(value)}</p>
        </div>
      </div>

      {/* YOU badge – rightmost */}
      <div className='flex-shrink-0 flex items-center justify-center'>
        <div className='flex items-center justify-center bg-[#B5CDFF] rounded-full w-6 h-6 md:w-8 md:h-8'>
          <p className='text-[12px] md:text-[14px] font-[375] text-black leading-none'>You</p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
