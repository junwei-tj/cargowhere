//import { createIconSetFromFontello } from '@expo/vector-icons';
import axios from 'axios';

/**
 * @module DataManager
 * */
/**
 * Retrieves carpark data based on various querying options
 * Callback is required as querying is asynchronous
 * all callback functions should accept a single parameter,
 * which will contain an array of objects
 * @ignore
 **/

const carparkData = {
  // static data to be stored in memory
  _carparksData: [],
  _availabilityData: {},
  /**
   *
   * Retrieves carpark data from backend
   * Intended to be used once on app startup
   * @name updateCarparkStaticData
   * @function
   * @param {callback} callback Should accept a single result parameter, which contains an array of objects
   * @returns {null}
   */

  updateCarparkStaticData: function (callback = () => {}) {
    axios
      .get('http://demonicmushy.com:7020/carparks', {
        auth: {username: 'cargowhere', password: 'cargowhere'},
      })
      .then((response) => {
        const carparks = response.data.carparks;
        this._carparksData = carparks;
        console.log('Static carpark data retrieved and stored.');
        callback(carparks);
      })
      .catch((err) => {
        console.log('Error occured at retrieving static carpark data:', err);
      });
  },
  /**
   * Retrieves carpark data within P1[x1,y1] to P2[x2,y2],
   * P1 should be the bottom left corner, P2 top right
   * @name retrieveInCoords
   * @function
   * @param {Number} x1 - bottom left x coordinate
   * @param {Number} y1 - bottom left y coordinate
   * @param {Number} x2 - top right x coordinate
   * @param {Number} y2 - top right y coordinate
   * @returns {Array} array of carpark objects
   */
  retrieveInCoords: function (x1, y1, x2, y2) {
    const resultArray = [];
    this._carparksData.forEach((cp) => {
      if (
        cp.coordinates.y >= y1 &&
        cp.coordinates.y <= y2 &&
        cp.coordinates.x >= x1 &&
        cp.coordinates.x <= x2
      ) {
        resultArray.push(cp);
      }
    });
    return resultArray;
  },

  /**
   * Retrieves carpark data within P1[long1,lat1] to P2[long2,lat2],
   * P1 should be the bottom left corner, P2 top right
   * @name retrieveInLongLat
   * @function
   * @param {Number} long1 - bottom left longitude
   * @param {Number} lat1 - bottom left latitude
   * @param {Number} long2 - top right longitude
   * @param {Number} lat2 - top right latitude
   * @returns {Array} array of carpark objects
   */
  retrieveInLongLat: function (long1, lat1, long2, lat2) {
    const resultArray = [];
    this._carparksData.forEach((cp) => {
      if (
        cp.latitude >= lat1 &&
        cp.latitude <= lat2 &&
        cp.longitude >= long1 &&
        cp.longitude <= long2
      ) {
        resultArray.push(cp);
      }
    });
    if (resultArray.length === 0) {
    }
    return resultArray;
  },

  /**
   * Retrieve carparks based on carpark name
   * Does exact string matching, may still return multiple objects since there are
   * duplicates of data with the same name but different lot type
   * @name retrieveByName
   * @function
   * @param {String} name The name to retrieve on
   * @param {callback} callback Should accept a single result parameter, which contains an array of objects
   * @returns {null}
   */
  retrieveByName: function (name, callback) {
    const resultArray = [];
    this._carparksData.forEach((cp) => {
      if (cp.identifier === name) {
        resultArray.push(cp);
      }
    });
    callback(resultArray);
  },

  /**
   * Retrieve availability data for all carparks
   * @name updateAvailabilityData
   * @function
   * @returns {Promise} Promise object that resolves with the availability data
   */
  updateAvailabilityData: function () {
    return new Promise((resolve, reject) => {
      axios
        .get('http://demonicmushy.com:7020/availability', {
          auth: {username: 'cargowhere', password: 'cargowhere'},
        })
        .then((response) => {
          const availabilityData = response.data.data;
          console.log('Availability data retrieved.');
          this._availabilityData = availabilityData;
          resolve(availabilityData);
        })
        .catch((err) => {
          console.log('Error occured at retrieving availability data:', err);
        });
    });
  },
};

export default carparkData;
