import React, {useState, useEffect} from 'react';
import {View, Image, Text, Button, FlatList, StyleSheet, Modal, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Favourite from '../components/Favourite';
import SimpleModal from '../components/SimpleModal';
import { useSelector, useDispatch } from 'react-redux';

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
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  favourite: {
    flexDirection: 'row',
  },
  image:{
    width: 20,
    height: 20,
    marginTop: 5,
    marginBottom: 3,
    borderWidth: 1,
  }
});

export default function FavouritesScreen(props) {

  const [isModalVisible, setIsModalVisible] = useState(initialState)
  //const [chooseData, setChooseData] = useState();

  const selectedFavourite = useSelector((state) => state.selectedFavourite);
  const dispatch = useDispatch();

  const changeModalVisible = (bool) =>{
    setIsModalVisible(bool);
  }

 // const setData = (data) => {
    //setChooseData(data);
  //}

  const [newlyCreated, setNewlyCreated] = useState(false);

  const changeIfNew = (bool) => {
      setNewlyCreated(bool);
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
    //removeFavourite("NTU");
    //addFavourite("Tekong", [1,2]);
    //removeFavourite("Home");
    //==================================================================
    console.log("running useffect");
    loadAllFavourites();
 }, []);

  return (
    <View style={styles.container}>
      {/* To add CRUD functionality  */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Favourites</Text>
        <TouchableOpacity style = {styles.favourite}
            onPress = {() => {
              changeIfNew(true)
              changeModalVisible(true)}}
          >
              <Image
                  style={styles.image}
                  source={require('../images/heart.png')}
              />
              <Text style = {styles.headerText}> Save!</Text>
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
          //setData = {setData}
          newlyCreated = {newlyCreated}          
          removeFavourite = {removeFavourite}
          addFavourite = {addFavourite}></SimpleModal>
      </Modal>
      <FlatList
        style={{width: '100%'}}
        data={favourites}
        keyExtractor={(item, index) => item.key}
        renderItem={({ item }) => (
          <TouchableOpacity>
            <Favourite
              favourite={item}
              //press={manageFavourite}
              changeIfNew={changeIfNew}
              changeModalVisible = {changeModalVisible}
              removeFavourite = {removeFavourite}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
