import React from 'react';

const CalendarSvg = ({ className } : { className?: string }) => {
  return (
     <svg className={className} width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 3V6M17 10H7M17 17H16M16 3V6M7 21H17C19.2091 21 21 19.2091 21 17V8C21 5.79086 19.2091 4 17 4H7C4.79086 4 3 5.79086 3 8V17C3 19.2091 4.79086 21 7 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
};

export default CalendarSvg;