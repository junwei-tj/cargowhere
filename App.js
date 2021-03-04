import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ImageBackground, ToastAndroid, Pressable } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';

import StatusBar from './StatusBar';
import BottomDisplay from './BottomDisplay';
import carparkData from './DataManager';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,

    justifyContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '61%',
  },
  menu: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '40%',
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderColor: 'lightgrey',
    overflow: 'hidden',
  },
  refreshButtonContainer: {
    width: 36,
    height: 36,
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 18,
    borderColor: 'grey',
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshPressable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshButton: {
    width: '80%',
    height: '80%',
    tintColor: 'grey'
  }
});


function updateCarparkMarkers({ region, callback }) {
  let bottomLeftLat = region.latitude - region.latitudeDelta / 2;
  let bottomLeftLongitude = region.longitude - region.longitudeDelta / 2;
  let topRightLat = region.latitude + region.latitudeDelta / 2;
  let topRightLongitude = region.longitude + region.longitudeDelta / 2;

  ToastAndroid.show("Updating carpark markers...", ToastAndroid.SHORT);
  carparkData.retrieveInLongLat(bottomLeftLongitude, bottomLeftLat, topRightLongitude, topRightLat, callback);
}

// custom hook
// currently max carparks is 15 for performance reasons
// TODO: get 15 carparks based on SORTING criteria
function useCarparks(carparkList) {
  const [carparks, setCarparks] = useState(carparkList);

  const updateCarparks = (carparkList) => {
    console.log("before filtering:")
    console.log(carparkList)
    let carparkObjs = [];
    carparkList.forEach(obj => {
      let carpark = {
        latlng: {
          latitude: obj.latitude,
          longitude: obj.longitude,
        },
        title: obj.name,
      };
      if (carparkObjs.length < 15 && !carparkObjs.some(item => item.title == carpark.title))
        carparkObjs.push(carpark);
    })
    setCarparks(carparkObjs);
    console.log("after filtering:")
    console.log(carparkObjs)
    ToastAndroid.show("Carpark markers updated", ToastAndroid.SHORT);
  }
  return [carparks, updateCarparks];
}



export default function App() {
  // declare latitude and logitude as state. default values point to NTU 
  const [region, setRegion] = useState({
    latitude: 1.3483099,
    longitude: 103.680946,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });

//--------------------------------------------------------------------------------------------------
  //Functions to CRUD local storage of favourites
  //TODO: Shift out to seperate .js file if possible and use real carpark data

  //Used to add a favourite to local storage, will be
  //passed down to FavouritesScreen to be executed
  const addFavourite = async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (err) {
      alert(err);
    }
  }

  //Used to load all favourites from local storage, called at
  //startup of app using useEffect()
  const loadAllFavourites = async () => {
    let keys = [];
    let jsonValues = [];
    try {
      keys = await AsyncStorage.getAllKeys();
      jsonValues = await AsyncStorage.multiGet(keys);
      console.log(jsonValues);
      setFavourites(jsonValues);
      //finalAns.push(JSON.parse(value));
    } catch (err) {
      alert(err);
    }
  }

  //Used to remove a favourite from local storage, will be
  //passed down to FavouritesScreen to be executed
  const removeFavourite = async (key) => {
    try {
      await AsyncStorage.removeItem(key)
      console.log("Removed success");
    } catch (err){
      alert(err);
    }
  }
  //--------------------------------------------------------------------------------------------------

  const [favourites, setFavourites] = useState();

  //Can use the below for testing if you want, to initialise values on startup
  //by uncommenting the lines you want to run
  useEffect(() => {
    //addFavourite("Favourites_Key0", "carpark0 details");
    //addFavourite("Favourites_Key1", "carpark1 details");
    //removeFavourite("Favourites_Key1");
    //removeFavourite("Favourites_Key0");
      loadAllFavourites()
  }, []);

  const [carparks, setCarparks] = useCarparks([]);

  // used for marking user's searched location. set active to false when user is using GPS
  // Can we use this to pin current location also? (Jun Jie)
  const [specificLocation, setSpecificLocation] = useState({
    latlng: {
      
      latitude: 1.3483099,
      longitude: 103.680946,
    },
    title: "Nanyang Technological University",
    active: true,
  });

  // carparkData.retrieveInCoords(103.74847572537429, 1.3609900957056642, 103.75131886701433, 1.3638109818660649,  function(resultArray) {
  //   console.log(resultArray);
  // });

  // code for geolocation for reference
  function currentLocation() {
    /* // added for testing retrieval of data
    carparkData.retrieveInCoords(44990.0,41380.0, 44996.0, 41389.0, function(resultArray) {
      console.log(resultArray);
    });
    */
    Geolocation.getCurrentPosition((info) => {
      console.log(info);
      setLatitude(info.coords.latitude);
      setLongitude(info.coords.longitude);
      setSpecificLocation({
        latlng: {
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        },
        title: "Current Location",
        active: true,
      })
    });
  }

  // useEffect(() => {
  //   currentLocation();
  // }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2EBD6B" barStyle="default" />
      {/* temp view so I don't keep making requests to Google Maps */}
      {/* <View
        style={[
          styles.map,
          // eslint-disable-next-line react-native/no-inline-styles
          {
            backgroundColor: 'grey',
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}>
        <Text>Map goes here</Text>
      </View> */}
      <MapView
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        region={region}
        onRegionChangeComplete={(region) => {
          setRegion(region);
          console.log("onRegionChangeComplete completed")
        }}
      >
        {carparks.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.latlng}
            title={marker.title}
            onCalloutPress={() => alert("pressed " + marker.title)}
          >
            <ImageBackground
              source={require('./images/marker.png')}
              style={{ width: 44, height: 44, justifyContent: 'center', alignItems: 'center' }}
            >
              <Text style={{ paddingBottom: 10, color: 'white' }}>{index + 1}</Text>
            </ImageBackground>
          </Marker>
        ))}
        {specificLocation.active &&
          <Marker
            coordinate={specificLocation.latlng}
            title={specificLocation.title}
          >
            <Image
              source={require('./images/pin.png')}
              style={{ width: 44, height: 44 }}
            />
          </Marker>
        }
      </MapView>

      <View style={styles.refreshButtonContainer}>
        <Pressable
          android_ripple={{ color: 'lightgrey' }}
          style={styles.refreshPressable}
          onPress={() => updateCarparkMarkers({ region, callback: setCarparks })}
        >
          <Image source={require('./images/refresh.png')} style={styles.refreshButton}/>
        </Pressable>        
      </View>

      <View style={styles.menu}>
        {/* pass update state functions to child components so they can update on behalf of this component */}
        <BottomDisplay
          setRegion={setRegion}
          setSpecificLocation={setSpecificLocation}
          carparks={carparks}
          removeFavourite = {removeFavourite}
          addFavourite = {addFavourite}
          favourites={favourites}
          currentRegion={region}
        />
      </View>
    </View>
  );
}
