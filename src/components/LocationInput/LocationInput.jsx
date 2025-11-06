import React, { useEffect } from 'react';
import { useLocatorData } from '../../context/LocatorContext.jsx';

const LocationInput = ({onChange, onArrowDown, onArrowUp, onEnter, suggestions, highlightedIndex}) => {

  // Global state variables
  const { 
    query, 
    setQuery, 
    debouncedQuery, 
    setDebouncedQuery, 
    isSuggestionSelected, 
    setIsSuggestionSelected, 
    setIsSuggestionListOpen, 
    setSelectedLocationObj,
    setUserLocation 
  } = useLocatorData();
  
  // Event handlers
  const keyDownHandler = (e) => {
    setIsSuggestionSelected(false);  
    if (e.key === "ArrowDown") {
      e.preventDefault();
      onArrowDown();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      onArrowUp();
    } else if (e.key === "Enter") {
      e.preventDefault();
      onEnter();
      setQuery(suggestions[highlightedIndex]?.place_name);
    }   
  }
  const geolocationClickHandler = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(geolocationSuccessHandler, geolocationFailureHandler);
      } else {
        alert("Geolocation is not supported by this browser.");
      } 
  }
  const geolocationSuccessHandler = (position) => {
    const currentLocation = {
      "type": "Feature", 
      "properties": {}, 
      "geometry": {
        "type": "Point",
        "coordinates": [position.coords.longitude, position.coords.latitude]
      }
    };
    setUserLocation(currentLocation);
  }
  const geolocationFailureHandler = (error) => {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        alert("User denied the request for Geolocation.");
      break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.");
      break;
      case error.TIMEOUT:
        alert("The request to get user location timed out.");
      break;
      case error.UNKNOWN_ERROR:
        alert("An unknown error occurred.");
      break;
    }    
  }

  // Hooks
  useEffect(() => {
    
    if(isSuggestionSelected) { return; }

    // Throttle/debounce input updates (300ms)

    const handler = setTimeout(() => {
      setDebouncedQuery(query);      
    }, 300);

    return () => clearTimeout(handler);

  }, [query]);

  useEffect(() => {

    // Update suggestions when debounced query changes    
  
    const fetchSuggestions = async () => {
      if(debouncedQuery === "") {
        setIsSuggestionListOpen(false);
        setSelectedLocationObj(null);
        onChange(null);
        return;
      }

      if (debouncedQuery.trim()) {

        let mapboxResults = [];

        try {
          const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(debouncedQuery)}.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}&autocomplete=true&limit=5`);
          const data = await response.json();

          mapboxResults = data.features.map((f) => {
            return {
              "latlng": f.center,
              "place_name": f.place_name,
              "bbox": f.bbox  
            }
          });

          onChange(mapboxResults);
          setIsSuggestionListOpen(true);

        } catch (error) {
          console.error("Mapbox geocoding error:", error);
        }    
      } else {
        onChange(null);
      }        
    };

    fetchSuggestions();

  }, [debouncedQuery]);  

  return (
    <div className="transition-all duration-300 ease-in-out bg-[rgb(239,97,153)]/50 backdrop-blur-sm absolute w-full md:right-0 md:top-0 md:w-96 h-24 p-6 z-999">
      <div className="flex justify-center items-center w-full h-full">
        <div className="bg-[#FFF] w-full h-full rounded-3xl shadow-md pr-14">
        <input 
          value={query} 
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={keyDownHandler}
          type="text" 
          className="focus:outline-none bg-[#FFF] p-3 pl-6 w-full rounded-tl-3xl rounded-bl-3xl" 
          placeholder="Enter your address"
        />
        <button
          onClick={geolocationClickHandler} 
          className="flex absolute right-8 top-10 flex justify-center items-center cursor-pointer" 
          title="Use my current location"
        >
          <span className="h-9 w-9">
            <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink" 
                viewBox="0 0 447.342 447.342"
                xmlSpace="preserve"
                className="h-5 w-5"
            >
              <path
                d="M443.537,3.805c-3.84-3.84-9.686-4.893-14.625-2.613L7.553,195.239c-4.827,2.215-7.807,7.153-7.535,12.459  c0.254,5.305,3.727,9.908,8.762,11.63l129.476,44.289c21.349,7.314,38.125,24.089,45.438,45.438l44.321,129.509  c1.72,5.018,6.325,8.491,11.63,8.762c5.306,0.271,10.244-2.725,12.458-7.535L446.15,18.429  C448.428,13.491,447.377,7.644,443.537,3.805z"
                style={{fill:"none",stroke:"#8f8f8f",strokeOpacity:1,strokeWidth:26.77532539,strokeMiterlimit:4,strokeDasharray:"none"}}
              />
            </svg>
          </span>
        </button>
        </div>
      </div>
    </div>
  );
}

export default LocationInput;
