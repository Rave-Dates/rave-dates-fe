import React from 'react';

const AddSvg = ({ className } : { className?: string }) => {
  return (
     <svg className={className} width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 4L12 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
};

export default AddSvg;