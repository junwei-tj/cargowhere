import database from '@react-native-firebase/database';

/**
 * Retrieves carpark data based on various querying options
 * Callback is required as querying is asynchronous
 * all callback functions should accept a single parameter,
 * which will contain an array of objects
 **/
const carparkData = {
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
    database()
      .ref('/')
      .orderByChild('coordinates/x')
      .startAt(x1)
      .endAt(x2)
      .once('value', (snapshot) => {
        const resultArray = [];
        const carpark = snapshot.val();
        for (var key in carpark) {
          if (
            carpark[key]['coordinates']['y'] >= y1 &&
            carpark[key]['coordinates']['y'] <= y2
          )
            resultArray.push(carpark[key]);
        }
        callback(resultArray);
      });
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
    database()
      .ref('/')
      .orderByChild('longitude')
      .startAt(long1)
      .endAt(long2)
      .once('value', (snapshot) => {
        const resultArray = [];
        const carpark = snapshot.val();
        for (var key in carpark) {
          if (
            carpark[key]['latitude'] >= lat1 &&
            carpark[key]['latitude'] <= lat2
          )
            resultArray.push(carpark[key]);
        }
        callback(resultArray);
      });
  },

  /*

     */
  /**
   * Retrieve carparks based on carpark name
   * Does exact string matching, may still return multiple objects since there are
   * duplicates of data with the same name but different lot type
   * @param name
   * @param callback Should accept a single result parameter, which contains an array of objects
   */
  retrieveByName: function (name, callback) {
    database()
      .ref('/')
      .equalTo(name)
      .once('value', (snapshot) => {
        // we use an array instead of the object returned to standardise the format of return values
        const resultArray = [];
        const carpark = snapshot.val();
        for (var key in carpark) {
          resultArray.push(carpark[key]);
        }
        callback(resultArray);
      });
  },

  updateCarparkData: function (json, callback) {
    //This json object should contain the dynamic fields (carpark lots) and a key (carpark code).
    database().ref('/').update(json).then(callback);
  },
};

export default carparkData;
