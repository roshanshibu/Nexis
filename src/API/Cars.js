import { endpoint } from "./Common";

export function getNearestAvailableCar (startLoc, userMode) {
    return fetch(endpoint + "getNearestAvailableCar?"+ new URLSearchParams({
            userLat: startLoc[0],
            userLon: startLoc[1],
            userMode: userMode,
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