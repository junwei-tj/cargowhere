import React from 'react';
import {Text, ImageBackground} from 'react-native';
import {Marker} from 'react-native-maps';

const styles = {
  marker: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carparkNumber: {
    paddingBottom: 10,
    color: 'white',
  },
};

export default function CarparkMarker(props) {
  return (
    <Marker
      tracksViewChanges={false}
      key={props.carpark.identifier}
      coordinate={props.carpark.latlng}
      //title={props.carpark.title}
      onCalloutPress={() => alert('pressed ' + props.carpark.title)}>
      <ImageBackground
        source={require('../images/marker.png')}
        style={styles.marker}>
        <Text style={styles.carparkNumber}>{props.index + 1}</Text>
      </ImageBackground>
    </Marker>
  );
}
