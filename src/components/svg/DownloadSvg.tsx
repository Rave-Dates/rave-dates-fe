import React from 'react';

const DownloadSvg = ({ className } : { className?: string }) => {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 17.3252V19.3252C4 19.8556 4.21071 20.3643 4.58579 20.7394C4.96086 21.1145 5.46957 21.3252 6 21.3252H18C18.5304 21.3252 19.0391 21.1145 19.4142 20.7394C19.7893 20.3643 20 19.8556 20 19.3252V17.3252M7 11.3252L12 16.3252M12 16.3252L17 11.3252M12 16.3252V4.3252" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

export default DownloadSvg;
