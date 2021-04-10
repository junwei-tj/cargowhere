import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native'

/**
 * @module NoInternetScreen
 */

const NoInternetScreen = () => {
  return (
      <View style={styles.container}>
          <Image source={require('../images/car.png')}/>
          <Text style={styles.text}>CarGoWhere</Text>
          <Text style={styles.title}>Unable to connect to the Internet.</Text>
          <Text style={styles.body}>Please connect to the Internet and restart the app.</Text>
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      width: '100%',
      backgroundColor: '#eee',
  },
  text: {
      paddingBottom: 8,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 24,
      color: '#333',
  },
  title: {
      marginTop: 10,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 20,
      color: '#333',
  }, 
  body: {
      marginTop: 10,
      textAlign: 'center',
      fontSize: 14,
      color: '#333',
  }
})

export default NoInternetScreen;


