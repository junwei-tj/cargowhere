import React, {useState} from 'react';
import {StyleSheet, View, Image, Pressable} from 'react-native';
import {
  NearbyScreen,
  FavouritesScreen,
  AboutScreen,
} from '../screens';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: '12%',
    borderBottomWidth: 1,
    borderColor: 'lightgrey',
  },
  activeTab: {
    borderBottomWidth: 1,
    borderBottomColor: '#2f60f4',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: 'grey',
  },
  activeIcon: {
    tintColor: '#2f60f4',
  },
});

export default function NavigationBar(props) {
  const [activeTabs, setActiveTabs] = useState({
    navigation: true,
    favourites: false,
    about: false,
  });

  // set styles for active/inactive tabs
  const activeTabStyle = [styles.tab, styles.activeTab];
  const inactiveTabStyle = styles.tab;
  const activeIconStyle = [styles.icon, styles.activeIcon];
  const inactiveIconStyle = styles.icon;

  return (
    <View style={styles.container}>
      {/* display tab menu bar */}
      <View style={styles.bar}>
        {/* NearbyScreen tab */}
        <Pressable
          style={activeTabs.navigation ? activeTabStyle : inactiveTabStyle}
          onPress={() =>
            setActiveTabs({
              navigation: true,
              favourites: false,
              about: false,
            })
          }
          android_ripple={{color: 'lightgrey'}}>
          <Image
            style={activeTabs.navigation ? activeIconStyle : inactiveIconStyle}
            source={require('../images/navigation_arrow.png')}
          />
        </Pressable>

        {/* Favourites tab */}
        <Pressable
          style={activeTabs.favourites ? activeTabStyle : inactiveTabStyle}
          onPress={() =>
            setActiveTabs({
              navigation: false,
              favourites: true,
              about: false,
            })
          }
          android_ripple={{color: 'lightgrey'}}>
          <Image
            style={activeTabs.favourites ? activeIconStyle : inactiveIconStyle}
            source={require('../images/heart.png')}
          />
        </Pressable>

        {/* About tab */}
        <Pressable
          style={activeTabs.about ? activeTabStyle : inactiveTabStyle}
          onPress={() =>
            setActiveTabs({
              navigation: false,
              favourites: false,
              about: true,
            })
          }
          android_ripple={{color: 'lightgrey'}}>
          <Image
            style={activeTabs.about ? activeIconStyle : inactiveIconStyle}
            source={require('../images/information.png')}
          />
        </Pressable>
      </View>

      {/* Switching of tab screen is done here */}
      {activeTabs.navigation && (
        <NearbyScreen
          sortCriteriaChanged={props.sortCriteriaChanged}
        />
      )}
      {activeTabs.favourites && (
        <FavouritesScreen/>
      )}
      {activeTabs.about && <AboutScreen />}
    </View>
  );
}
