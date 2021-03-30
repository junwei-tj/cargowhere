import React, {useState, useEffect} from 'react';
import {View, Image, Text, Button, FlatList, StyleSheet, Modal, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Favourite from '../components/Favourite';
import SimpleModal from '../components/SimpleModal';

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
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 20,
    paddingLeft: 20,
    textDecorationLine: 'underline',
  },
  favourite: {

  }
});

export default function FavouritesScreen(props) {

  const [isModalVisible, setIsModalVisible] = useState(initialState)
  const [chooseData, setChooseData] = useState();

  const changeModalVisible = (bool) =>{
    setIsModalVisible(bool);
  }

  const setData = (data) => {
    setChooseData(data);
  }

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
        <TouchableOpacity style = {styles.favourite}
            onPress = {() => changeModalVisible(true)}
            style = {styles.touchableOpacity}
          >
            <Text style = {styles.headerText}>Add To Favourites</Text>
          </TouchableOpacity>
      </View>
      <Modal
      transparent = {true}
      animationType = 'fade'
      visible = {isModalVisible}
      onRequestClose = {() => changeModalVisible(false)}
      >
        <SimpleModal
          changeModalVisible={changeModalVisible}
          setData = {setData}></SimpleModal>
      </Modal>
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
          <TouchableOpacity
            onPress = {() => changeModalVisible(true)}
            style = {styles.touchableOpacity}
          >
            <Favourite
              favourite={item}
              //currentRegion={region}
              press={manageFavourite}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
