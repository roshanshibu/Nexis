import {LeafletTrackingMarker} from 'react-leaflet-tracking-marker'
import { Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import './CarIcon.css';
import { useEffect, useState } from 'react';

const carMarker = new Icon({
  iconUrl: require('../../Images/car_east.png'),
  iconSize: [30, 18],
});



const CarIcon = (props) => {
  const [lat, lon] = props.position
  const [prevPos, setPrevPos] = useState([lat, lon])
  
  useEffect(() => {
    if (prevPos[1] !== lon && prevPos[0] !== lat) setPrevPos([lat, lon]);
  }, [lat, lon, prevPos]);
  
  return (
    <LeafletTrackingMarker 
      position={[lat, lon]}
      previousPosition={prevPos}
      duration={props.duration}
      icon={carMarker}
      data={props.data}
      eventHandlers={{
        click: (e) => {
          console.log(e.target.options.data); // console log contents of data
        },
      }}
    >
      <Popup>
        <p>{props.message}</p>
      </Popup>
    </LeafletTrackingMarker>
  );
};

export default CarIcon;
