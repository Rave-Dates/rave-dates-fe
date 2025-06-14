import React from 'react';

const SubtractSvg = ({ className } : { className?: string }) => {
  return (
     <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 12L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
};

export default SubtractSvg;