import React from 'react';
import {View, Text, Button, FlatList, StyleSheet} from 'react-native';
import Carpark from './Carpark';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    backgroundColor: '#eee',
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 20,
    paddingLeft: 20,
    textDecorationLine: 'underline',
  },
});

export default function FavouritesScreen(props) {
  //Calls removeFavourite() passed down from App.js
  function removeFavourite(key) {
    props.removeFavourite(key);
    console.log('Executed removeFavourite!');
    refreshFavourites();
  }

  //Calls addFavourite() passed down from App.js
  function addFavourite(key, value) {
    props.addFavourite(key, value);
    console.log('Executed addFavourite!');
    refreshFavourites();
  }

  //TODO: so that list can be updated real-time
  function refreshFavourites() {}

  return (
    <View style={styles.container}>
      {/* To add CRUD functionality  */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Favourites</Text>
      </View>
      {/* Temp button here to test if data can be edited */}
      <Button
        title="Press to remove/add"
        onPress={() => {
          addFavourite('add', 'addresult');
        }}
      />
      <Text style={styles.headerText}>{props.favourites}</Text>
      {/* Put here for now just to see how the list will look  */}
      {/* <FlatList data={Array(9).fill(0)} renderItem={() => <Carpark />} />  */}
    </View>
  );
}
