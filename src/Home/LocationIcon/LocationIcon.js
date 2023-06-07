import { Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useEffect, useState } from 'react';
import {
    Marker,
    CircleMarker,
  } from 'react-leaflet';

const LocationIcon = (props) => {
    return (
    <Marker
        key={props.landmark.icon}
        position={[
            props.landmark.location.coordinates[0],
            props.landmark.location.coordinates[1],
        ]}
        // icon={new Icon({
        //     iconUrl: require(`../../Images/markers/${props.landmark.icon}.png`),
        //     iconSize: [35, 30],
        //   })}
        data={props.landmark.location}
        eventHandlers={{
            click: (e) => {
                console.log(props.landmark)
                if(!props.fromLocation){
                    if (JSON.stringify(props.toLocation) !== JSON.stringify(e.target.options.data))
                        props.setFromLocation(e.target.options.data)
                }else{
                    if (JSON.stringify(props.fromLocation) !== JSON.stringify(e.target.options.data))
                        props.setToLocation(e.target.options.data)
                }
            },
        }}
    >
        {/* <CircleMarker
            center={[
                props.landmark.location.coordinates[1],
                props.landmark.location.coordinates[0],
            ]}
            radius={5}
            color="blue"
            fillColor="blue"
            fillOpacity={1}
        /> */}
        {/* <Popup>
            <div>
                <h2>
                    {props.landmark.location.name}
                </h2> 
                <p>
                    {props.landmark.location.type}
                </p>
            </div>
        </Popup> */}
    </Marker>
    );
};

export default LocationIcon;
