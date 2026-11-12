import React from 'react';
import { brand } from '@gitroom/helpers/utils/brand';

export const LogoTextComponent = () => {
  return (
    <div className="flex items-center gap-[10px]">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="32" height="32" rx="9" fill="#5B5BF0" />
      <path d="M6 18.5c2.6-5.2 5.4-5.2 8 0s5.4 5.2 8 0 3.2-4 4-4" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      <circle cx="24.5" cy="9" r="2.4" fill="#C8F560" />
      </svg>
      <span className="text-[22px] font-[600] tracking-[-0.02em]">
        {brand.name}
      </span>
    </div>
  );
};
