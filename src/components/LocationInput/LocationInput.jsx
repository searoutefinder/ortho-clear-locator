import React, { useRef, useEffect } from 'react';
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
    setUserLocation,
    isClearButtonVisible, 
    setIsClearButtonVisible,
    setIsLoading
  } = useLocatorData();
  
  // Refs
  const inputRef = useRef(null);


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
  const clearInputHandler = (e) => {
    setQuery("");
    setIsSuggestionListOpen(false);
    setSelectedLocationObj(null);
    onChange(null); 
    setIsClearButtonVisible(false); 
    inputRef.current?.focus();  
  }
  const simpleSearchHandler = () => {
    geocodeInput(inputRef.current.value);
  }
  const geolocationClickHandler = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(geolocationSuccessHandler, geolocationFailureHandler);
    } else {
      alert("Geolocation is not supported by this browser.");
      setIsLoading(false);
    } 
  }
  const geolocationSuccessHandler = async (position) => {
    const address = await reverseGeocode([position.coords.longitude, position.coords.latitude]);

    const currentLocation = {
      "type": "Feature", 
      "properties": {
        "place_name": address.features[0].place_name
      }, 
      "geometry": {
        "type": "Point",
        "coordinates": [position.coords.longitude, position.coords.latitude]
      }
    };
    setQuery(address.features[0].place_name);
    setIsSuggestionListOpen(false); 
    setIsSuggestionSelected(true);      
    setUserLocation(currentLocation);
    setIsClearButtonVisible(true); 
    setIsLoading(false);
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
    setIsLoading(false);    
  }
  const reverseGeocode = async (lngLat) => {
    try {
      const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lngLat[0]},${lngLat[1]}.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`);
      const data = await response.json();
      
      return data;
      
    } catch (error) {
      console.error("Mapbox geocoding error:", error);
      return null;
    }        
  }
  const geocodeInput = async (addressInput) => {
    try {
      const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(addressInput)}.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`);
      const data = await response.json();
      
      const f = data.features[0];

      let item = {
        "latlng": f.center,
        "place_name": f.place_name,
        "bbox": f.bbox  
      }

      setSelectedLocationObj(item);
      setQuery(item.place_name);
      setIsSuggestionSelected(true);
      setIsSuggestionListOpen(false);  
    }
    catch(error) {
      console.log(error);
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
        setIsClearButtonVisible(false);
        return;
      }

      setIsClearButtonVisible(true);
      

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
    <div className="transition-all duration-300 ease-in-out bg-[#3b3b3b] absolute w-full md:left-0 md:top-0 h-20 p-4 z-999">
      <div className="flex gap-x-2 justify-center items-center w-full h-full">
        <div className="flex bg-[#FFF] w-full h-full rounded-3xl shadow-md pr-6">
          <input 
            ref={inputRef}
            value={query} 
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={keyDownHandler}
            type="text" 
            className="text-base w-full flex flex-col focus:outline-none bg-[#FFF] p-3 pl-6 pr-6 rounded-tl-3xl rounded-bl-3xl" 
            placeholder="Enter your address"
          />
          {
            isClearButtonVisible  && 
              <button
                onClick={clearInputHandler} 
                className="flex relative right-4 top-0 justify-center items-center cursor-pointer"
                title="Clear Input"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#3b3b3b" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </button>
          }
          <button
            onClick={geolocationClickHandler} 
            className="relative right-[-12] top-0 flex justify-center items-center cursor-pointer" 
            title="Use my current location"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#3b3b3b" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
          </button>          
        </div>
        <button
          onClick={simpleSearchHandler} 
          className="flex p-3 w-20 rounded-3xl bg-[#FFF] justify-center items-center cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#3b3b3b" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default LocationInput;
