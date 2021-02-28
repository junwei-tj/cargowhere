import React from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import Carpark from './Carpark';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
});

export default function NearbyScreen() {
  return (
    <View style={styles.container}>
      {/* <Text>Nearby Screen</Text> */}
      {/* Need key extractor also*/}
      <FlatList data={Array(9).fill(0)} renderItem={() => <Carpark />} />
    </View>
  );
}
