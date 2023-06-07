import React, { useEffect, useState } from 'react';
import {
  MapContainer,
  Marker,
  TileLayer,
  Popup,
  Polyline,
  CircleMarker,
} from 'react-leaflet';
import { Icon } from 'leaflet';
import './Home.css';
import ReactLeafletDriftMarker from 'react-leaflet-drift-marker';
import CarIcon from './CarIcon/CarIcon';
import Avatar from '../Images/avatar.jpeg';
import Branding from '../Images/DummyBranding.svg'
import MessagesIcon from '../Images/MessagesIcon.svg'
import SettingsIcon from '../Images/SettingsIcon.svg'
import FromC from '../Images/FromC.svg'
import ToC from '../Images/ToC.svg'
import CloseIcon from '../Images/close.svg'
import CarMenuIcon from '../Images/CarMenuIcon.svg'
import PersonIcon from '../Images/PersonIcon.svg'
import SearchIcon from '../Images/SeachIcon.svg'
import RadarLoader from '../Images/radar.svg'
import { getAllPaths, getShortestPath } from '../API/Paths';
import { getAllLandmarks } from '../API/Landmarks';
import io from 'socket.io-client';
import LocationIcon from './LocationIcon/LocationIcon';
import { getNearestAvailableCar, initiatePickup } from '../API/Cars';

const Home = () => {
	const CarMode = {
		Private: 0,
		Carpool: 1
	}

	const [availableLandmarks, setAvailableLandmarks] = useState(null);

	const [menuState, setMenuSate] = useState('start')

	const [fromLocation, setFromLocation] = useState(null);
	const [toLocation, setToLocation] = useState(null);
	const [commuterCount, setCommuterCount] = useState(0);
	const [carMode, setCarMode] = useState(CarMode.Private)

	const [highlightPath, setHighlightPath] = useState(null);
	const [findingCarInfoText, setFindingCarInfoText] = useState("")

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
				// console.log(data)
				setCars(data)
			})
		}
		
		getAllLandmarks().then((response) => {
			// console.log(response);
			setAvailableLandmarks(response);
		});
	}, [socket])


	const findCar = () => {
		setMenuSate('findingCar')
		setFindingCarInfoText("Computing shortest path...")
		// compute and display the shortest path 
		getShortestPath(fromLocation.coordinates, toLocation.coordinates)
		.then((response) => {
			console.log(response);
			setHighlightPath(response);
			setFindingCarInfoText("Finding nearest car...")
			// get the nearest available car details
			getNearestAvailableCar(fromLocation.coordinates, carMode)
			.then((response) => {
				console.log("nearest car:", response);
				setFindingCarInfoText(`Contacting car ${response.key}...`)
				//initiate the pickup
				initiatePickup(fromLocation.coordinates, response.key)
				.then((response) => {
					console.log("pickup initiated",response)
				});							
				}
			);
		}
		);
	}

	return (
		<div className="homeContainer">
			<div className="topBar">
				<img className='branding' src={Branding} />
				<div className='topBarIcons'>
					<img className="topBarIcon" src={MessagesIcon} />
					<img className="topBarIcon" src={SettingsIcon} />
					<img className="avatar" src={Avatar} />
				</div>
			</div>

			<div className='menu'>
				{
					menuState==='start' &&
					<>
						<div className='fromToContainer'>
							<div className='fromTo'>
								<img className='fromToIcon' src={FromC} />
								<input className='menuInput' type='text' style={{width: "180px"}} value={fromLocation? fromLocation.name : ""} readOnly></input>
								<img className='closeIcon' src={CloseIcon} onClick={() => setFromLocation(null)}/>
							</div>
							<div className="vertical_dotted_line"></div>
							<div className='fromTo'>
								<img className='fromToIcon' src={ToC} />
								<input className='menuInput'type='text' style={{width: "180px"}} value={toLocation? toLocation.name : ""} readOnly></input>
								<img className='closeIcon' src={CloseIcon} onClick={() => setToLocation(null)} />
							</div>
						</div>
						<div className='otherMenuItems'>
							<div className='menuItem'>
								<img src={PersonIcon} className='menuItemIcon' />
								<input className='menuInput' type='number' />
							</div>
							<div className='menuItem'>
								<img src={CarMenuIcon} className='menuItemIcon' />
								<div className='binaryRadio'>
									<input className='leftInput' label="Private" type="radio" id="private" name="rideMode" value="private" defaultChecked />
									<input className='rightInput' label="Carpool" type="radio" id="carpool" name="rideMode" value="carpool" />
								</div>
							</div>
							<button className='findCarButton' onClick={() => findCar()}>
								<img className='searchIcon' src={SearchIcon} />
								<p>Find Car</p>
							</button>
						</div>
					</>
				}
				{
					menuState==='findingCar' &&
					<div>
						<img className='radar' src={RadarLoader} />
						<p style={{textAlign: "center"}}>{findingCarInfoText}</p>
					</div>
				}
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
				//Cutsom white
				url = "https://tile.jawg.io/64cfd245-d159-424f-9d31-05a6b4135f51/{z}/{x}/{y}{r}.png?access-token=gWBPzGuJidPXXTOmROY31sisVp5DytCMjZG4s1tvqJSb9nxrT8SsqmWzn45OOsu8"
				//mapbox
				// url="https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiemF3b2xmIiwiYSI6ImNsaWVyMjZuZjBqbHUzZnFqNXFmYnAwbWMifQ.ffjLLlGHsA4MMnE8_BYv7g"
				// url="https://api.mapbox.com/styles/v1/zawolf/clieu5urg002g01pghny7clln/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiemF3b2xmIiwiYSI6ImNsaWVyMjZuZjBqbHUzZnFqNXFmYnAwbWMifQ.ffjLLlGHsA4MMnE8_BYv7g"
				/>

				{cars &&
					Object.entries(cars).map(([carName, carProps]) => {
						return (<CarIcon 
							position={carProps.slice(0,2).map(loc => +loc)}
							duration={1000}
							key={carName}
							data={{'carName':carName}} 
							message={carName}/>)
					})
				}

				{
					availableLandmarks &&
					availableLandmarks.map((landmark) => (
						<LocationIcon 
							landmark={landmark}
							fromLocation={fromLocation}
							setFromLocation={setFromLocation}
							toLocation={toLocation}
							setToLocation={setToLocation}
							key={landmark.location.name}
							/>
					))
				}

				{
					highlightPath?
						<Polyline
							positions={highlightPath}
							// dashArray={[5, 10]}
							color={'#00a7ff'}
						/>
					:
						<></>
				}
			</MapContainer>
		</div>
	);
};

export default Home;
