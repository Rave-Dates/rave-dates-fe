import React from 'react';

const FacebookSvg = ({ className } : { className?: string }) => {
  return (
     <svg className={className} width="1em" height="1em" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 0C31.0457 2.57703e-07 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 2.5772e-07 31.0457 0 20C0 8.9543 8.9543 0 20 0ZM22.4609 10C18.8526 10 17.582 11.819 17.582 14.8779V17.1289H15.333V20.8789H17.582V31.7598H22.085V20.8789H25.0879L25.4863 17.1289H22.085L22.0898 15.252C22.0899 14.2741 22.1826 13.7501 23.5869 13.75H25.4648V10H22.4609Z" fill="currentColor"/>
    </svg>
  );
};

export default FacebookSvg;