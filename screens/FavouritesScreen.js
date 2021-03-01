import React from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import Carpark from './Carpark';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    backgroundColor: "#eee",
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 20,
    paddingLeft: 20,
    textDecorationLine: "underline",
  },
});

export default function FavouritesScreen() {

  return (
    <View style={styles.container}>
    {/* To add CRUD functionality  */}
      <View style={styles.header}>
      <Text style={styles.headerText}>Favourites</Text>
      </View>
      {/* Put here for now just to see how the list will look  */}
      <FlatList data={Array(9).fill(0)} renderItem={() => <Carpark />} /> 
    </View>
  );
}
