import { endpoint } from "./Common";

export function getAllPaths () {
    return fetch(endpoint + "allPaths")
        .then(response => response.json())
        .catch(error => {
            console.log("Fetch error: ",error);
        });
}