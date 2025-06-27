import React from 'react';

const ImageSvg = ({ className } : { className?: string }) => {
  return (
     <svg className={className} width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 11.6667C5 7.98477 7.98477 5 11.6667 5H28.3333C32.0152 5 35 7.98477 35 11.6667V28.3333C35 32.0152 32.0152 35 28.3333 35H11.6667C7.98477 35 5 32.0152 5 28.3333V11.6667Z" stroke="currentColor" strokeWidth="1.66667"/>
      <path d="M15.0001 18.3333C16.841 18.3333 18.3334 16.8409 18.3334 15C18.3334 13.159 16.841 11.6666 15.0001 11.6666C13.1591 11.6666 11.6667 13.159 11.6667 15C11.6667 16.8409 13.1591 18.3333 15.0001 18.3333Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.66675 33.3333L11.4564 27.3462C12.5184 26.0187 14.419 25.7237 15.8334 26.6666C17.2478 27.6096 19.1485 27.3145 20.2104 25.9871L22.8757 22.6554C24.042 21.1975 26.1783 20.9818 27.6125 22.177L35.0001 28.3333" stroke="currentColor" strokeWidth="1.66667"/>
    </svg>
  );
};

export default ImageSvg;