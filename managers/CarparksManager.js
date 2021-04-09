import { SORT_BY_AVAILABILITY } from '../constants/sortCriteriaConstants';
import {getDistanceFromLatLonInM} from '../components/Carpark';
import carparkData from './DataManager';

/**
 * @module CarparksManager
 * */

/**
 * Manager class for handling the retrieving and filtering of carparks for displaying.
 */


/**
 * Function to retrieve carparks within the viewable map region.
 * @param {region} region the current region data of the map
 */
function getCarparks(region) {
  let bottomLeftLat = region.latitude - region.latitudeDelta / 2;
  let bottomLeftLongitude = region.longitude - region.longitudeDelta / 2;
  let topRightLat = region.latitude + region.latitudeDelta / 2;
  let topRightLongitude = region.longitude + region.longitudeDelta / 2;

  return carparkData.retrieveInLongLat(
    bottomLeftLongitude,
    bottomLeftLat,
    topRightLongitude,
    topRightLat,
  );
}

/**
 * Function to filter the retrieved carparks to only include the desired fields.
 * Current fields kept are: latitude and longitude (combined to latlng), title, availableLots_car
 * @param {Array} carparkList
 * @param {region} pointOfReference coordinates (in latitude and longitude) of the point distance is to be calculated from
 */
function filterCarparksJSON(carparkList, pointOfReference) {
  let carparkObjs = [];
  if (pointOfReference === undefined) {
    throw 'Unable to sort by distance when pointOfReference is not provided';
  }
  carparkList.forEach((obj) => {
    if (!carparkObjs.some((item) => item.title == obj.name)) {
      // filter out duplicates
      let carpark = {
        identifier: obj.identifier,
        latlng: {
          latitude: obj.latitude,
          longitude: obj.longitude,
        },
        title: obj.name,
        availableLots_car: obj.availableLots_car,
        distance: getDistanceFromLatLonInM(
          pointOfReference.latitude,
          pointOfReference.longitude,
          obj.latitude,
          obj.longitude,
        ),
      };
      carparkObjs.push(carpark);
    }
  });

  return carparkObjs;
}

/**
 * Function to handle sorting of carparks. Sorting can only be done based on distance and availability
 * @param {Array} carparks
 * @param {Array} availability
 * @param {string} sortCriteria accepts constants from ./constants/sortCriteriaConstants
 */
function sortCarparks(carparks, availability, sortCriteria) {
  switch (sortCriteria) {
    case SORT_BY_AVAILABILITY:
      // sort by availability
      carparks.sort((a, b) => {
        if (availability[b.identifier] && availability[a.identifier]) {
          return (
            availability[b.identifier].availableLots_car -
            availability[a.identifier].availableLots_car
          );
        } else if (availability[b.identifier]) {
          return true;
        } else {
          return false;
        }
      });
      break;
    default:
      // sort carparks by distance, in ascending order
      carparks.sort((a, b) => {
        return a.distance - b.distance;
      });
  }
  return carparks;
}

export { getCarparks, filterCarparksJSON, sortCarparks };