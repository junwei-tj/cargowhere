import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ImageBackground,
  FlatList
} from 'react-native';
import {useSelector} from 'react-redux';

/**
 * @module Carpark
 * */

/**
 * Renders a Carpark Component based on the info available
 * @param {*} props
 * Expected props include, carparkCode, carparkName, availableLots
 */

/**
   *
   * Helper function based on the Haversine Formula to calculate distance between two points using longitude and latitude. 
   * Used to calculate distance between current/specified location and nearby carparks
   * @name getDistanceFromLatLonInM
   * @function
   * @param {Number} lat1 Latitude of the first location
   * @param {Number} lon1 Longitude of the first location
   * @param {Number} lat2 Latitude of the second location
   * @param {Number} lon2 Longitude of the second location
   * @returns {Number} Distance in metres
   */

export function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c * 1000;
  return d;
}

/**
   *
   * Convert values in degree to radian. Helper function to convert values in degree to radian
   * @name deg2rad
   * @function
   * @param {Number} deg Degree Value to be converted
   * @returns {Number} Value in radian
   */

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export default function CarparkContainer(props) {
  const availability = useSelector(
    (state) => state.availability.availabilityData,
  );
  const carparks = useSelector(
    (state) => state.carparks.carparksData,
  );
  const maxCarparks = useSelector(
    (state) => state.maxCarparks.limit,
  );
  const specificLocation = useSelector(
    (state) => state.specificLocation,
  );

  /**
   * Calculate distance between the selected carpark and the specified location 
   * @name calculateDistance 
   * @function
   * @param {object} latlng Latitude and longitude of the selected carpark 
   * @returns {Number} Distance in metres
   */

  const calculateDistance = (latlng) => {
    let carparkLatitude = latlng.latitude;
    let carparkLongitude = latlng.longitude;
    return getDistanceFromLatLonInM(
      specificLocation.latlng.latitude,
      specificLocation.latlng.longitude,
      carparkLatitude,
      carparkLongitude
    );
  }

  /**
   * Retrieve the available number of parking lots of the selected carpark
   * @name getAvailableNum 
   * @function
   * @param {String} identifier unique code for the carpark selected 
   * @returns {Number} Number of available lots
   */

  const getAvailableNum = (identifier) => {
    if (availability[identifier]) {
      return availability[identifier].availableLots_car;
    } else {
      return '--';
    }
  };
  
  return (
    <FlatList
      data={carparks.slice(0, maxCarparks)}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item, index}) => {
        return (
          <Carpark
            carpark={item}
            index={index}
            distanceBetween={calculateDistance(item.latlng)}
            availableNum={getAvailableNum(item.identifier)}
            press={props.press}
          />
        );
      }}
    />
  );
}

function Carpark(props) {
  return (
    <Pressable onPress={props.press(props.carpark)}>
      <View style={styles.container}>
        <View style={styles.markerContainer}>
          <ImageBackground
            style={styles.marker}
            source={require('../images/marker.png')}>
            <Text style={styles.carparkNumber}>{props.index + 1}</Text>
          </ImageBackground>
          <Text style={styles.distance}>
            {Math.round(props.distanceBetween) + 'm'}
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{props.carpark.title}</Text>
          <Text style={styles.lots}>Lots available: {props.availableNum}</Text>
        </View>
        <TouchableOpacity style={styles.button}>
        </TouchableOpacity>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  markerContainer: {
    paddingTop: 5,
    flexDirection: 'column',
    alignSelf: 'flex-start',
    alignItems: 'center',
    marginLeft: 10,
  },
  marker: {
    width: 30,
    height: 30,
    marginTop: 5,
    marginBottom: 3,
    //borderWidth: 1,
  },
  distance: {
    color: '#6a94ff',
    fontSize: 11,
    marginBottom: 3,
    width: 40,
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginLeft: 15,
  },
  name: {
    fontSize: 15,
    color: '#494949',
  },
  lots: {
    color: '#777777',
    fontSize: 12,
  },
  carparkNumber: {
    color: 'white',
    textAlign: 'center',
    paddingTop: 3,
    fontSize: 12,
  },
});
