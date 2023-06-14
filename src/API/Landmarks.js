import { endpoint } from './Common';

export function getAllLandmarks() {
  return fetch(endpoint + 'allLandmarks')
    .then((response) => response.json())
    .catch((error) => {
      console.log('Fetch error: ', error);
    });
}

export function getAllFireFighters() {
  return fetch(endpoint + 'allFirefighters')
    .then((response) => response.json())
    .catch((error) => {
      console.log('Fetch error: ', error);
    });
}

export function setDestinationActivity(destLat, destLon) {
  return fetch(endpoint + 'setDestinationActivity?'+ new URLSearchParams({
      destinationLat: destLat,
      destinationLon: destLon,
    }))
    .then((response) => response.json())
    .catch((error) => {
      console.log('Fetch error: ', error);
    });
}