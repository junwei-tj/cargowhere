import React from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import axios from 'axios';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  searchField: {
    width: '94%',
    padding: 8,
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
      props.setLatitude(location.position.lat);
      props.setLongitude(location.position.lon);
      props.setSpecificLocation({
        latlng: {
          latitude: location.position.lat,
          longitude: location.position.lon,
        },
        active: true,
        title: searchValue,
      });
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
      <Text>Search Screen</Text>
    </View>
  );
}
