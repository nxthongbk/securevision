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
      // mapStyle={mapStyle ?? 'mapbox://styles/mapbox/dark-v11'}
      mapStyle= 'mapbox://styles/mapbox/dark-v11'


      keyboard={false}
      doubleClickZoom={false}

      // Add type casting for BUILD
      onRender={(event) => (event.target as any)?.resize()}
      ref={ref}
      onMove={onMove && onMove}
      onLoad={onLoad && onLoad}
    >
      {children}
    </Map>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export default forwardRef(MapBox);
