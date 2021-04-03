import React, {useState} from 'react';
import {
  View,
  Image,
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
  const dispatch = useDispatch();

  //The name to be saved for the location
  const [name, setName] = useState();
  
  const leftCloseModal = (bool, data) => {
    console.log(props.newlyCreated);
    console.log(selectedFavourite.selected[0]);
    props.newlyCreated === true ? null : props.removeFavourite(selectedFavourite.selected[0]);
    props.changeModalVisible(bool);
  }

  const rightCloseModal = (bool, data) => {
    props.changeModalVisible(bool); //TODO: Figure out how to check for empty input
    props.newlyCreated === true ? null : props.removeFavourite(selectedFavourite.selected[0]);
    props.addFavourite(name, [region.latitude, region.longitude])
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
              defaultValue = {specificLocation.title}
              onChangeText = {(val) => setName(val)}/>}
          <View style ={styles.buttonsView}>
            <TouchableOpacity 
              style = {styles.touchableOpacity}
              onPress={() => leftCloseModal(false,"Cancel")}
            >
              {props.newlyCreated === true ?<Text style = {[styles.text, {color: "blue"}]}>Cancel</Text> :
            <Text style = {[styles.text, {color: "red"}]}>Delete</Text> }
            </TouchableOpacity>
            <TouchableOpacity 
              style = {styles.touchableOpacity}
              onPress = {() => rightCloseModal(false,"Ok")}>
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
    fontWeight: "bold"
  },
  buttonsView: {
    width: "100%",
    flexDirection: "row"
  },
  touchableOpacity: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center"
  },
  input: {
    borderWidth: 1,
    borderColor: "#777",
    padding: 8,
    margin: 10, 
    width: 200,
  }
});
