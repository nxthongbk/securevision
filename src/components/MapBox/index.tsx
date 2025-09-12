import 'mapbox-gl/dist/mapbox-gl.css';
import { forwardRef } from 'react';
import { Map, MapProps } from 'react-map-gl';

const accessToken = import.meta.env.VITE_TOKEN_MAPBOX;

function MapBox(props: Omit<MapProps, 'projection'>, ref?: any) {
  const { children, initialViewState, style, onMove, onLoad } = props;

  return (
    <Map
      mapboxAccessToken={accessToken}
      initialViewState={initialViewState}
      style={{ width: '100%', height: '100%', ...style }}
      mapStyle='mapbox://styles/mapbox/dark-v11'
      keyboard={false}
      doubleClickZoom={false}
      onRender={(event) => (event.target as any)?.resize()}
      ref={ref}
      onMove={onMove && onMove}
      onLoad={(event) => {
        const map = event.target;

        // 1️⃣ Add DEM source for 3D terrain
        map.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512,
          maxzoom: 14
        });

        // 2️⃣ Enable terrain with vertical exaggeration
        map.setTerrain({ source: 'mapbox-dem', exaggeration: 2 });

        // 3️⃣ Add sky layer for 3D effect
        map.addLayer({
          id: 'sky',
          type: 'sky',
          paint: {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 0.0],
            'sky-atmosphere-sun-intensity': 15
          }
        });

        // 4️⃣ Add 3D buildings
        map.addLayer({
          id: '3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 15,
          paint: {
            'fill-extrusion-color': '#333333',
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': ['get', 'min_height'],
            'fill-extrusion-opacity': 0.8
          }
        });

        // Call the user's onLoad callback if provided
        onLoad && onLoad(event);
      }}
    >
      {children}
    </Map>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export default forwardRef(MapBox);
