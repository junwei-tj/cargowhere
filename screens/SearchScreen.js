import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TextInput,
  Pressable,
  Keyboard
} from 'react-native';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setLatlng } from '../redux/regionSlice';
import { setSpecificLocation } from '../redux/specificLocationSlice';

const styles = StyleSheet.create({
  searchField: {
    width: '100%',
    flexDirection:'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 50,
    padding: 3,
    paddingLeft: 20,
    paddingRight: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 20,
    borderColor: 'lightgrey',
    backgroundColor: 'white',
    margin: 10,
  },
  inputStyle: {
    flexWrap: 'wrap',
    alignItems:'flex-start',
  },
  headerIcon: {
    position: 'absolute',
    right: 5,
    width: 25,
    height: 25,
    padding: 10,
    paddingBottom: 25,
    paddingLeft: 20,
    resizeMode: 'stretch',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
  },
  icon: {
    width: 15,
    height: 15,
    tintColor: 'grey',
  },
});

export default function SearchScreen(props) {
  const [searchValue, setSearchValue] = React.useState('');

  const carparks = useSelector(state => state.carparks.carparksData)
  const region = useSelector(state => state.region);
  const dispatch = useDispatch();

  async function getLocation(queryTerm) {
    var tomtomBaseUrl = 'https://api.tomtom.com/search/2/search/';
    var params = {
      key: 'i4wG1tT0cG0IPTnu7wRGJXkjsK2lNcxU',
      countrySet: 'SG',
    };
    var queryURL = tomtomBaseUrl + encodeURIComponent(queryTerm) + '.json';

    try {
      var response = await axios.get(queryURL, {params: params});
    } catch (error) {
      throw error;
    }

    var results = response.data.results;
    if (results.length > 0) {
      var topResult = results[0];
      return topResult;
    } else {
      throw 'No location found';
    }
  }

  function onSubmitSearch({nativeEvent, ...rest}) {
    getLocation(nativeEvent.text).then((location) => {
      console.log(location.position);
      console.log(location.address);
      // update map view
      dispatch(setLatlng({
        latitude: location.position.lat,
        longitude: location.position.lon,
      }));
      dispatch(setSpecificLocation({
        latlng: {
          latitude: location.position.lat,
          longitude: location.position.lon,
        },
        active: true,
        title: searchValue,
      }));

      // props.setRegion((prevState) => ({
      //   ...prevState,
      //   latitude: location.position.lat,
      //   longitude: location.position.lon,
      // }));
      // props.setSpecificLocation({
      //   latlng: {
      //     latitude: location.position.lat,
      //     longitude: location.position.lon,
      //   },
      //   active: true,
      //   title: searchValue,
      // });
    });
  }

  return (

      <View style={styles.searchField}>
          <TextInput
            editable
            styles={styles.inputStyle}
            placeholder={'Search...'}
            value={searchValue}
            onChangeText={(text) => setSearchValue(text)}
            onSubmitEditing={onSubmitSearch}
            returnKeyType = {"search"}
          />
          <Pressable
              style={styles.headerIcon}
              onPress={() => {
                setSearchValue('');
                Keyboard.dismiss();
              }}>
            <Image
                style={styles.icon}
                source={require('../images/cross.png')}
            />
          </Pressable>
        </View>
  )
}
