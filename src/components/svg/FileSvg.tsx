import React from 'react';

const FileSvg = ({ className } : { className?: string }) => {
  return (
     <svg className={className} width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 22.6667H20.5M12.5 17.3333H20.5M12.5 12H13.8333" stroke="currentColor" strokeLinecap="round"/>
      <path d="M17.8333 4V6.66667C17.8333 9.61219 20.2211 12 23.1666 12H25.8333M25.8333 11.7712V24C25.8333 26.2091 24.0424 28 21.8333 28H11.1666C8.95749 28 7.16663 26.2091 7.16663 24V8C7.16663 5.79086 8.95749 4 11.1666 4H18.0621C18.7693 4 19.4476 4.28095 19.9477 4.78105L25.0522 9.88562C25.5523 10.3857 25.8333 11.064 25.8333 11.7712Z" stroke="currentColor"/>
    </svg>
  );
};

export default FileSvg;