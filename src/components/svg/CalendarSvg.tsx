import React from 'react';

const CalendarSvg = ({ className, type = "bold" } : { className?: string, type?: "thin" | "bold" }) => {
  return (
    <>
      {
        type === "bold" ? (
          <svg className={className} width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 3V6M17 10H7M17 17H16M16 3V6M7 21H17C19.2091 21 21 19.2091 21 17V8C21 5.79086 19.2091 4 17 4H7C4.79086 4 3 5.79086 3 8V17C3 19.2091 4.79086 21 7 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg className={className} width="1em" height="1em" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.9167 4V8M22.9167 13.3333H9.58333M22.9167 22.6667H21.5833M21.5833 4V8M9.58333 28H22.9167C25.8622 28 28.25 25.6122 28.25 22.6667V10.6667C28.25 7.72115 25.8622 5.33333 22.9167 5.33333H9.58333C6.63781 5.33333 4.25 7.72115 4.25 10.6667V22.6667C4.25 25.6122 6.63781 28 9.58333 28Z" stroke="currentColor" strokeLinecap="round"/>
          </svg>
        )
      }
    </>
  );
};

export default CalendarSvg;