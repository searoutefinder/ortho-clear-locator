import React, { useEffect, useState } from 'react';

// Context
import { useLocatorData } from '../../context/LocatorContext.jsx';

// Components
import Map from '../Map/Map.jsx';
import SideBar from '../SideBar/SideBar.jsx';
import LocationInput from '../LocationInput/LocationInput.jsx';
import SuggestionList from '../SuggestionList/SuggestionList.jsx';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner.jsx'

// Styles
import './App.css';

const App = () => {

  // Global State

  const {
    setQuery, 
    filteredLocations, 
    isSuggestionListOpen, 
    setIsSuggestionListOpen, 
    setIsSuggestionSelected, 
    selectedLocationObj, 
    setSelectedLocationObj,
    isLoading
  } = useLocatorData();

  // Local state

  const [suggestions, setSuggestions] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Events

  const suggestionsChangedHandler = (val) => {
    setSuggestions(val);
  }

  const suggestionSelectedHandler = (item) => {
    setSelectedLocationObj(item);
    setQuery(item.place_name);
    setIsSuggestionSelected(true);
    setHighlightedIndex(-1);
    setIsSuggestionListOpen(false);    
  }

  const arrowDownHandler = () => {
    if (suggestions === null || suggestions.length === 0) return;
    setHighlightedIndex((prev) =>
      prev < suggestions.length - 1 ? prev + 1 : 0
    );
  }

  const arrowUpHandler = () => {
    if (suggestions === null || suggestions.length === 0) return;
    setHighlightedIndex((prev) =>
      prev > 0 ? prev - 1 : suggestions.length - 1
    );
  }

  const enterHandler = () => {
    if (suggestions === null || suggestions.length === 0) return;
    const selected = suggestions[highlightedIndex];
    setSelectedLocationObj(selected);

    // Hide the list and reset the highlightedIndex
    setIsSuggestionSelected(true);
    setHighlightedIndex(-1);
    setIsSuggestionListOpen(false);
  }    

  // JSX

  return (
    <div className="App h-full w-full flex">
      <Map 
        selectedLocation={selectedLocationObj} 
      />
      <LocationInput 
        onChange={suggestionsChangedHandler} 
        onArrowDown={arrowDownHandler}
        onArrowUp={arrowUpHandler}
        onEnter={enterHandler}
        suggestions={suggestions}
        highlightedIndex={highlightedIndex}
      />
      {isSuggestionListOpen &&
        <SuggestionList 
          suggestions={suggestions} 
          highlightedIndex={highlightedIndex}
          onSelect={suggestionSelectedHandler}
        />
      }
      <SideBar locations={filteredLocations}/>
      {isLoading && <LoadingSpinner />}
    </div>
  );
}

export default App;
