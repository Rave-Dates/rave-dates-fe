import React from 'react';

const FilterSvg = ({ className } : { className?: string }) => {
  return (
     <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.96685 17H3M21 7H15M3.01 7H3M21.01 17H21M14.9337 14C16.5814 14 17.9171 15.3431 17.9171 17C17.9171 18.6569 16.5814 20 14.9337 20C13.286 20 11.9503 18.6569 11.9503 17C11.9503 15.3431 13.286 14 14.9337 14ZM8.96685 4C10.6146 4 11.9503 5.34315 11.9503 7C11.9503 8.65685 10.6146 10 8.96685 10C7.31915 10 5.98343 8.65685 5.98343 7C5.98343 5.34315 7.31915 4 8.96685 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
};

export default FilterSvg;