import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';

export default function Favourite(props) {
    
  return (
    <Pressable onPress={props.press(props.favourite)}> 
      {/* //Might not need this Pressable */}
      <View style={styles.container}>
        <View style={styles.markerContainer}>
          <Image
            style={styles.marker}
            source={require('../images/heart.png')}
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{props.favourite[0]}</Text>
        </View>
        <TouchableOpacity style={styles.button}
        onPress={() => {props.removeFavourite(props.favourite[0])}}>
            <Image
                style={styles.marker}
                source={require('../images/chevron.png')}
            />
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}


//TODO: Make further changes, adapted from NearbyScreen haha
const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  markerContainer: {
    paddingTop: 5,
    flexDirection: 'column',
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  marker: {
    width: 20,
    height: 20,
    marginTop: 5,
    marginBottom: 3,
    borderWidth: 1,
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
});
