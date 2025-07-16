import React from 'react';

const UserSvg = ({ className, stroke = 1 } : { className?: string, stroke?: number }) => {
  return (
     <svg className={className} width="1em" height="1em" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21.8332 9.33333C21.8332 12.2789 19.4454 14.6667 16.4999 14.6667C13.5544 14.6667 11.1665 12.2789 11.1665 9.33333C11.1665 6.38781 13.5544 4 16.4999 4C19.4454 4 21.8332 6.38781 21.8332 9.33333Z" strokeWidth={stroke} stroke="currentColor"/>
      <path d="M20.4999 18.6667H12.4999C8.81798 18.6667 5.51999 22.0665 7.94318 24.8386C9.59106 26.7237 12.3162 28 16.4999 28C20.6836 28 23.4087 26.7237 25.0566 24.8386C27.4798 22.0665 24.1818 18.6667 20.4999 18.6667Z" strokeWidth={stroke} stroke="currentColor"/>
    </svg>
  );
};

export default UserSvg;