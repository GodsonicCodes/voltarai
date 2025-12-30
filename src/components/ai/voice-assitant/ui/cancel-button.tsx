import React from 'react';
import { PhoneOff } from 'lucide-react';

interface CancelButtonProps {
  onClick?: () => void;
}

const CancelButton: React.FC<CancelButtonProps> = ({ onClick }) => {
  return (
    <div 
      className='w-fit p-4 flex justify-center items-center bg-[#DE0202] hover:cursor-pointer hover:bg-[#DE0202]/80 rounded-[40px] transition duration-150 ease-in-out'
      onClick={onClick}
    >
      <PhoneOff className='rotate-270 text-white fill-white' />
    </div>
  );
};

export default CancelButton;