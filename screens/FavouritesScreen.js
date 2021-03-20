import React, {useState, useEffect} from 'react';
import {View, Text, Button, FlatList, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Favourite from './Favourite';

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

  //Used to load all favourites from local storage, called whenever 
  //favourites are changed or when Favourites tab is clicked
  async function loadAllFavourites() {
    let keys = [];
    let jsonValues = [];
    try {
      keys = await AsyncStorage.getAllKeys();
      jsonValues = await AsyncStorage.multiGet(keys);
      console.log(jsonValues);
      setFavourites(jsonValues);
      //finalAns.push(JSON.parse(value));
    } catch (err) {
      alert(err);
    }
  }

  //Used to add a favourite from local storage
  async function addFavourite(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (err) {
      alert(err);
    }
    console.log('Executed addFavourite!');
    loadAllFavourites();
  }
  
  //Used to remove a favourite from local storage
  async function removeFavourite(key) {
    try {
      await AsyncStorage.removeItem(key);
      console.log('Removed success');
    } catch (err) {
      alert(err);
    }
    console.log('Executed removeFavourite!');
    loadAllFavourites();
  }

  const [favourites, setFavourites] = useState();

  useEffect(() => {
    //Test adding ======================================================
    addFavourite('Favourites_Key0', 'press above button to remove this!');
    addFavourite("Favourites_Key1", "Tekong");
    addFavourite("Favourites_Key2", "Nanyang Technological University");
    addFavourite("Favourites_Key3", "Plaza Singapura");
    addFavourite("Favourites_Key4", "Sentosa");
    //removeFavourite("Favourites_Key1");
    //==================================================================
    console.log("running useffect");
    loadAllFavourites();
 }, []);

  //TODO
  const manageFavourite = (favourite) => () => {

  };

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
          removeFavourite('Favourites_Key0');
        }}
      />
      <FlatList
        style={{width: '100%'}}
        data={favourites}
        keyExtractor={(item, index) => item.key}
        renderItem={({ item }) => (
          <Favourite
                favourite={item}
                //currentRegion={region}
                press={manageFavourite}
              />
        )}
      />
    </View>
  );
}
