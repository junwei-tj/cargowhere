/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
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
    height: '62%',
  },
  menu: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '40%',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderColor: 'lightgrey',
    overflow: 'hidden',
  },
});

function onTabPressed(tab) {}

export default function App() {
  // code for geolocation for reference
  function currentLocation() {
    Geolocation.getCurrentPosition((info) => console.log(info));
  }
  currentLocation();
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2EBD6B" barStyle="default" />
      {/* temp view so I don't keep making requests to Google Maps */}
      <View
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
      </View>
      {/* <MapView
      provider={PROVIDER_GOOGLE} // remove if not using Google Maps
      style={styles.map}
      region={{
        latitude: 1.3483099,
        longitude: 103.680946,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      }}
    >
    </MapView> */}
      <View style={styles.menu}>
        <BottomDisplay />
      </View>
    </View>
  );
}
