import React, { useRef, useEffect, useState } from 'react';
import { useLocatorData } from '../../context/LocatorContext.jsx';

const SideBar = ({locations}) => {
  
  const { selectedLocationId, setSelectedLocationId, setZoomedLocationId } = useLocatorData();

  // Ref for the scrollable container
  const sidebarRef = useRef(null);

  // Refs for each location card
  const cardRefs = useRef({});

  // Handlers
  const ctaClickHandler = (item) => {
    if(item.hasOwnProperty("APPOINTMENT_URL") && item['APPOINTMENT_URL'].length > 0) {
      window.open(item['APPOINTMENT_URL']);
    }
  }

  // Scroll into view when selectedLocationId changes
  useEffect(() => {
    if (selectedLocationId && cardRefs.current[selectedLocationId]) {
      const card = cardRefs.current[selectedLocationId];
      const sidebar = sidebarRef.current;

      // Ensure both elements exist
      if (card && sidebar) {
        card.scrollIntoView({
          behavior: 'smooth',
          block: 'start', // or 'nearest' / 'start'
        });
      }
    }
  }, [selectedLocationId]);

  return (
    <div className="transition-all duration-300 ease-in-out absolute right-0 bottom-0 w-full md:top-24 md:h-[calc(100vh-10rem)] md:w-96">
      <div className="md:h-[4rem] p-4 flex flex-row hidden md:block text-lg font-semibold text-gray-700 flex-shrink-0 bg-white/50  backdrop-blur-sm">
        <h2 className="text-center text-md">{locations.length} Ortho Clear Locations within view</h2>
      </div>    
      <div ref={sidebarRef} className={`
        overflow-x-auto
        overflow-y-hidden 
        md:overflow-x-hidden
        md:overflow-y-auto 
        flex 
        w-full 
        bg-white/50 
        backdrop-blur-sm 
        shadow-lg 
        pl-4
        md:pl-6
        pt-4
        md:pt-0
        pr-4
        md:pr-6
        pb-4 
        max-h-72
        md:flex-col 
        md:h-screen
        md:max-h-full ${locations.length === 0 ? 'justify-center' : ''}`}
      >


        <div className="
          flex 
          md:flex-col 
          space-x-4 
          md:space-x-0 
          md:space-y-4 
          md:pb-0"
        >

        {
          locations.length > 0 ? (
            locations.map((location, index) => (
              <div 
                key={location.ID} 
                ref={(el) => (cardRefs.current[location.ID] = el)}
                className={`flex flex-col flex-shrink-0 w-54 md:w-full p-4 rounded-lg bg-[#FFF] shadow-md ${selectedLocationId === location.ID ? 'bg-[#ffd0ef]' : 'hover:bg-[#ffd0ef]'} cursor-pointer`}
                onClick={
                  () => {
                    setSelectedLocationId(location.ID)
                    setZoomedLocationId(location.ID);
                  }
                }
              >      
                <img 
                  src={location.IMG_URL}
                  className="h-24 md:h-32 object-cover object-center w-full rounded-lg"
                  alt=""
                />
                <h3 className="mt-2 text-sm font-semibold text-gray-800 cursor-pointer" title={location.CLINIC}>
                  {location.CLINIC}
                </h3>
                <p className="mt-1 text-sm text-gray-600 mb-2">{`${location.STREET} ${location.NUMBER}, ${location.POSTCODE} ${location.CITY}`}</p>
                <button
                  onClick={(e) => { 
                    e.stopPropagation();
                    ctaClickHandler(location); 
                  }} 
                  className="rounded-3xl text-sm hover:bg-[rgb(240,35,116)] bg-[rgb(239,97,153)] p-2 mt-auto text-[#FFFFFF] cursor-pointer"
                >
                  AFSPRAAK MAKEN
                </button>
              </div>  
            ))
          ) 
          : 
          (<p className="text-center">We are sorry!<br />No clinics are available in the searched region!</p>)
        }
  
                       


        </div>
      </div>
    </div>
)
}

export default SideBar;