import React from 'react';
import {View, Text, StyleSheet, TextInput, FlatList} from 'react-native';
import axios from 'axios';
import Carpark from './Carpark';
import { useSelector, useDispatch } from 'react-redux';
import { setLatlng } from '../redux/regionSlice';
import { setSpecificLocation } from '../redux/specificLocationSlice';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  searchField: {
    width: '94%',
    height: 50,
    padding: 3,
    paddingLeft: 20,
    paddingRight: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 20,
    borderColor: 'lightgrey',
    margin: 10,
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
    <View style={styles.container}>
      <View style={styles.searchField}>
        <TextInput
          editable
          placeholder={'Search...'}
          value={searchValue}
          onChangeText={(text) => setSearchValue(text)}
          onSubmitEditing={onSubmitSearch}
        />
      </View>
      <FlatList
        style={{width: '100%'}}
        data={carparks}
        keyExtractor={(item, index) => item.key}
        renderItem={({item}) => {
          return <Carpark carpark={item} currentRegion={region} />;
        }}
      />
    </View>
  );
}
