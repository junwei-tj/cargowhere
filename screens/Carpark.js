import React from 'react';
import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';
/**
 * Renders a Carpark Component based on the info available
 * @param {*} props
 * Expected props include, carparkCode, carparkName, availableLots
 */

// Still needs images for the button to see more details
export default function Carpark(props) {
  return (
    <View style={styles.container}>
      <View style={styles.markerContainer}>
        <Image style={styles.marker} source={require('../images/marker.png')} />
        <Text style={styles.distance}>300m</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>Devonshire Rd (D0009)</Text>
        {/*should be `${props.carparkName} (${carparkCode})*/}
        <Text style={styles.lots}>Lots available: 20</Text>
        {/*`Lots available ${props.availableLots}`*/}
      </View>
      <TouchableOpacity style={styles.button}>
        {/* <Image source={require('images/chevron-left.png')} /> */}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },
  markerContainer: {
    paddingTop: 5,
    flexDirection: 'column',
    alignSelf: 'flex-start',
    alignItems: 'center',
    marginLeft: 10,
  },
  marker: {
    width: 20,
    height: 20,
    marginTop: 5,
    marginBottom: 3,
    resizeMode: 'contain',
  },
  distance: {
    color: '#6a94ff',
    fontSize: 11,
    marginBottom: 3,
  },
  infoContainer: {
    marginLeft: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 18,
    color: '#494949',
  },
  lots: {
    color: '#777777',
    fontSize: 12,
  },
});
