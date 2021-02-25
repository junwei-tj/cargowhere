import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  body: {
    fontSize: 15,
    color: 'grey',
  },
});

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CarGoWhere</Text>
      <Text />
      <Text style={styles.body}>Need to know where to park your car?</Text>
      <Text />
      <Text style={styles.body}>
        CarGoWhere provides realtime Carpark Availability data for you to plan
        your trips.
      </Text>
    </View>
  );
}
