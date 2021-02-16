/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import StatusBar from './StatusBar';
import NavigationBar from './NavigationBar';

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
    borderTopWidth: 1,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderColor: 'lightgrey',
    overflow: "hidden"
  }
 });
 
 export default () => (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2EBD6B" barStyle="light-content" />
      {/* temp view so I don't keep making requests to Google Maps */}
      <View style={[styles.map, {backgroundColor: "grey", alignItems: 'center', justifyContent: 'center'}]}><Text>Map goes here</Text></View>
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
        <NavigationBar />
      </View>
      
    </View>
 );
