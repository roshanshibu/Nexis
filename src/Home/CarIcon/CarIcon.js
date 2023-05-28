import ReactLeafletDriftMarker from "react-leaflet-drift-marker"
import { Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "./CarIcon.css"

const carMarkerWest = new Icon({
    iconUrl: require("../../Images/car_west.png"),
    iconSize: [30, 18]
})
const carMarkerEast = new Icon({
    iconUrl: require("../../Images/car_east.png"),
    iconSize: [30, 18]
})
const carMarkerNorthWest = new Icon({
    iconUrl: require("../../Images/car_north_west.png"),
    iconSize: [35, 32]
})

const getCarMarker = (direction) => {
    if (direction === "east")
        return carMarkerEast
    if (direction === "west")
        return carMarkerWest
    if (direction === "northwest")
        return carMarkerNorthWest
}

const CarIcon = (props) => {
    return (
        <ReactLeafletDriftMarker
            position={props.position}
            duration={props.duration} 
            icon={getCarMarker(props.direction)}
            data={props.data}
            eventHandlers={{
            click: (e) => {
                console.log(e.target.options.data);  // console log contents of data
            },
            }}>
            <Popup><p>{props.message}</p></Popup>
      </ReactLeafletDriftMarker>);
}

export default CarIcon;
