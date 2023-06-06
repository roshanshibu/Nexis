import { endpoint } from "./Common";

export function getAllPaths () {
    return fetch(endpoint + "allPaths")
        .then(response => response.json())
        .catch(error => {
            console.log("Fetch error: ",error);
        });
}

export function getShortestPath (startLoc, endLoc) {
    return fetch(endpoint + "shortestPath?"+ new URLSearchParams({
            latA: startLoc[0],
            lonA: startLoc[1],
            latB: endLoc[0],
            lonB: endLoc[1],
        }))
        .then(response => response.json())
        .catch(error => {
            console.log("Fetch error: ",error);
        });
}
