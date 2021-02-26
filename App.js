import React, { useState } from 'react';
import {StyleSheet, View, Text} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

import StatusBar from './StatusBar';
import BottomDisplay from './BottomDisplay';

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

export default function App() {
  // code for geolocation for reference
  function currentLocation() {
    Geolocation.getCurrentPosition((info) => console.log(info));
  }
  currentLocation();

  // declare latitude and logitude as state. default values point to NTU
  const [latitude, setLatitude] = useState(1.3483099);
  const [longitude, setLongitude] = useState(103.680946);

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
      </MapView>
      <View style={styles.menu}>
        {/* pass update state functions to child components so they can update on behalf of this component */}
        <BottomDisplay 
          setLatitude={setLatitude}
          setLongitude={setLongitude}
        />
      </View>
    </View>
  );
}
