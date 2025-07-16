import React from 'react';

const InfoSvg = ({ className } : { className?: string }) => {
  return (
     <svg className={className} width="1em" height="1em" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 4.58325H10.0167M8.33337 9.58325H10V16.2499H11.6667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

export default InfoSvg;