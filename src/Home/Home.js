import React, { useEffect, useState } from 'react';
import {
  MapContainer,
  Marker,
  TileLayer,
  Popup,
  Polyline,
} from 'react-leaflet';
import { Icon } from 'leaflet';
import './Home.css';
import ReactLeafletDriftMarker from 'react-leaflet-drift-marker';
import CarIcon from './CarIcon/CarIcon';
import Avatar from '../Images/avatar.jpeg';
import { getAllPaths } from '../API/Paths';

import io from 'socket.io-client';

const srhMarkerIcon = new Icon({
  iconUrl: require('../Images/SRH_Icon.png'),
  iconSize: [45, 38],
});

const Home = () => {

  const [showAvailablePaths, setShowAvailablePaths] = useState(true);
  const [availablePaths, setAvailablePaths] = useState(null);

  const [socket, setSocket] = useState(null)
  const [cars, setCars] = useState(null)

	useEffect(() => {
		if(socket === null)
		{
			setSocket(io("ws://localhost:8765"))
		}
		if(socket)
		{
			socket.on('connect', () => {
				console.log("Connected")
			})

			socket.on('location', (data) => {
				console.log(data)
				setCars(data)
			})
		}
		
		getAllPaths().then(response => {
			console.log(response)
			if (showAvailablePaths){
				setAvailablePaths(response);
			}
		});
	}, [socket])
    return (
		<div className="homeContainer">
			<div className="userDetailsRow">
				<div style={{display: "flex", flexDirection: "column"}}>
					<p className="f fSmall fLight">Good Morning</p>
					<p className="f fMedium fLight">Harold</p>
				</div>
				<img className="avatar" src={Avatar} />
			</div>
			<div className="topRow">
				<p>Top Row</p>
			</div>
			<MapContainer center={[49.4043, 8.6758]} zoom={14}>
				<TileLayer
				attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
				//white clean
				// url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
				// url = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
				// url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
				// url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
				// url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
				// url="https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png"
				//Cutsom dark blue
				// url = "https://tile.jawg.io/d21f157e-c94e-45e9-afe3-8e7b539bacad/{z}/{x}/{y}{r}.png?access-token=gWBPzGuJidPXXTOmROY31sisVp5DytCMjZG4s1tvqJSb9nxrT8SsqmWzn45OOsu8"
				//Custom - modified default dark
				// url ="https://tile.jawg.io/12b8cba4-7e48-46c9-b661-ce1fca768e74/{z}/{x}/{y}{r}.png?access-token=gWBPzGuJidPXXTOmROY31sisVp5DytCMjZG4s1tvqJSb9nxrT8SsqmWzn45OOsu8"
				// url = "https://{s}.api.tomtom.com/map/1/tile/basic/main/{z}/{x}/{y}.png?key=GLgOsquuX16nBmjiE7HEGkrGcJPXt8eB"
				//mapbox
				// url="https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiemF3b2xmIiwiYSI6ImNsaWVyMjZuZjBqbHUzZnFqNXFmYnAwbWMifQ.ffjLLlGHsA4MMnE8_BYv7g"
				url="https://api.mapbox.com/styles/v1/zawolf/clieu5urg002g01pghny7clln/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiemF3b2xmIiwiYSI6ImNsaWVyMjZuZjBqbHUzZnFqNXFmYnAwbWMifQ.ffjLLlGHsA4MMnE8_BYv7g"
				/>
				<Marker
					position={[49.4139, 8.6511]}
					icon={srhMarkerIcon}
					data={{key: "value"}}
					eventHandlers={{
					click: (e) => {
						console.log(e.target.options.data);  // console log contents of data
					},
					}}>
						<Popup><p>I go here!</p></Popup>
				</Marker>
				{cars &&
					Object.entries(cars).map(([carName, carProps]) => {
						return (<CarIcon 
							position={carProps.slice(0,2).map(loc => +loc)}
							duration={1000}
							data={{hi:"there"}} 
							message={carName}/>)
					})
				}

        {showAvailablePaths &&
          availablePaths &&
          availablePaths.map((path) => {
            return (
              <Polyline
                positions={path}
                color={'#00a3ff66'}
                key={path[0][0] + path[path.length - 1][0]}
              />
            );
          })}
      </MapContainer>
    </div>
  );
};

export default Home;
