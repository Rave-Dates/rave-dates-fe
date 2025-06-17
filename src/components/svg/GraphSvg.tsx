import React from 'react';

const GraphSvg = ({ className } : { className?: string }) => {
  return (
     <svg className={className} width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.58337 18.6666L13.5834 14.6666L16.25 17.3333L20.25 13.3333L22.9167 16M5.58337 24V7.99998C5.58337 7.29274 5.86433 6.61446 6.36442 6.11436C6.86452 5.61426 7.5428 5.33331 8.25004 5.33331H24.25C24.9573 5.33331 25.6356 5.61426 26.1357 6.11436C26.6358 6.61446 26.9167 7.29274 26.9167 7.99998V24C26.9167 24.7072 26.6358 25.3855 26.1357 25.8856C25.6356 26.3857 24.9573 26.6666 24.25 26.6666H8.25004C7.5428 26.6666 6.86452 26.3857 6.36442 25.8856C5.86433 25.3855 5.58337 24.7072 5.58337 24Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

export default GraphSvg;