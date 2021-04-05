import React, {useState} from 'react';
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
  // workaround for some markers not rendering image fast enough
  const [trackView, setTrackView] = useState(true);

  return (
    <Marker
      tracksViewChanges={trackView}
      key={props.carpark.identifier}
      coordinate={props.carpark.latlng}
      onCalloutPress={() => alert('pressed ' + props.carpark.title)}>
      <ImageBackground
        source={require('../images/marker.png')}
        style={styles.marker}
        // workaround for some markers not rendering image fast enough
        onLoadEnd={() => setTimeout(() => setTrackView(false), 1000)}>
        <Text style={styles.carparkNumber}>{props.index + 1}</Text>
      </ImageBackground>
    </Marker>
  );
}
