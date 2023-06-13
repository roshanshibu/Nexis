import { endpoint } from './Common';

export function getAllFirefighters() {
  return fetch(endpoint + 'allFirefighters')
    .then((response) => response.json())
    .catch((error) => {
      console.log('Fetch error: ', error);
    });
}