// Core 
import React, { createContext, useContext, useState } from 'react';

window.ocLocations = [
    {
      "ID": 1,
      "CLINIC": "Orthoclear Amsterdam",
      "STREET": "Keizersgracht",
      "NUMBER": "349",
      "POSTCODE": "1016 EH",
      "CITY": "Amsterdam",
      "COUNTRY": "Netherlands",
      "LABEL": "Dinsdag, Zaterdag",
      "LAT": 52.3690551,
      "LNG": 4.884954903,
      "APPOINTMENT_URL": "https://telex.hu",
      "IMG_URL": "https://images.atlist.com/aae7689c-aa4c-442e-9967-f03c9d1b8d1b.webp"
    },
    {
      "ID": 2,
      "CLINIC": "Orthoclear Amstelveen",
      "STREET": "Dorpsstraat",
      "NUMBER": "36",
      "POSTCODE": "1182 JE",
      "CITY": "Amstelveen",
      "COUNTRY": "Netherlands",
      "LABEL": "Woensdagen, In de Kerk",
      "LAT": 52.30248382,
      "LNG": 4.84721903,
      "APPOINTMENT_URL": "https://telex.hu",
      "IMG_URL": "https://images.atlist.com/3cffa868-ccc0-4809-afa5-86f29b2c125d.webp"
    },
    {
      "ID": 3,
      "CLINIC": "Orthoclear Utrecht",
      "STREET": "Smakkelaarshoek",
      "NUMBER": "5",
      "POSTCODE": "3511 EC",
      "CITY": "Utrecht",
      "COUNTRY": "Netherlands",
      "LABEL": "Vrijdagen, The Gallery Salon Studios",
      "LAT": 52.09181119,
      "LNG": 5.110445385,
      "APPOINTMENT_URL": "https://telex.hu",
      "IMG_URL": "https://images.atlist.com/88aa59fd-e49a-43fc-a5a3-e12311dc9d6f.jpg"
    },
    {
      "ID": 4,
      "CLINIC": "Orthoclear Den Haag",
      "STREET": "Statenplein",
      "NUMBER": "21",
      "POSTCODE": "2582 EZ",
      "CITY": "Den Haag",
      "COUNTRY": "Netherlands",
      "LABEL": "Maandagen",
      "LAT": 52.09033823,
      "LNG": 4.278324529,
      "APPOINTMENT_URL": "https://telex.hu",
      "IMG_URL": "https://images.atlist.com/ca2c7019-d650-4889-a506-41b62317f40f.webp"
    },
    {
      "ID": 5,
      "CLINIC": "Orthoclear Tilburg",
      "STREET": "Spoorlaan",
      "NUMBER": "338",
      "POSTCODE": "5038 CC",
      "CITY": "Tilburg",
      "COUNTRY": "Netherlands",
      "LABEL": "Donderdagen, Medisch Centrum Spoorlaan",
      "LAT": 51.55950794,
      "LNG": 5.089157726,
      "APPOINTMENT_URL": "https://telex.hu",
      "IMG_URL": "https://images.atlist.com/b07afc00-076d-4db6-943f-d97bb18f404c.webp"
    },
    {
      "ID": 6,
      "CLINIC": "Orthoclear Amersfoort",
      "STREET": "Maanlander",
      "NUMBER": "4",
      "POSTCODE": "3824 MP",
      "CITY": "Amersfoort",
      "COUNTRY": "Netherlands",
      "LABEL": "Mondgezondheidscentrum Amersfoort",
      "LAT": 52.19679126,
      "LNG": 5.387345696,
      "APPOINTMENT_URL": "https://telex.hu",
      "IMG_URL": "https://images.atlist.com/52e00502-239c-431e-9869-639bbd5abc5a.jpg"
    },
    {
      "ID": 7,
      "CLINIC": "Orthoclear Oss",
      "STREET": "Molenstraat",
      "NUMBER": "121",
      "POSTCODE": "5342 CA",
      "CITY": "Oss",
      "COUNTRY": "Netherlands",
      "LABEL": "De Mondzorgpraktijk",
      "LAT": 51.76278575,
      "LNG": 5.52929202,
      "APPOINTMENT_URL": "https://telex.hu",
      "IMG_URL": "https://images.atlist.com/54622612-cf4d-483d-bbd6-987266f2a2a3.webp"
    }
  ]

const LocatorContext = createContext();

export const LocatorDataProvider = ({ children }) => {
  
  // States
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [mapReady, setMapReady] = useState(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [locations, setLocations] = useState(window.ocLocations);
  const [filteredLocations, setFilteredLocations] = useState(window.ocLocations);
  const [selectedLocationObj, setSelectedLocationObj] = useState(null);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [zoomedLocationId, setZoomedLocationId] = useState(null);
  const [isSuggestionListOpen, setIsSuggestionListOpen] = useState(false);
  const [isSuggestionSelected, setIsSuggestionSelected] = useState(false);
  const [isClearButtonVisible, setIsClearButtonVisible] = useState(false);

  return (
    <LocatorContext.Provider value={{ 
      map, setMap, 
      mapReady, setMapReady,
      locations, setLocations,
      filteredLocations, setFilteredLocations,
      isSuggestionListOpen, setIsSuggestionListOpen,
      selectedLocationObj, setSelectedLocationObj,
      isSuggestionSelected, setIsSuggestionSelected,
      query, setQuery,
      debouncedQuery, setDebouncedQuery,
      selectedLocationId, setSelectedLocationId,
      userLocation, setUserLocation,
      zoomedLocationId, setZoomedLocationId,
      isClearButtonVisible, setIsClearButtonVisible,
      isLoading, setIsLoading
     }}
    >
      {children}
    </LocatorContext.Provider>
  );
};

export const useLocatorData = () => useContext(LocatorContext);