import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';

import { useSelector, useDispatch } from 'react-redux';
import { setLatlng } from '../redux/regionSlice';
import { setSpecificLocation } from '../redux/specificLocationSlice';
import { setSelectedFavourite } from '../redux/selectedFavouriteSlice';

export default function Favourite(props) {
  
  const region = useSelector(state => state.region);
  const selectedFavourite = useSelector((state) => state.selectedFavourite);
  const dispatch = useDispatch();

  function onSelectFavourite(){
    dispatch(setLatlng({
      latitude: JSON.parse(props.favourite[1])[0],
      longitude: JSON.parse(props.favourite[1])[1],
    }));
    dispatch(setSpecificLocation({
      latlng: {
        latitude: JSON.parse(props.favourite[1])[0],
        longitude: JSON.parse(props.favourite[1])[1],
      },
      title: props.favourite[0],
    }));
    dispatch(setSelectedFavourite(props.favourite)); 
    props.changeIfNew(false);
}

  return (
    <Pressable> 
      {/* //Might not need this Pressable */}
      <View style={styles.container}>
        <TouchableOpacity style = {styles.touchable}
        onPress = {onSelectFavourite}>
          <View style={styles.markerContainer}>
            <Image
              style={styles.marker}
              source={require('../images/heart.png')}
            />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{props.favourite[0]}</Text>
          </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}
          onPress={() => {
            onSelectFavourite();
            props.changeModalVisible(true);
          }}>
              <Image
                  style={styles.marker}
                  source={require('../images/edit.png')}
              />
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 35,
  },
  markerContainer: {
    paddingTop: 5,
    flexDirection: 'column',
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  touchable : {
    flexDirection:"row",
    width: "100%",
  },
  marker: {
    width: 20,
    height: 20,
    marginVertical: 5,
    borderWidth: 1,
  },
  infoContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginLeft: 15,
    marginVertical: 8,
  },
  name: {
    fontSize: 15,
    color: '#494949',
  },
});
