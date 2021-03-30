import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {
  WIDTH,
  HEIGHT_MODAL,
} from '../constants/screenConstants';

export default function SimpleModal(props) {
    
  const closeModal = (bool, data) => {
    props.changeModalVisible(bool);
    props.setData(data);
  }

  const [name, setName] = useState();

  return (
    <TouchableOpacity
    disabled = {true}
    style = {styles.container}
  >
      <View style = {styles.modal}>
        <View style={styles.textView}>
          <Text style = {styles.text}>Enter the name you would to save:</Text>
          <TextInput
            style = {styles.input}
            placeholder = "Enter name of location"
            onChangeText = {(val) => setName(val)}/>
          <View style ={styles.buttonsView}>
            <TouchableOpacity 
              style = {styles.touchableOpacity}
              onPress={() => closeModal(false,"Cancel")}
            >
              <Text style = {[styles.text, {color: "blue"}]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style = {styles.touchableOpacity}
              onPress = {() => closeModal(false,"Ok")}>
              <Text style = {[styles.text, {color: "blue"}]}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
  </TouchableOpacity>
  )
}

//TODO: Make further changes, adapted from NearbyScreen haha
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
