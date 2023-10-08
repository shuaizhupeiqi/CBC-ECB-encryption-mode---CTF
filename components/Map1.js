import React, { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';

const customIcon = L.icon({
  iconUrl: "/leaflet/images/marker-icon.png",
  iconRetinaUrl: "/leaflet/images/marker-icon-2x.png",
  shadowUrl: "/leaflet/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapClickHandler = ({ setCoordinates }) => {
  const map = useMap();
  useMapEvents({
    click: (e) => {
      setCoordinates(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return null;
};

const MapComponent = ({ onMapClick }) => {
  const [markerPosition, setMarkerPosition] = useState(null);
  const [coordinates, setCoordinates] = useState({ lat: -33.8651, lng: 151.2099 });

  const handleClick = (newCoordinates) => {
    setCoordinates(newCoordinates);
    setMarkerPosition(newCoordinates);
    if (onMapClick) {
      onMapClick(newCoordinates);
    }
  };

  return (
    <div>
<MapContainer
  center={coordinates}
  zoom={13}
  style={{ height: '50vh', width: '90vw' }}
>

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler setCoordinates={handleClick} />
        {markerPosition && <Marker position={markerPosition} icon={customIcon} />}
      </MapContainer>
      {coordinates && (
        <div>
           {/*    <p>Latitude: {coordinates.lat}</p> */}
          {/*          <p>Longitude: {coordinates.lng}</p> */}
        </div>
      )}
    </div>
  );
};

export default MapComponent;