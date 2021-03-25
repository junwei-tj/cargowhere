import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Image } from 'react-native'


const LoadingScreen = () => {
    return (
        <View style={styles.container}>
            <Image source={require('../images/car.png')}/>
            <Text style={styles.text}>CarGoWhere</Text>
            <ActivityIndicator size="large" color="#333"/>
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
    }
})

export default LoadingScreen


