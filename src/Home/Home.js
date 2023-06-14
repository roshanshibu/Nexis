import React, { useContext, useEffect, useState } from 'react';
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
import NumericInput from 'react-numeric-input';
import CarIcon from './CarIcon/CarIcon';
import Branding from '../Images/DummyBranding.svg'
import MessagesIcon from '../Images/MessagesIcon.svg'
import SettingsIcon from '../Images/SettingsIcon.svg'
import FromC from '../Images/FromC.svg'
import ToC from '../Images/ToC.svg'
import CloseIcon from '../Images/close.svg'
import CarMenuIcon from '../Images/CarMenuIcon.svg'
import PersonIcon from '../Images/PersonIcon.svg'
import SearchIcon from '../Images/SeachIcon.png'
import RadarLoader from '../Images/radar.svg'
import smCarDetailsImg from '../Images/smCarDetailsImg.png'
import sdIndicatorSmall from '../Images/sdIndicatorSmall.svg'
import smWaitingCar from '../Images/smWaitingCar.png'
import smTransit from '../Images/smTransit.svg'
import smLeavingImg from '../Images/smLeavingImg.png'
import smOtherPickup from '../Images/smOtherPickup.png'
import HFireDeptBanner from '../Images/HFireDeptBanner.svg'
import WarningIcon from '../Images/warningIcon.png'
import HelpIsOnTheWay from '../Images/HelpIsOnTheWay.svg'
import { getAllPaths, getShortestPath } from '../API/Paths';
import { getAllFireFighters, getAllLandmarks } from '../API/Landmarks';
import io from 'socket.io-client';
import LocationIcon from './LocationIcon/LocationIcon';
import { getNearestAvailableCar, initiateEmergencyPickup, initiatePickup, initiateTransit } from '../API/Cars';
import { UserContext } from '../App';

