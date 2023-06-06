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
            props.landmark.location.coordinates[1],
            props.landmark.location.coordinates[0],
        ]}
        data={props.landmark.location}
        eventHandlers={{
            click: (e) => {
                console.log(e.target.options.data);
                if(!props.fromLocation){
                    props.setFromLocation(e.target.options.data)
                }else{
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
        <Popup>
            <div>
                <h2>
                    {props.landmark.icon}
                </h2> 
                <p>
                    {props.landmark.location.type}
                </p>
            </div>
        </Popup>
    </Marker>
    );
};

export default LocationIcon;
