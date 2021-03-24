import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ImageBackground,
} from 'react-native';
import DataManager from '../DataManager';
/**
 * Renders a Carpark Component based on the info available
 * @param {*} props
 * Expected props include, carparkCode, carparkName, availableLots
 */

// Haversine formula for calculating distance between two points using longitude and latitude

export function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c * 1000; // Distance in m
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// Still needs images for the button to see more details
export default function Carpark(props) {
  const [availableNum, setAvailableNum] = React.useState('--');
  // Get both destination lat/lon and the carpark lat/lon
  const destinationLongitude = props.currentRegion.longitude;
  const destinationLatitude = props.currentRegion.latitude;
  const carparkLongitude = props.carpark.latlng.longitude;
  const carparkLatitude = props.carpark.latlng.latitude;
  const distanceBetween = getDistanceFromLatLonInM(
    destinationLatitude,
    destinationLongitude,
    carparkLatitude,
    carparkLongitude,
  );
  React.useEffect(() => {
    var carparksAvailablity = Object.keys(DataManager._availabilityData);

    if (carparksAvailablity.find((v) => v === props.carpark.identifier)) {
      try {
        if (
          parseInt(
            DataManager._availabilityData[props.carpark.identifier]
              .availableLots_car,
            10,
          ) >= 0
        ) {
          setAvailableNum(
            DataManager._availabilityData[props.carpark.identifier]
              .availableLots_car,
          );
        }
      } catch (e) {}
    }
  }, [props.carpark.identifier]);
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
            {Math.round(distanceBetween) + 'm'}
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{props.carpark.title}</Text>
          {/*should be `${props.carparkName} (${carparkCode})*/}
          <Text style={styles.lots}>Lots available: {availableNum}</Text>
          {/*`Lots available ${props.availableLots}`*/}
        </View>
        <TouchableOpacity style={styles.button}>
          {/* <Image source={require('images/chevron-left.png')} /> */}
        </TouchableOpacity>
      </View>
    </Pressable>
  );
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
