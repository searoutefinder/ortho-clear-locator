import React, { useRef, useEffect, useState } from 'react';
import { useLocatorData } from '../../context/LocatorContext.jsx';

const SuggestionList = ({suggestions, highlightedIndex, onSelect}) => {
    return (
      <div className="right-6 left-6 md:left-[unset] top-20 pt-5 pb-3 absolute md:w-84 h-auto z-999 bg-[#FFF] rounded-3xl shadow-md">
        <ul className="m-0 p-0 list-none">
          {
            suggestions.length > 0 ? (
              suggestions.map((item, idx) => {
                const globalIdx = idx; // geocodes first
                const isActive = highlightedIndex === globalIdx;                
                return (<li
                  key={idx}
                  onClick={() => {
                    onSelect(item);
                  }}
                  className={`${
                    isActive ? "bg-[#3b3b3b] text-[#FFF]" : "text-[#000] hover:bg-[#3b3b3b] hover:text-[#FFF]"
                  } pl-4 py-1 cursor-pointer text-[#000] text-sm hover:bg-[#3b3b3b] hover:text-[#FFF]`}
                >
                  {item.place_name}
                </li>)

              })) : (
                <li className="pl-4 py-1 text-[#000]">No locations found!</li>
            )
          }
        </ul>
      </div> 
   );
}
export default SuggestionList;