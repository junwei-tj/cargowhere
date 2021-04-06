import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  WIDTH,
  HEIGHT_MODAL,
} from '../constants/screenConstants';
import { useSelector, useDispatch } from 'react-redux';


export default function SimpleModal(props) {
    
  const region = useSelector(state => state.region);
  const specificLocation = useSelector((state) => state.specificLocation);
  const selectedFavourite = useSelector((state) => state.selectedFavourite);
  //const dispatch = useDispatch();

  const [name, setName] = useState();
  
  const leftCloseModal = (bool, data) => {
    console.log(props.newlyCreated);
    props.newlyCreated === true ? null : props.removeFavourite(selectedFavourite.selected[0]);
    props.changeModalVisible(bool);
  }

  const rightCloseModal = (bool, data) => {
    props.changeModalVisible(bool); 
    props.newlyCreated === true ? null : props.removeFavourite(selectedFavourite.selected[0]);
    props.addFavourite(name, [specificLocation.latlng.latitude, specificLocation.latlng.longitude])
  }

  return (
    <TouchableOpacity
    disabled = {true}
    style = {styles.container}
  >
      <View style = {styles.modal}>
        <View style={styles.textView}>
          {props.newlyCreated === true ?
          <Text style = {styles.text}>Save name for {specificLocation.title}:</Text> :
          <Text style = {styles.text}>Edit or Delete {specificLocation.title}:</Text> }
          {props.newlyCreated === true ?
            <TextInput
              style = {styles.input}
              placeholder = "Enter name of location"
              onChangeText = {(val) => setName(val)}/> :
            <TextInput
              style = {styles.input}
              placeholder = "Enter new name of location"
              onChangeText = {(val) => setName(val)}/>}
          <View style ={styles.buttonsView}>
            <TouchableOpacity 
              style = {styles.activeButton}
              onPress={() => leftCloseModal(false,"Cancel")}
            >
              {props.newlyCreated === true ?<Text style = {[styles.text, {color: "blue"}]}>Cancel</Text> :
            <Text style = {[styles.text, {color: "red"}]}>Delete</Text> }
            </TouchableOpacity>
            <TouchableOpacity 
              style = {!Boolean(name) ? styles.inactiveButton : styles.activeButton}
              onPress = {() => rightCloseModal(false,"Ok")}
              disabled = {!Boolean(name)}>
              <Text style = {[styles.text, {color: "blue"}]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
  </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center',
    justifyContent:'center'
  },
  modal:{
      height: HEIGHT_MODAL,
      width: WIDTH - 80,
      paddingTop:10,
      backgroundColor:"white",
      borderRadius: 10
  },
  textView:{
    flex: 1,
    alignItems:'center'
  },
  text:{
    margin: 5,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: 'center'
  },
  buttonsView: {
    width: "100%",
    flexDirection: "row"
  },
  activeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center"
  },
  inactiveButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    opacity: 0.2,
  },
  input: {
    borderWidth: 1,
    borderColor: "#777",
    padding: 8,
    margin: 10, 
    width: 200,
  }
});
