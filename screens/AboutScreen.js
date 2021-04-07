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
      <Text style={styles.body}>Parking Made Easy!</Text>
      <Text />
      <Text style={styles.body}>Not sure where nearby carparks are?</Text>
      <Text style={styles.body}>Need to know the parking rates and availability?</Text>
      <Text />
      <Text style={styles.body}>
        CarGoWhere provides realtime lot availability data, with sorting and
        saving of favourites for you to plan your trips with ease.
      </Text>
    </View>
  );
}
