import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

const styles = StyleSheet.create({
    bar: {
        flexDirection: 'row',
        overflow: "hidden",
        justifyContent: 'space-evenly',
        height: "12%",      
        elevation: 1,
    },
    active: {
        borderBottomWidth: 1,
        borderBottomColor: 'blue',
    },
    tab: {
        flex: 1,
        alignItems: 'center',        
        justifyContent: 'center',
    },
    icon: {
        width: 20,
        height: 20,
    }
})

export default function NavigationBar() {
    return (
        <View style={styles.bar}>
            <View style={[styles.tab, styles.active]}>
                <Image
                    style={styles.icon}
                    source={require("./images/navigation_arrow.png")}
                />
            </View>
            <View style={styles.tab}>
                <Image
                    style={styles.icon}
                    source={require("./images/heart.png")}
                />
            </View>
            <View style={styles.tab}>
                <Image
                    style={styles.icon}
                    source={require("./images/search.png")}
                />
            </View>
            <View style={styles.tab}>
                <Image
                    style={styles.icon}
                    source={require("./images/information.png")}
                />
            </View>
        </View>
    );
}