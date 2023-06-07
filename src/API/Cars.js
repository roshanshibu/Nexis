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