const Home = () => {
	const CarMode = {
		NORMAL: 1,
		CARPOOL: 2
	}

	const [showAvailablePaths, setShowAvailablePaths] = useState(false);
	const [availablePaths, setAvailablePaths] = useState(null);
	const [availableLandmarks, setAvailableLandmarks] = useState(null);
	const [fireFighters, setFireFighters] = useState(null);

	const [menuState, setMenuSate] = useState('IDLE')
	let blockMenuStateUpdate =false
	

	const [fromLocation, setFromLocation] = useState(null);
	const [toLocation, setToLocation] = useState(null);
	const [commuterCount, setCommuterCount] = useState(1);
	const [carMode, setCarMode] = useState(CarMode.NORMAL)
	const [currentCarKey, setCurrentCarKey] = useState(null);
	const [currentCarETA, setCurrentCarETA] = useState(0);
	const [currentCarState, setCurrentCarState] = useState("");

	const [highlightPath, setHighlightPath] = useState(null);
	const [routeSpots, setRouteSpots] = useState([]);

	const [subMenuText, setSubMenuText] = useState("")

	const [socket, setSocket] = useState(null)
	const [cars, setCars] = useState(null)

	let EmergencyCarKey = "Red"
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
				if(currentCarKey && data[currentCarKey][4]){
					setCurrentCarETA(data[currentCarKey][4])
				}
				if(currentCarKey && data[currentCarKey][2]){
					setCurrentCarState(data[currentCarKey][2])
				}
				if(currentCarKey && data[currentCarKey][2]){
					if (menuState === 'PICKUP' && data[currentCarKey][2] == 'WAITING' && !blockMenuStateUpdate){
						console.log ("user array",data[currentCarKey][3])
						console.log("is carpool?", carMode == CarMode.CARPOOL)
						console.log("is userid NOT in users list", !data[currentCarKey][3].includes('' + userContext.currentUserId))
						if(carMode == CarMode.CARPOOL && !data[currentCarKey][3].includes('' + userContext.currentUserId))
							setMenuSate("OTHER_PICKUP")
						else{
							setMenuSate(data[currentCarKey][2])
							blockMenuStateUpdate = true
						}
					}
					if (menuState === 'OTHER_PICKUP' && data[currentCarKey][2] == 'PICKUP' && data[currentCarKey][3].includes('' + userContext.currentUserId)){
						setMenuSate(data[currentCarKey][2])
					}
					if (menuState === 'TRANSIT' && data[currentCarKey][2] == 'LEAVING' && !blockMenuStateUpdate){
						setMenuSate(data[currentCarKey][2])
						blockMenuStateUpdate = true
						setHighlightPath(null)
						setFromLocation(null)
						setToLocation(null)
					}
				}
				if(data[EmergencyCarKey] && userContext.currentUserId == 3){
					if(data[EmergencyCarKey][2] == 'IDLE')
						setMenuSate('IDLE')
					else
						setMenuSate('EMERGENCY_PICKUP')
				}
			})
		}
		
		getAllLandmarks().then((response) => {
			// console.log(response);
			setAvailableLandmarks(response);
		});

		getAllFireFighters().then((response) => {
			// console.log(response);
			setFireFighters(response);
		});

		if(showAvailablePaths){
			getAllPaths().then(response => {
				console.log(response)
				if (showAvailablePaths){
					setAvailablePaths(response);
				}
			});
		}
	}, [socket, menuState, currentCarKey])

	const userContext = useContext(UserContext);

	const findCar = () => {
		if (!fromLocation || !toLocation){
			alert("Enter the source and destination")
			return
		}
		setMenuSate('PICKUP')
		setSubMenuText("Computing shortest path...")
		// compute and display the shortest path 
		getShortestPath(fromLocation.coordinates, toLocation.coordinates)
		.then((response) => {
			console.log(response);
			setHighlightPath(response);
			setSubMenuText("Finding nearest car...")
			// get the nearest available car details
			let carModeName = carMode==CarMode.NORMAL? 'NORMAL' : 'CARPOOL'
			getNearestAvailableCar(fromLocation.coordinates, carModeName, commuterCount)
			.then((response) => {
				console.log("nearest car:", response);
				setCurrentCarKey(response.key)
				setSubMenuText(`$CAR${response.key}`)
				//initiate the pickup
				initiatePickup(fromLocation.coordinates, response.key, userContext.currentUserId, commuterCount, carMode)
				.then((response) => {
					console.log("pickup initiated",response)
				});							
				}
			);
		}
		);
	}

	const startRide = () => {
		setMenuSate('TRANSIT')
		initiateTransit(fromLocation.coordinates, toLocation.coordinates, currentCarKey)
		.then((response) => {
			blockMenuStateUpdate = false
			setRouteSpots(response)
		})
	}

	const pickupFireFighters = () => {
		if (!toLocation){
			alert("Enter the destination")
			return
		}
		let fArray = fireFighters.map((f) => {
							return f.location.coordinates
						})
		initiateEmergencyPickup(fArray, toLocation.coordinates)
		.then((response) => {
			console.log(response)
		})
		setMenuSate("EMERGENCY_PICKUP")
	}

	const openHomeMenu = () => {
		setRouteSpots([])
		setMenuSate('IDLE')
	}

	return (
		<div className="homeContainer">
			<div className="topBar">
				<img className='branding' src={Branding} />
				<div className='topBarIcons'>
					<img className="topBarIcon" src={MessagesIcon} />
					<img className="topBarIcon" src={SettingsIcon} />
					<img className="avatar" src={require(`./Avatar/avatar${userContext.currentUserId}.jpg`)}
						onClick={() => {
							if (userContext.currentUserId == 3)
								userContext.setCurrentUserId(1)
							else
								userContext.setCurrentUserId(userContext.currentUserId + 1)
						}} />
				</div>
			</div>

			<div className='menu'>
				{
					menuState==='IDLE' &&
					<>
						{
							//fire station banner
							userContext.currentUserId == 3 &&
							<img src={HFireDeptBanner} className='fireStationBanner'/> 
						}
						<div className={userContext.currentUserId == 3 ? 'fromToContainer fireMenuBg' : 'fromToContainer'}>
							{
							// from is not needed if the user is the fire station
							userContext.currentUserId != 3 ? 
							<>
								<div className='fromTo'>
									<img className='fromToIcon' src={FromC} />
									<input className='menuInput' type='text' style={{width: "180px"}} value={fromLocation? fromLocation.name : ""} readOnly></input>
									<img className='closeIcon' src={CloseIcon} onClick={() => setFromLocation(null)}/>
								</div>
								<div className="vertical_dotted_line"></div>
							</>
							:
							<></>
							}
							<div className='fromTo'>
								<img className='fromToIcon' src={ToC} />
								<input className='menuInput'type='text' style={{width: "180px"}} value={toLocation? toLocation.name : ""} readOnly></input>
								<img className='closeIcon' src={CloseIcon} onClick={() => setToLocation(null)} />
							</div>
						</div>
						<div className='otherMenuItems'>
							{
								// car mode and commuter count not needed in fire station
								userContext.currentUserId != 3 &&	
								<>
								<div className='menuItem'>
									<img src={PersonIcon} className='menuItemIcon' />
									<NumericInput className='personCountInput' min={1} max={100} defaultValue={1} 
										format={(num) => {return num + (num==1?' person':' persons')}}
										onChange={(newVal)=>{setCommuterCount(newVal)}}/>
								</div>
								<div className='menuItem'>
									<img src={CarMenuIcon} className='menuItemIcon' />
									<div className='binaryRadio'>
										<input className='leftInput' label="Private" type="radio" 
											id="private" name="rideMode" value="1" defaultChecked
											onChange={(e)=> {setCarMode(CarMode.NORMAL)}} />
										<input className='rightInput' label="Carpool" type="radio" 
											id="carpool" name="rideMode" value="2"
											onChange={(e)=> {setCarMode(CarMode.CARPOOL)}} />
									</div>
								</div>
								</>
							}
							<button className={userContext.currentUserId == 3 ? 'findCarButton fireButton' : 'findCarButton'}
									onClick={() => {
											 userContext.currentUserId != 3 ?
											 	findCar()
											:
												pickupFireFighters()
											}}>
								<img className='searchIcon' src={userContext.currentUserId == 3 ? WarningIcon : SearchIcon} />
								<p>{userContext.currentUserId == 3 ? "Send Car" : "Find Car"}</p>
							</button>
						</div>
					</>
				}
				{
					menuState==='PICKUP' &&
					<>
					{
						!subMenuText.startsWith("$CAR") ?	
						<div>
							<img className='radar' src={RadarLoader} />
							<p style={{textAlign: "center"}}>{subMenuText}</p>
						</div>
						:
						<div className='smCarDetailsParent'>
							<div className='smCarDetails'>
								<div className='smCarDetailsText'>
									<p style={{fontSize: "15px"}}>Your Ride</p>
									<p style={{fontSize: "45px", fontWeight: 700}}>{subMenuText.slice(4)}</p>
									<p style={{fontSize: "30px"}}>L31M3N</p>
								</div>
								<img src={smCarDetailsImg} className='smCarDetailsImg'/>
							</div>
							<div className='smSourceDest'>
								<img src={sdIndicatorSmall} className='sdIndicatorSmall'/>
								<div className='smSourceDestText'>
									<p>{fromLocation.name} 
											{carMode==CarMode.NORMAL && currentCarETA > 0?
												<span className='smSourceDestETA'>
													{currentCarETA == 1 ?
														"Now"
														: 
														currentCarETA + " seconds"}
												</span>
												: 
												""}
									</p>
									<p>{toLocation.name}</p>
								</div>
							</div>
						</div>
					}
					</>
				}
				{
					menuState==='OTHER_PICKUP' &&
					<div className='smOtherPickup'>
						<p style={{fontSize: "27px", lineHeight: 1.1, fontWeight:600, 
								paddingLeft: "30px", paddingTop: "25px"}}>
									Your car is picking up <br />another commuter.
						</p>
						<img src={smOtherPickup} className='smOtherPickupImg'/>
					</div>
				}
				{
					menuState==='WAITING' &&
					<div className='smWaiting'>
						<p style={{fontSize: "30px", lineHeight: 1, margin: 0, paddingLeft: "30px", paddingTop: "53px"}}>Your car <br /> is waiting</p>
						<img src={smWaitingCar} className='smWaitingCar' />
						<button onClick={() => startRide()} className='smWaitingButton'>Start Ride</button>
					</div>
				}
				{
					menuState==='TRANSIT' &&
					<div className='smTransit'>
						<div className='smTransitText'>
							<p style={{fontSize: "15px"}}>
									{currentCarState=="TRANSIT"? 
										"Arriving at"
									:
										"Your destination"}
							</p>
							<p style={{fontSize: "28px", fontWeight: 700}}>{toLocation.name.length >12 ? toLocation.name.slice(0,10)+"..." : toLocation.name}</p>
							<p className={currentCarETA > 0 ? "fadeInETA" : "hideETA"}>
								<span style={{fontWeight: 700}}>
								{currentCarState=="TRANSIT"?
									currentCarETA == 1 ?
										"Now"
										: 
										"in " + currentCarETA + " seconds"
									:
									""
								}
								</span>
							</p>
							<button className='smTransitEndRideButton'>End Ride</button>
						</div>
						<img src={smTransit} className='smTransitImg' />

					</div>
				}
				{
					menuState==='LEAVING' &&
					<div className='smTransit smLeaving'>
						<div className='smTransitText'>
							<p style={{fontSize: "27px", lineHeight: 1.1, fontWeight:600}}>You have <br/>arrived</p>
							<button className='smLeavingButton' onClick={() => {openHomeMenu()}}>Exit Car</button>
						</div>
						<img src={smLeavingImg} className='smLeavingImg' />
					</div>

				}
				{
					menuState==='EMERGENCY_PICKUP' &&
					<div className='smEmergency'>
						<img src={HFireDeptBanner} className='fireStationBanner'/>
						<img src={HelpIsOnTheWay} className='helpIsOnTheWay' />
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



				{
					availableLandmarks &&
					fireFighters &&
					(availableLandmarks).map((landmark) => (
						<LocationIcon 
							landmark={landmark}
							fromLocation={fromLocation}
							setFromLocation={setFromLocation}
							toLocation={toLocation}
							setToLocation={setToLocation}
							key={landmark.location.name}
							isFireStation={userContext.currentUserId == 3}
							fireFighters={fireFighters}
							/>
					))
				}

				{cars &&
					Object.entries(cars).map(([carName, carProps]) => {
						return (<CarIcon 
							position={carProps.slice(0,2).map(loc => +loc)}
							duration={1000}
							key={carName}
							data={{'carName':carName, 'state':carProps[2]}} 
							message={carName}/>)
					})
				}

				{
					// show all available paths
					// ONLY FOR TEST & DEBUG
					// remove in production
					showAvailablePaths &&
					availablePaths &&
					availablePaths.map((path) => {
						return (<Polyline positions={path} color={'#00ff6d47'} key={path[0][0]+path[path.length-1][0]} />)
					})
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

				{
					//interesting spots on the transit route
					//show only in NORMAL mode
					routeSpots &&
					carMode==CarMode.NORMAL &&
					routeSpots.map((landmark) => (
							<Marker 
							key={landmark.name}
							position={[landmark.lat, landmark.lon]}
							>
								<Popup>
									<h3>{landmark.name}</h3>
									<p style={{textTransform: "capitalize"}}>{landmark.type}</p>
								</Popup>	
							</Marker>
					))
				}
			</MapContainer>
		</div>
	);
};

export default Home;
