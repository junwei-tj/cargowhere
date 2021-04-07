import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ImageBackground,
  FlatList
} from 'react-native';
import {useSelector} from 'react-redux';
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
