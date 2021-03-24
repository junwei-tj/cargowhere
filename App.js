import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ImageBackground,
  ToastAndroid,
  Pressable,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
//import AsyncStorage from '@react-native-async-storage/async-storage';

import StatusBar from './StatusBar';
import BottomDisplay from './BottomDisplay';
import carparkData from './DataManager';
import {getDistanceFromLatLonInM} from './screens/Carpark';
import { MAX_CARPARKS_TO_DISPLAY } from './constants/carparkConstants';

import { useSelector, useDispatch } from 'react-redux';
import { setCarparks } from './redux/carparksSlice';
import { setRegion } from './redux/regionSlice';
import { SORT_BY_AVAILABILITY, SORT_BY_DISTANCE } from './constants/sortCriteriaConstants';
import SearchScreen from "./screens/SearchScreen";

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
    width: '80%',
  },
  refreshButtonContainer: {
    width: 36,
    height: 36,
    position: 'absolute',
    top: 28,
    right: 15,
    backgroundColor: 'white',
    borderRadius: 18,
    borderColor: 'grey',
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
  marker: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carparkNumber: {
    paddingBottom: 10,
    color: 'white'
  },
  pin: {
    width: 44,
    height: 44
  }
});

function getCarparks({region, callback}) {
  let bottomLeftLat = region.latitude - region.latitudeDelta / 2;
  let bottomLeftLongitude = region.longitude - region.longitudeDelta / 2;
  let topRightLat = region.latitude + region.latitudeDelta / 2;
  let topRightLongitude = region.longitude + region.longitudeDelta / 2;

  ToastAndroid.show('Updating carpark markers...', ToastAndroid.SHORT);
  carparkData.updateAvailabilityData();
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
 * Current fields kept are: latitude and longitude (combined to latlng), title, availableLots_H, availableLots_L, availableLots_car, availableLots_motorcycle
 * @param {Array} carparkList
 * @param {region} pointOfReference coordinates (in latitude and longitude) of the point distance is to be calculated from
 */
function filterCarparksJSON(carparkList, pointOfReference) {
  let carparkObjs = [];
  if (pointOfReference === undefined) {
    throw 'Unable to sort by distance when pointOfReference is not provided';
  }
  carparkList.forEach((obj) => {
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
    if (!carparkObjs.some((item) => item.title == carpark.title))
      // filter out duplicates
      carparkObjs.push(carpark);
  });

  return carparkObjs;
}

/**
 * Function to handle sorting of carparks. Sorting can only be done based on distance and availability
 * @param {Array} carparks
 * @param {string} sortCriteria accepts constants from ./constants/sortCriteriaConstants
 */
function sortCarparks(
  carparks,
  sortCriteria,
) {
  switch (sortCriteria) {
    case SORT_BY_AVAILABILITY:
      // sort by availability
      carparks.sort((a, b) => {
        return b.availableLots_car - a.availableLots_car;
      });
      break;
    default: // sort by distance
      // sort carparks by distance, in ascending order
      carparks.sort((a, b) => {
        return a.distance - b.distance;
      });
  }
  return carparks;
}

const CarparkMarker = (props) => (
  <Marker
    key={props.index}
    coordinate={props.carpark.latlng}
    title={props.carpark.title}
    onCalloutPress={() => alert('pressed ' + props.carpark.title)}
    >
    <ImageBackground
      source={require('./images/marker.png')}
      style={styles.marker}>
      <Text style={styles.carparkNumber}>
        {props.index + 1}
      </Text>
    </ImageBackground>
  </Marker>
)

export default function App() {
  const region = useSelector(state => state.region);
  const carparks = useSelector(state => state.carparks.carparksData);
  const specificLocation = useSelector(state => state.specificLocation);
  const sortCriteria = useSelector(state => state.sortCriteria.criteria)

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
      setSpecificLocation({
        latlng: {
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        },
        title: 'Current Location',
        active: true,
      });
    });
  }

  // useEffect(() => {
  //   currentLocation();
  // }, []);

  function carparksRetrieved(carparkList) {
    let carparkObjs = filterCarparksJSON(carparkList, region);
    let sorted = sortCarparks(carparkObjs, sortCriteria);
    dispatch(setCarparks(sorted));
    ToastAndroid.show('Carpark markers updated', ToastAndroid.SHORT);
  }

  const sortCriteriaChanged = (newSortCriteria) => {
    let sorted = sortCarparks([...carparks], newSortCriteria);
    dispatch(setCarparks(sorted));
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2EBD6B" barStyle="default" />
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        onRegionChangeComplete={(region) => {
          dispatch(setRegion(region));
          //getCarparks({region, callback: carparksRetrieved});
          console.log('onRegionChangeComplete completed');
        }}>
        {carparks.map((carpark, index) => {
          if (index < MAX_CARPARKS_TO_DISPLAY) {
            return (
              <CarparkMarker
                carpark={carpark}
                index={index}
              />
            );
          }
        })}
        {specificLocation.active && (
          <Marker
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
        <SearchScreen/>
      </View>

      <View style={styles.refreshButtonContainer}>
        <Pressable
          android_ripple={{color: 'lightgrey'}}
          style={styles.refreshPressable}
          onPress={() => getCarparks({region, callback: carparksRetrieved})}>
          <Image
            source={require('./images/refresh.png')}
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
  );
}
