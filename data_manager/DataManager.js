import axios from 'axios';

/**
 * Retrieves carpark data based on various querying options
 * Callback is required as querying is asynchronous
 * all callback functions should accept a single parameter,
 * which will contain an array of objects
 **/
const carparkData = {
  // static data to be stored in memory
  _carparksData: [],
  _availabilityData: {},
  /**
   * Retrieves carpark data from backend
   * Intended to be used once on app startup
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
        //console.log("this._carparksData = " + this._carparksData);
        callback(carparks);
      })
      .catch((err) => {
        console.log('Error occured at retrieving static carpark data:', err);
      });
  },
  /**
   * Retrieves carpark data within P1[x1,y1] to P2[x2,y2],
   * P1 should be the bottom left corner, P2 top right
   * @param x1
   * @param y1
   * @param x2
   * @param y2
   * @param callback Should accept a single result parameter, which contains an array of objects
   */
  retrieveInCoords: function (x1, y1, x2, y2, callback) {
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
    callback(resultArray);
  },

  /**
   * Retrieves carpark data within P1[long1,lat1] to P2[long2,lat2],
   * P1 should be the bottom left corner, P2 top right
   * @param long1
   * @param lat1
   * @param long2
   * @param lat2
   * @param callback Should accept a single result parameter, which contains an array of objects
   */
  retrieveInLongLat: function (long1, lat1, long2, lat2, callback) {
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
    callback(resultArray);
  },

  /**
   * Retrieve carparks based on carpark name
   * Does exact string matching, may still return multiple objects since there are
   * duplicates of data with the same name but different lot type
   * @param name
   * @param callback Should accept a single result parameter, which contains an array of objects
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
   * @param callback Not sure yet
   */
  updateAvailabilityData: function (callback = () => {}) {
    axios
      .get('http://demonicmushy.com:7020/availability', {
        auth: {username: 'cargowhere', password: 'cargowhere'},
      })
      .then((response) => {
        const availabilityData = response.data.data;
        // console.log(availabilityData);
        console.log('Availability data retrieved.');
        this._availabilityData = availabilityData;
        console.log(this._availabilityData)
      })
      .catch((err) => {
        console.log('Error occured at retrieving availability data:', err);
      });
  },

  // updateCarparkData: function (json, callback) {
  //   //This json object should contain the dynamic fields (carpark lots) and a key (carpark code).
  //   database().ref('/').update(json).then(callback);
  // },
};

export default carparkData;
