import { endpoint } from './Common';

export function getAllLandmarks() {
  return fetch(endpoint + 'allLandmarks')
    .then((response) => response.json())
    .catch((error) => {
      console.log('Fetch error: ', error);
    });
}

export function popularLocation(destinationLoc) {
  return fetch(endpoint + 'allPopularLocations' ({
            destinationLat: destinationLoc[0],
            destinationLon: destinationLoc[1],
  }))
  .then((response) => response.json())
  .catch((error) => {
    console.log('Fetch error: ', error);
  });
}