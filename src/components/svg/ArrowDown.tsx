
import React from 'react';

const ArrowDownSvg = ({ className } : { className?: string }) => {
  return (
     <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.5 8.5L12.5 15.5L19.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

export default ArrowDownSvg;