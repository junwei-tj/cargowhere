/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { StyleSheet, View, Button } from 'react-native';
import NavigationBar from './NavigationBar';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

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
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderColor: 'white',
    overflow: "hidden"
  }
 });
 
 export default () => (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        region={{
          latitude: 1.3483099,
          longitude: 103.680946,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
      >
      </MapView>
      <View style={styles.menu}>
        <NavigationBar style={{backgroundColor: "red"}} />
      </View>
      
    </View>
 );
