import React from 'react';
import { SendHorizonal, Square } from 'lucide-react';

interface SubmitProps{
    isTyping?: boolean;
    onClick?: () => void;
    onStop?: () => void;
    isEmpty?: boolean;
    disabled?: boolean;
}

const Submit = ({ isTyping, onClick, onStop, isEmpty, disabled = false }: SubmitProps) => {
    return isTyping ? (  
        <button 
            onClick={onStop}
            disabled={disabled}
            className={`flex items-center justify-center w-[28px] h-[28px] rounded-full transition-colors duration-300 shadow-lg hover:shadow-xl ${
                disabled
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-[#000000] text-white hover:bg-[#333333] cursor-pointer'
            }`}
        >
            <Square className='w-[14px] h-[14px]' />
        </button>
    ) : (
        <button 
            onClick={onClick}
            disabled={disabled || isEmpty || isTyping}
            className={`flex items-center justify-center w-[28px] h-[28px] rounded-full transition-colors duration-300 shadow-lg hover:shadow-xl ${
                disabled || isEmpty || isTyping
                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                    : 'bg-[#000000] text-white hover:bg-[#333333] cursor-pointer'
            }`}
        >
            <SendHorizonal className='w-[14px] h-[14px]' />
        </button>
    )
}

export default Submit;