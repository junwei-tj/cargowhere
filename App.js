import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ImageBackground,
  ToastAndroid,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
//import AsyncStorage from '@react-native-async-storage/async-storage';

import StatusBar from './components/StatusBar';
import BottomDisplay from './screens/BottomDisplay';
import carparkData from './data_manager/DataManager';
import {getDistanceFromLatLonInM} from './components/Carpark';
import CarparkMarker from './components/CarparkMarker';

import {useSelector, useDispatch} from 'react-redux';
import {setCarparks} from './redux/carparksSlice';
import {setAvailability} from './redux/availabilitySlice';
import {setRegion} from './redux/regionSlice';
import {
  SORT_BY_AVAILABILITY,
  SORT_BY_DISTANCE,
} from './constants/sortCriteriaConstants';
import SearchScreen from './screens/SearchScreen';
import LoadingScreen from './screens/LoadingScreen';
import {setSpecificLocation} from './redux/specificLocationSlice';
import {setMaxCarparks} from './redux/maxCarparksSlice';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '61%',
  },
  menu: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '40%',
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderColor: 'lightgrey',
    overflow: 'hidden',
  },
  searchContainer: {
    top: 10,
    left: 10,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: '12%',
    width: '70%',
  },
  refreshButtonContainer: {
    width: 36,
    height: 36,
    position: 'absolute',
    top: 28,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 18,
    borderColor: 'lightgrey',
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orientateButtonContainer: {
    width: 36,
    height: 36,
    position: 'absolute',
    top: 28,
    right: 52,
    backgroundColor: 'white',
    borderRadius: 18,
    borderColor: 'lightgrey',
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshPressable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshButton: {
    width: '80%',
    height: '80%',
    tintColor: 'grey',
  },
  pin: {
    width: 44,
    height: 44,
  },
});

function getCarparks({region, callback}) {
  let bottomLeftLat = region.latitude - region.latitudeDelta / 2;
  let bottomLeftLongitude = region.longitude - region.longitudeDelta / 2;
  let topRightLat = region.latitude + region.latitudeDelta / 2;
  let topRightLongitude = region.longitude + region.longitudeDelta / 2;

  ToastAndroid.show('Updating carpark markers...', ToastAndroid.SHORT);
  carparkData.retrieveInLongLat(
    bottomLeftLongitude,
    bottomLeftLat,
    topRightLongitude,
    topRightLat,
    callback,
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
    if (!carparkObjs.some((item) => item.title == obj.title)) {
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
        // availableLots_H: obj.availableLots_H,
        // availableLots_L: obj.availableLots_L,
        // availableLots_motorcycle: obj.availableLots_motorcycle,
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
      // sort by distance
      // sort carparks by distance, in ascending order
      carparks.sort((a, b) => {
        return a.distance - b.distance;
      });
  }
  //console.log(carparks)
  return carparks;
}

export default function App() {
  const region = useSelector((state) => state.region);
  const carparks = useSelector((state) => state.carparks.carparksData);
  const specificLocation = useSelector((state) => state.specificLocation);
  const sortCriteria = useSelector((state) => state.sortCriteria.criteria);
  const availability = useSelector(
    (state) => state.availability.availabilityData,
  );
  const [isLoading, setIsLoading] = useState(true);
  const maxCarparks = useSelector((state) => state.maxCarparks.limit)
  const dispatch = useDispatch();

  // code for geolocation for reference
  function currentLocation() {
    /* // added for testing retrieval of data
    carparkData.retrieveInCoords(44990.0,41380.0, 44996.0, 41389.0, function(resultArray) {
      console.log(resultArray);
    });
    */
    Geolocation.getCurrentPosition((info) => {
      console.log(info);
      // setLatitude(info.coords.latitude);
      // setLongitude(info.coords.longitude);
      let currentRegion = {
        latitude: info.coords.latitude,
        longitude: info.coords.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      };
      let currentLocationMarker = {
        latlng: {
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        },
        title: 'Current Location',
      };
      dispatch(setRegion(currentRegion));
      dispatch(setSpecificLocation(currentLocationMarker));
    });
  }

  useEffect(() => {
    currentLocation();
  }, []);

  useEffect(() => {
    carparkData.updateCarparkStaticData();
    setTimeout(() => {
      setIsLoading(false);
      console.log('Unmounting loading screen..');
    }, 2500);
  }, []);

  useEffect(() => {
    carparkData
      .updateAvailabilityData()
      .then((data) => dispatch(setAvailability(data)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carparks]);

  function carparksRetrieved(carparkList) {
    let carparkObjs = filterCarparksJSON(carparkList, specificLocation.latlng);
    let sorted = sortCarparks(carparkObjs, availability, sortCriteria);
    dispatch(setCarparks(sorted));
    ToastAndroid.show('Carpark markers updated', ToastAndroid.SHORT);
  }

  const sortCriteriaChanged = (newSortCriteria) => {
    let sorted = sortCarparks([...carparks], availability, newSortCriteria);
    dispatch(setCarparks(sorted));
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>
            <StatusBar backgroundColor="#2EBD6B" barStyle="default" />
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              region={region}
              onRegionChangeComplete={(region) => {
                dispatch(setRegion(region));
                // getCarparks({region, callback: carparksRetrieved});
                console.log('onRegionChangeComplete completed');
              }}>
              {carparks.map((carpark, index) => {
                if (index < maxCarparks) {
                  return (
                    <CarparkMarker
                      carpark={carpark}
                      index={index}
                      key={index}
                    />
                  );
                }
              })}
              {specificLocation && (
                <Marker
                  tracksViewChanges={false}
                  key={specificLocation.title}
                  coordinate={specificLocation.latlng}
                  title={specificLocation.title}>
                  <Image
                    source={require('./images/pin.png')}
                    style={styles.pin}
                  />
                </Marker>
              )}
            </MapView>
            <View style={styles.searchContainer}>
              <SearchScreen />
            </View>

            <View style={styles.refreshButtonContainer}>
              <Pressable
                android_ripple={{color: 'lightgrey'}}
                style={styles.refreshPressable}
                onPress={() =>
                  getCarparks({region, callback: carparksRetrieved})
                }>
                <Image
                  source={require('./images/refresh.png')}
                  style={styles.refreshButton}
                />
              </Pressable>
            </View>

            <View style={styles.orientateButtonContainer}>
              <Pressable
                android_ripple={{color: 'lightgrey'}}
                style={styles.refreshPressable}
                onPress={() => {
                  currentLocation();
                }}>
                <Image
                  source={require('./images/mylocationAndroid.png')}
                  style={styles.refreshButton}
                />
              </Pressable>
            </View>

            <View style={styles.menu}>
              {/* pass update state functions to child components so they can update on behalf of this component */}
              <BottomDisplay
                //setRegion={setRegion}
                //setSpecificLocation={setSpecificLocation}
                //carparks={carparks}
                //currentRegion={region}
                pickerCallback={sortCriteriaChanged}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </>
  );
}
