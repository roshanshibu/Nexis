import { endpoint } from './Common';

export function getAllLandmarks() {
  return fetch(endpoint + 'allLandmarks')
    .then((response) => response.json())
    .catch((error) => {
      console.log('Fetch error: ', error);
    });
}