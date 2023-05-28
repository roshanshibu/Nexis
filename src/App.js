import React from "react";
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "./App.css";

const srhMarkerIcon = new Icon({
  iconUrl: require("./images/SRH_Icon.png"),
  iconSize: [45, 38]
})

function App() {
  return (<MapContainer center={[49.4043, 8.6758]} zoom={14}>
    <TileLayer
      attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
      url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      // url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
      // url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
      // url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
      // url="https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png"
      
      />
    <Marker position={[49.4139, 8.6511]} icon={srhMarkerIcon}
      data={{key: "value"}}
      eventHandlers={{
        click: (e) => {
          console.log(e.target.options.data);  // console log contents of data
        },
      }}>
      <Popup><p>I go here!</p></Popup>
    </Marker>
  </MapContainer>);
}

export default App;
