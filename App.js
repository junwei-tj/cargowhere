import React, { useState } from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

import StatusBar from './StatusBar';
import BottomDisplay from './BottomDisplay';
//import carparkData from './DataManager'

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
});

// create array of car parks for making markers
const allCarparksJSON = require("./all_carparks.json");
let allCarparks = [];
allCarparksJSON.forEach(obj => {
  let carpark = {
    latlng: {
      latitude: obj.latitude,
      longitude: obj.longitude,
    },
    title: obj.name,
  }
  allCarparks.push(carpark);
});

export default function App() {
  // code for geolocation for reference
  function currentLocation() {
    /* // added for testing retrieval of data
    carparkData.retrieveInCoords(44990.0,41380.0, 44996.0, 41389.0, function(resultArray) {
      console.log(resultArray);
    });
    */
    Geolocation.getCurrentPosition((info) => console.log(info));
  }
  currentLocation();

  // declare latitude and logitude as state. default values point to NTU
  const [latitude, setLatitude] = useState(1.3483099);
  const [longitude, setLongitude] = useState(103.680946);

  // used for marking user's searched location. set active to false when user is using GPS
  const [specificLocation, setSpecificLocation] = useState({
    latlng: {
      latitude: 1.3483099,
      longitude: 103.680946,
    },    
    title: "Nanyang Technological University",
    active: true,
  });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2EBD6B" barStyle="default" />
      {/* temp view so I don't keep making requests to Google Maps */}
      {/* <View
        style={[
          styles.map,
          // eslint-disable-next-line react-native/no-inline-styles
          {
            backgroundColor: 'grey',
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}>
        <Text>Map goes here</Text>
      </View> */}
      <MapView
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        region={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
      >
        {allCarparks.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.latlng}
            title={marker.title}
            onCalloutPress={() => alert("pressed " + marker.title)}
            pinColor={'#7fa3ff'}
          />
        ))}
        {specificLocation.active && 
          <Marker 
            coordinate={specificLocation.latlng}
            title={specificLocation.title}            
          >
            <Image 
              source={require('./images/pin.png')} 
              style={{width: 32, height: 32}}
            />
          </Marker>
        }
      </MapView>
      <View style={styles.menu}>
        {/* pass update state functions to child components so they can update on behalf of this component */}
        <BottomDisplay
          setLatitude={setLatitude}
          setLongitude={setLongitude}
          setSpecificLocation={setSpecificLocation}
        />
      </View>
    </View>
  );
}
