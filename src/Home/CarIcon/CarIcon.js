import ReactLeafletDriftMarker from "react-leaflet-drift-marker"
import { Popup } from "react-leaflet";
import { Icon } from "leaflet";

const carMarkerIcon = new Icon({
    iconUrl: require("../../Images/car_top_view.png"),
    iconSize: [30, 18]
})

const CarIcon = (props) => {
    return (
        <ReactLeafletDriftMarker 
            position={props.position}
            duration={props.duration} 
            icon={carMarkerIcon}
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
