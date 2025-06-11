import React from 'react';

const HomeSvg = ({ className } : { className?: string }) => {
  return (
     <svg className={className} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M28 23.7478V14.4884C28 13.1762 27.4301 11.9375 26.4558 11.1319L19.2744 5.19428C17.3484 3.60191 14.6516 3.60191 12.7257 5.19428L5.54424 11.1319C4.56989 11.9375 4 13.1762 4 14.4884V23.7478C4 26.0962 5.79086 28 8 28H11C11.5523 28 12 27.5523 12 27V22.3304C12 19.982 13.7909 18.0783 16 18.0783C18.2091 18.0783 20 19.982 20 22.3304V27C20 27.5523 20.4477 28 21 28H24C26.2091 28 28 26.0962 28 23.7478Z" stroke="currentColor"/>
    </svg>
  );
};

export default HomeSvg;