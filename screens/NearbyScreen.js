import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Carpark from './Carpark';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    backgroundColor: "#eee",
  },
  sortBy: {
    fontSize: 20,
    paddingTop: 10,
    textAlign: "right",
    flex: 1,
  },
  headerText: {
    fontSize: 20,
    paddingTop: 10,
    paddingLeft: 20,
    textDecorationLine: "underline",
  },
  picker:{
    width:"43%",
    color:"black",
  }
});

export default function NearbyScreen(props) {
  const [value, setValue] = useState("key0");

  return (
    <View style={styles.container}>
      {/* <Text>Nearby Screen</Text> */}
      {/* Need key extractor also*/}
      <View style={styles.header}>
      <Text style={styles.headerText}>Nearby</Text>
        <Text style={styles.sortBy}>Sort By:</Text>
        <Picker
        style={styles.picker}
        selectedValue={value}
        onValueChange={(itemValue, itemIndex) => setValue(itemValue)}>
            <Picker.Item label="Distance" value="key0" />
            <Picker.Item label="Availability" value="key1" />
        </Picker>
      </View>
      {/* <FlatList data={Array(9).fill(0)} renderItem={() => <Carpark />} /> */}
      
      <>
      <FlatList
        data={props.carparks}
        keyExtractor={(item, index) => item.key}
        renderItem={({item}) => {
          return(
            <Carpark carpark={item} currentRegion={props.currentRegion} />
          );
        }}
        />
      </>
    </View>
  );
}
