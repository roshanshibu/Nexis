import React, { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, Popup, Polyline } from "react-leaflet";
import { Icon } from "leaflet";
import "./Home.css";
import ReactLeafletDriftMarker from "react-leaflet-drift-marker"
import CarIcon from "./CarIcon/CarIcon";
import Avatar from "../Images/avatar.jpeg"
import { getAllPaths } from "../API/Paths";

const srhMarkerIcon = new Icon({
    iconUrl: require("../Images/SRH_Icon.png"),
    iconSize: [45, 38]
  })


const Home = () => {
	const [car1Position, setCar1Position] = useState([49.409684, 8.660309]);
	const [car1Direction, setCar1Direction] = useState("east");
	
	const [car2Position, setCar2Position] = useState([49.404036, 8.677261]);
	const [car2Direction, setCar2Direction] = useState("west");

	const [showAvailablePaths, setShowAvailablePaths] = useState(true);
	const [availablePaths, setAvailablePaths] = useState(null);

	useEffect(() => {
		getAllPaths().then(response => {
			console.log(response)
			if (showAvailablePaths){
				setAvailablePaths(response);
			}
		});
	}, [])
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
				url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
				// url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
				// url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
				// url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
				// url="https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png"
				
				/>
				<Marker
					position={[49.4139, 8.6511]}
					icon={srhMarkerIcon}
					data={{key: "value"}}
					eventHandlers={{
					click: (e) => {
						console.log(e.target.options.data);  // console log contents of data
						setCar1Position([49.410270, 8.657739])
						setCar1Direction("northwest")
						setCar2Position([49.402713, 8.678520])
					},
					}}>
						<Popup><p>I go here!</p></Popup>
				</Marker>
				<CarIcon 
					position={car1Position} 
					duration={1000}
					direction={car1Direction} 
					data={{hi:"there"}} 
					message={"box to overtake"}/>
				
				
				<CarIcon 
					position={car2Position} 
					duration={1000}
					direction={car2Direction} 
					data={{hi:"there"}} 
					message={"box to overtake"}/>

				{
					showAvailablePaths &&
					availablePaths &&
					availablePaths.map((path) => {
						return (<Polyline positions={path} color={'#00a3ff66'} key={path[0][0]+path[path.length-1][0]} />)
					})
				}	
			</MapContainer>
		</div>
	);
}

export default Home;