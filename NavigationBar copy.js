import React, { useState } from 'react';
import { StyleSheet, View, Image, Platform, TouchableNativeFeedback, Pressable } from 'react-native';

const tabNames = ["navigation", "favourites", "search", "about"];

const styles = StyleSheet.create({
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

const Tab = (props) => {
    let stylesToApply = [styles.tab];
    if (props.active) stylesToApply.push(styles.active);

    let imageSource;
    switch (props.tabType) {
        case "navigation":
            imageSource = require("./images/navigation_arrow.png");
            break;
        case "favourites":
            imageSource = require("./images/heart.png");
            break;
        case "search":
            imageSource = require("./images/search.png");
            break;
        case "about":
            imageSource = require("./images/information.png");
            break;
        default:
            imageSource = require("./images/navigation_arrow.png");
    }

    return (
        <Pressable
            style={stylesToApply}
            onPress={onTabPressed}
            android_ripple={{color: "lightgrey"}}>
            <Image
                style={styles.icon}
                source={imageSource}
            />
        </Pressable>
    )
}

function onTabPressed(state, props) {
    let activeTabs = Object.keys(state.activeTabs).reduce((accumulator, key) => {
        accumulator[key] = false;
        return accumulator;
    }, {});
    activeTabs[props.active] = true;
    return activeTabs;
}
// const tempOnPress = () => {
//     alert("you pressed!")
// }

// component to represent the 4 tabs
export default function NavigationBar() {
    // onPress={() => setActiveTabs({navigation: false, favourites: true, search: false, about: false})}
    return (
        <View style={styles.bar}>
            <Tab active={true} tabType={"navigation"} />
            {/* <View style={[styles.tab, styles.active]}>
                <Image
                    style={styles.icon}
                    source={require("./images/navigation_arrow.png")}
                />
            </View> */}
            
            <Tab active={false} tabType={"favourites"} />
            
            <Tab active={false} tabType={"search"} />

            <Tab active={false} tabType={"about"} />

            {/* <TouchableNativeFeedback
                // onPress={() => setActiveTabs({navigation: false, favourites: false, search: false, about: true})}
                onPress={tempOnPress}
                background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>
                <Tab active={false} tabType={"about"} />
            </TouchableNativeFeedback> */}
        </View>
    );
}