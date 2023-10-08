import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { GestureHandling } from "leaflet-gesture-handling";

import "leaflet/dist/leaflet.css";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";


const basePath = process.env.NEXT_PUBLIC_BASE_PATH;

// Define a new pane to move the popup to a higher z-index layer
L.Map.include({
  _initPopupPane: function () {
    const pane = (this._popupPane = this.createPane("leaflet-popup-pane"));
    pane.style.zIndex = 650;
  },
});

// Attach gestureHandling as a handler to the map
L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);

const MapComponent = ({ center, marker, content }) => {

    // Define a custom icon
    let customIcon = L.icon({
      iconUrl: basePath + "/leaflet/images/marker-icon.png",
      iconRetinaUrl: basePath + "/leaflet/images/marker-icon-2x.png",
      shadowUrl: basePath + "/leaflet/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    return (
      <MapContainer
        center={center}
        zoom={13}
        gestureHandling={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={marker} icon={customIcon}>
          <Popup style={{
            maxHeight: "30vh",
            maxWidth: "80vw",
            overflowY: "auto",
            overflowX: "hidden"
          }}>
            {content}
          </Popup>
        </Marker>
      </MapContainer>
    );
}

export default MapComponent;