import React from 'react';

const ArrowSvg = ({ className } : { className?: string }) => {
  return (
     <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12H3M3 12L10 19M3 12L10 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

export default ArrowSvg;