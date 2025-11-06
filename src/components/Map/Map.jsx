import React, { useRef, useEffect, useState } from 'react';
import { featureCollection, bbox, union, centroid } from '@turf/turf'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import { useLocatorData } from '../../context/LocatorContext.jsx';
import GeolocationLayer from '../Layers/GeolocationLayer/GeolocationLayer.jsx';
import StoreLayer from '../Layers/StoreLayer/StoreLayer.jsx';

const Map = () => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  const { map, setMap, mapReady, setMapReady, selectedLocationObj, setSelectedLocationId, locations, setFilteredLocations, userLocation, zoomedLocationId } = useLocatorData();

  // Handlers

  const mapIdleHandler = () => {
    const stores = mapRef.current.queryRenderedFeatures({"target": {"layerId": "store-layer"}});
    const uniqueStoreIds = [
      ...new Set(
        stores.map((item) => {
          return item.properties.ID;
        })
      )
    ].sort();

    const filtered = locations.filter((item) => {
      return uniqueStoreIds.indexOf(item.ID) > -1;
    });

    setFilteredLocations(filtered);
  }

  const mapLoadhandler = () => {
    
    const icons = [
      { name: 'normal-icon', url: '/oc-logo-marker-normal.png' },
      { name: 'highlight-icon', url: '/oc-logo-marker-highlight.png' }
    ];
  
    icons.forEach(({ name, url }) => {
      if (!mapRef.current.hasImage(name)) {
        mapRef.current.loadImage(url, (error, image) => {
          if (error) {
            console.error(`Error loading ${name}:`, error);
            return;
          }
          if (!mapRef.current.hasImage(name)) {
            mapRef.current.addImage(name, image);
          }
        });
      }
    });

    setMap(mapRef.current);
    setMapReady(true);    
  }

  const mapClickHandler = () => { 
    setSelectedLocationId(null);
  }

  useEffect(() => {
    if (mapRef.current) return;

    mapboxgl.accessToken = import.meta.env.MAPBOX_TOKEN;

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      center: [6.309153470901201, 52.099502942886976],
      zoom: 6.7,
      minZoom: 6.7,
      projection: 'mercator'
    })
    
    mapRef.current.on("load", mapLoadhandler);

    mapRef.current.on("moveend", mapIdleHandler);
    mapRef.current.on("zoomend", mapIdleHandler);
    mapRef.current.on("dragend", mapIdleHandler);
    mapRef.current.on("click", mapClickHandler);
  
    return () => {
      if (mapRef.current && mapRef.current.isStyleLoaded()) {
        mapRef.current.off("click", mapClickHandler);
        mapRef.current.off("moveend", mapIdleHandler);
        mapRef.current.off("zoomend", mapIdleHandler);
        mapRef.current.off("dragend", mapIdleHandler);
        map.off("load", mapLoadhandler);
      }
    }
  }, []);

  useEffect(() => {
    if(selectedLocationObj === null) { return; }
    if(mapRef.current === null) { return; }

    if(typeof selectedLocationObj.bbox !== "undefined") {
      mapRef.current.once("idle", mapIdleHandler);
      mapRef.current.fitBounds([[selectedLocationObj.bbox[0], selectedLocationObj.bbox[1]], [selectedLocationObj.bbox[2], selectedLocationObj.bbox[3]]], {
        animate: false
      })
    }
    else
    {

      mapRef.current.once("idle", mapIdleHandler);

      mapRef.current.flyTo({
        center: selectedLocationObj.latlng,
        zoom: 8,
        duration: 1000,
        pitch: 0,
        bearing: 0
      });     
    }
  }, [selectedLocationObj]);

  useEffect(() => {
    const matchingLocationObj = locations.find(item => item.ID === zoomedLocationId);
    if(mapRef.current === null || typeof matchingLocationObj === "undefined") { return; }  

    mapRef.current.once("idle", mapIdleHandler);

    mapRef.current.flyTo({
      center: [matchingLocationObj.LNG, matchingLocationObj.LAT],
      zoom: 8,
      duration: 1000,
      pitch: 0,
      bearing: 0
    });

  }, [zoomedLocationId]);

  useEffect(() => {
    const handleResize = () => {
      console.log("Resized...")
      if (mapRef.current) {
        //fitMapToInitialBounds(initialBounds)
        mapRef.current.resize();
      }
    };
  
    window.addEventListener("resize", handleResize);
  
    return () => {
      window.removeEventListener("resize", handleResize);
    };    
  }, [])
  
  useEffect(() => {
    if(userLocation === null || typeof userLocation === "undefined") { return; }

    mapRef.current.once("idle", mapIdleHandler);
    
    mapRef.current.setCenter(userLocation.geometry.coordinates);
    mapRef.current.setZoom(8);
    /*mapRef.current.flyTo({
      center: userLocation.geometry.coordinates,
      zoom: 8,
      duration: 2000,
      pitch: 0,
      bearing: 0
    });
    */ 
  }, [userLocation]);

  return (
    <div className="absolute top-0 left-0 h-full map-wrap w-full mb-40 md:flex-1 md:mb-0 md:h-full ">
      <div ref={mapContainer} className="map h-full w-full absolute">
        {map && mapReady && <StoreLayer map={map} />}
        {map && mapReady && <GeolocationLayer map={map} />}
      </div>
    </div>
  );  
}

export default Map