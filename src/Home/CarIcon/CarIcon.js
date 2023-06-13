import {LeafletTrackingMarker} from 'react-leaflet-tracking-marker'
import { Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import './CarIcon.css';
import { useEffect, useState } from 'react';

const carMarker = new Icon({
  iconUrl: require('../../Images/car_east.png'),
  iconSize: [35, 23],
});

const VanOnMarker = new Icon({
  iconUrl: require('../../Images/wvan_on.gif'),
  iconSize: [45, 23],
});
const VanOffMarker = new Icon({
  iconUrl: require('../../Images/wvan_off.png'),
  iconSize: [45, 23],
});



const CarIcon = (props) => {
  const [lat, lon] = props.position
  const [prevPos, setPrevPos] = useState([lat, lon])
  
  useEffect(() => {
    if (prevPos[1] !== lon && prevPos[0] !== lat) setPrevPos([lat, lon]);
  }, [lat, lon, prevPos]);
  
  // console.log(props.data.carName == 'Red');
  return (
    <LeafletTrackingMarker 
      position={[lat, lon]}
      previousPosition={prevPos}
      duration={props.duration}
      icon={props.data.carName == 'Red' ? 
              props.data.state == 'IDLE'?
                VanOffMarker
                :
                VanOnMarker
            :
              carMarker}
      data={props.data}
      eventHandlers={{
        click: (e) => {
          console.log(e.target.options.data); // console log contents of data
        },
      }}
    >
      {/* <Popup>
        <p>{props.message}</p>
      </Popup> */}
    </LeafletTrackingMarker>
  );
};

export default CarIcon;
