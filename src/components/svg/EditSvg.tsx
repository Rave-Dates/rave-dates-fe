import React from 'react';

const EditSvg = ({ className } : { className?: string }) => {
  return (
    <svg className={className} width="1em" height="1em" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.2502 5.41664L14.5835 8.74997M3.3335 16.6666H6.66683L15.4168 7.91663C15.8589 7.47461 16.1072 6.87509 16.1072 6.24997C16.1072 5.62485 15.8589 5.02533 15.4168 4.5833C14.9748 4.14127 14.3753 3.89294 13.7502 3.89294C13.125 3.89294 12.5255 4.14127 12.0835 4.5833L3.3335 13.3333V16.6666Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

export default EditSvg;
