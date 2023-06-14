import { endpoint } from "./Common";

export function getNearestAvailableCar (startLoc, userMode, personCount) {
    return fetch(endpoint + "getNearestAvailableCar?"+ new URLSearchParams({
            userLat: startLoc[0],
            userLon: startLoc[1],
            userMode: userMode,
            personCount: personCount,
        }))
        .then(response => response.json())
        .catch(error => {
            console.log("Fetch error: ",error);
        });
}

export function initiatePickup (pickupLoc, carKey, userId, personCount, carMode) {
    return fetch(endpoint + "initiatePickup?"+ new URLSearchParams({
            pickupLat: pickupLoc[0],
            pickupLon: pickupLoc[1],
            carKey: carKey,
            userId: userId,
            personCount: personCount,
            carMode: carMode
        }))
        .then(response => response.json())
        .catch(error => {
            console.log("Fetch error: ",error);
        });
}

export function initiateTransit (pickupLoc, destinationLoc, carKey) {
    return fetch(endpoint + "initiateTransit?"+ new URLSearchParams({
            pickupLat: pickupLoc[0],
            pickupLon: pickupLoc[1],
            destinationLat: destinationLoc[0],
            destinationLon: destinationLoc[1],
            carKey: carKey
        }))
        .then(response => response.json())
        .catch(error => {
            console.log("Fetch error: ",error);
        });
}

export function initiateEmergencyPickup (eLocations, eDestination) {
    return fetch(endpoint + "initiateEmergencyPickup?"+ new URLSearchParams({
            eLocations: encodeURIComponent(JSON.stringify(eLocations)),
            eDestination: encodeURIComponent(JSON.stringify(eDestination)),
        }))
        .then(response => response.json())
        .catch(error => {
            console.log("Fetch error: ",error);
        });
}

export function stopRide (carKey) {
    return fetch(endpoint + "stopRide?"+ new URLSearchParams({
            carKey: carKey,
        }))
        .then(response => response.json())
        .catch(error => {
            console.log("Fetch error: ",error);
        });
}