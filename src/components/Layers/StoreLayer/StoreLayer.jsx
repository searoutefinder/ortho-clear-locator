import { useEffect, useRef } from "react";
import { useLocatorData } from '../../../context/LocatorContext.jsx';

const StoreLayer = ({map}) => {

    const initializedRef = useRef(false);
    const { locations, setSelectedLocationId, selectedLocationId, zoomedLocationId } = useLocatorData();   
    
    const clickHandler = (e) => {
      console.log(e.features[0].properties)
      setSelectedLocationId(e.features[0].properties.ID);
      const feature = {"type": "Feature", "properties": structuredClone(e.features[0].properties), "geometry": {"type": "Point", "coordinates": [e.features[0].properties.LNG, e.features[0].properties.LAT]}}
      map.getSource("store-highlight-src").setData({"type": "FeatureCollection", "features": [feature]});
    }
    const mouseOverHandler = () => {
      map.getCanvas().style.cursor = 'pointer';
    }
    const mouseOutHandler = () => {
      map.getCanvas().style.cursor = '';
    }

    useEffect(() => {
      if (!map || initializedRef.current) return;
      initializedRef.current = true;
      initializeLayer();
  
      return () => {
        if (map && map.isStyleLoaded()) {
          map.off("click", "store-layer", clickHandler);
          map.off("mouseover", "store-layer", mouseOverHandler);
          map.off("mouseout", "store-layer", mouseOutHandler);
        }
      }
  
    }, [map]);

    useEffect(() => {
      if(selectedLocationId === null) {
        map.getSource("store-highlight-src").setData({"type": "FeatureCollection", "features": []});
      }
    }, [selectedLocationId]);

    useEffect(() => {
      if(zoomedLocationId === null) {
        map.getSource("store-highlight-src").setData({"type": "FeatureCollection", "features": []});
        return;
      }
      const matchingLocationObj = locations.find(item => item.ID === zoomedLocationId)
      const feature = {"type": "Feature", "properties": structuredClone(matchingLocationObj), "geometry": {"type": "Point", "coordinates": [matchingLocationObj.LNG, matchingLocationObj.LAT]}}
      map.getSource("store-highlight-src").setData({"type": "FeatureCollection", "features": [feature]});      
    }, [zoomedLocationId]);    

    useEffect(() => {
      if(!map) { return;}

      map.getSource("store-src").setData({
        "type": "FeatureCollection",
        "features": locations.map((item) => {
          return {"type": "Feature", "properties": structuredClone(item), "geometry": {"type": "Point", "coordinates": [item.LNG, item.LAT]}}
        })
      });

    }, [locations])

    const initializeLayer = () => {
      console.log('initializing stores layer');

        // Define value based styling rules
      map.addSource("store-src", {"type": "geojson", "data": {"type": "FeatureCollection", "features": []}}); 
      map.addSource("store-highlight-src", {"type": "geojson", "data": {"type": "FeatureCollection", "features": []}});        

      map.addLayer({
        "id": "store-layer",
        "type": "symbol",
        "source": "store-src",
        "layout": {
          "icon-image": "normal-icon",
          "icon-size": 0.5,
          "icon-allow-overlap": true
        }
      });

      map.addLayer({
        id: 'store-layer-highlight',
        type: 'symbol',
        source: 'store-highlight-src',
        layout: {
          'icon-image': 'highlight-icon',
          'icon-allow-overlap': true,
          "icon-size": 0.5          
        }
      });      
      
      map.on("click", "store-layer", clickHandler);
      map.on("mouseover", "store-layer", mouseOverHandler);
      map.on("mouseout", "store-layer", mouseOutHandler);
    }    
}

export default StoreLayer;