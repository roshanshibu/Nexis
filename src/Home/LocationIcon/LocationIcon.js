import { Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useEffect, useState } from 'react';
import {
    Marker,
    CircleMarker,
  } from 'react-leaflet';


const FireFighterIcon = new Icon({
    iconUrl: require(`../../Images/markers/firefighter_marker.png`),
    iconSize: [35, 30],
});


const LocationIcon = (props) => {
    let c_landmark = props.landmark
    let firefightersList = []
    let type = "landmark"
    if (props.isFireStation){
        firefightersList = props.fireFighters
        firefightersList.map((firefighter) => {
            if (firefighter.icon == c_landmark.icon){
                type = "firefighter"
            }
        })
    }

    return (
    <Marker
        key={props.landmark.icon}
        position={[
            props.landmark.location.coordinates[0],
            props.landmark.location.coordinates[1],
        ]}
        icon = {type == "firefighter" ? FireFighterIcon
                    :
                    new Icon({
                        iconUrl: require(`../../Images/markers/${props.landmark.icon}.png`),
                        iconSize: [50, 50],
                        shadowUrl: require('../../Images/markers/marker-shadow.png'),
                        shadowSize: [50, 50]
                    })}
        data={props.landmark.location}
        eventHandlers={
            type == "firefighter" ?
            null:
            {
            click: (e) => {
                console.log(props.landmark)
                if(props.isFireStation){
                    props.setFromLocation(null)
                    props.setToLocation(e.target.options.data)
                }
                else{
                    if(!props.fromLocation){
                        if (JSON.stringify(props.toLocation) !== JSON.stringify(e.target.options.data))
                            props.setFromLocation(e.target.options.data)
                    }else{
                        if (JSON.stringify(props.fromLocation) !== JSON.stringify(e.target.options.data))
                            props.setToLocation(e.target.options.data)
                    }
                }
            },
        }}
    >
        {/* <Popup>
            <p>Hello there</p>
        </Popup> */}
    </Marker>
    );
};

export default LocationIcon;
