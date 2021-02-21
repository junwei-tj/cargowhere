import React, { useState } from 'react';
import { StyleSheet, View, Image, Pressable } from 'react-native';
import { NearbyScreen, FavouritesScreen, SearchScreen, AboutScreen } from './screens';


const tabNames = ["navigation", "favourites", "search", "about"];

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bar: {
        flexDirection: 'row',
        overflow: "hidden",
        justifyContent: 'space-evenly',
        height: "12%",      
        borderBottomWidth: 1,
        borderColor: 'lightgrey',
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

export default function BottomDisplay() {
    const [activeTabs, setActiveTabs] = useState({
        navigation: true,
        favourites: false,
        search: false,
        about: false,
    });

    // set styles for active/inactive tabs
    const activeTabStyle = [styles.tab, styles.active];
    const inactiveTabStyle = styles.tab;

    return (
        <View style={styles.container}>
            <View style={styles.bar}>
                <Pressable
                    style={activeTabs.navigation ? activeTabStyle : inactiveTabStyle}
                    onPress={() => setActiveTabs({navigation: true, favourites: false, search: false, about: false})}
                    android_ripple={{color: "lightgrey"}}>
                    <Image
                        style={styles.icon}
                        source={require("./images/navigation_arrow.png")}
                    />
                </Pressable>
                
                <Pressable
                    style={activeTabs.favourites ? activeTabStyle : inactiveTabStyle}
                    onPress={() => setActiveTabs({navigation: false, favourites: true, search: false, about: false})}
                    android_ripple={{color: "lightgrey"}}>
                    <Image
                        style={styles.icon}
                        source={require("./images/heart.png")}
                    />
                </Pressable>
                
                <Pressable
                    style={activeTabs.search ? activeTabStyle : inactiveTabStyle}
                    onPress={() => setActiveTabs({navigation: false, favourites: false, search: true, about: false})}
                    android_ripple={{color: "lightgrey"}}>
                    <Image
                        style={styles.icon}
                        source={require("./images/search.png")}
                    />
                </Pressable>

                <Pressable
                    style={activeTabs.about ? activeTabStyle : inactiveTabStyle}
                    onPress={() => setActiveTabs({navigation: false, favourites: false, search: false, about: true})}
                    android_ripple={{color: "lightgrey"}}>
                    <Image
                        style={styles.icon}
                        source={require("./images/information.png")}
                    />
                </Pressable>
            </View>
            
            {/* Switching of tab screen is done here */}
            {activeTabs.navigation && <NearbyScreen />}
            {activeTabs.favourites && <FavouritesScreen />}
            {activeTabs.search && <SearchScreen />}
            {activeTabs.about && <AboutScreen />}
        </View>
    );
}