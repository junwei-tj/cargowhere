import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ImageBackground,
  ToastAndroid,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import NetInfo from "@react-native-community/netinfo";

// import components
import CarparkMarker from './components/CarparkMarker';
import StatusBar from './components/StatusBar';

// import screens
import { BottomDisplay, SearchScreen, LoadingScreen, NoInternetScreen } from './screens' 

// import managers
import carparkData from './managers/DataManager';
import { getCarparks, filterCarparksJSON, sortCarparks } from './managers/CarparksManager';

// import redux stuff
import {useSelector, useDispatch} from 'react-redux';
import {setCarparks} from './redux/carparksSlice';
import {setAvailability} from './redux/availabilitySlice';
import {setRegion} from './redux/regionSlice';
import {setSpecificLocation} from './redux/specificLocationSlice';
import LocationEnabler from "react-native-location-enabler";
import AwesomeAlert from 'react-native-awesome-alerts';
import {setAlert, setMessage} from './redux/alertSlice';

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
  searchContainer: {
    top: 10,
    left: 10,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: '12%',
    width: '70%',
  },
  refreshButtonContainer: {
    width: 36,
    height: 36,
    position: 'absolute',
    top: 28,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 18,
    borderColor: 'lightgrey',
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orientateButtonContainer: {
    width: 36,
    height: 36,
    position: 'absolute',
    top: 28,
    right: 52,
    backgroundColor: 'white',
    borderRadius: 18,
    borderColor: 'lightgrey',
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
    tintColor: 'grey',
  },
  pin: {
    width: 44,
    height: 44,
  },
});

export default function App() {
  // initialise states
  const region = useSelector((state) => state.region);
  const carparks = useSelector((state) => state.carparks.carparksData);
  const specificLocation = useSelector((state) => state.specificLocation);
  const sortCriteria = useSelector((state) => state.sortCriteria.criteria);
  const availability = useSelector(
    (state) => state.availability.availabilityData,
  );
  const alertState = useSelector((state) => state.alert);
  const [isLoading, setIsLoading] = useState(true);
  const maxCarparks = useSelector((state) => state.maxCarparks.limit)
  const dispatch = useDispatch();
  const [isConnected, setIsConnected] = useState(false);

  /**
   * Function to update if the User is connected to the Internet
   */
  const checkNetworkConnected = () => {
    NetInfo.fetch().then(state => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
      setIsConnected(state.isConnected);
    });
  };
  
  /**
   * Function to obtain the User's current location using GPS
   */
  function currentLocation() {

    // settings for LocationEnabler
    const {
      PRIORITIES: { HIGH_ACCURACY },
      checkSettings,
      requestResolutionSettings,
    } = LocationEnabler
    
    // Define configuration for GPS settings
    const config = {
      priority: HIGH_ACCURACY, // default BALANCED_POWER_ACCURACY
      alwaysShow: true, // default false
      needBle: false, // default false
    };
    
    // Check if location is enabled or not
    checkSettings(config);
    
    // If location is disabled, prompt the user to turn on device location
    requestResolutionSettings(config);

    // Get coordinates of user's current position
    Geolocation.getCurrentPosition(info => {
      console.log(info);
      let currentRegion = {
        latitude: info.coords.latitude,
        longitude: info.coords.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      };
      let currentLocationMarker = {
        latlng: {
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        },
        title: 'Current Location',
      };
      // Update coordinates for current location and for the marker
      dispatch(setRegion(currentRegion));
      dispatch(setSpecificLocation(currentLocationMarker));
      },
      error => console.log('Error: ' + JSON.stringify(error)), // error message
      );
  }

  useEffect(() => {
    checkNetworkConnected();
    currentLocation();
  }, []);

  useEffect(() => {
    carparkData.updateCarparkStaticData();
    setTimeout(() => {
      setIsLoading(false);
      console.log('Unmounting loading screen..');
    }, 2500);
  }, []);

  useEffect(() => {
    carparkData
      .updateAvailabilityData()
      .then((data) => dispatch(setAvailability(data)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carparks]);

  /**
   * Function to handle the what carparks are to be displayed on the map
   */
  const refreshCarparks = () => {
    ToastAndroid.show('Updating carpark markers...', ToastAndroid.SHORT);
    let carparkList = getCarparks(region);

    if (carparkList.length === 0) {
      dispatch(setAlert(true));
      dispatch(setMessage("No carparks found in the vicinity!"));
    }
    
    let carparkObjs = filterCarparksJSON(carparkList, specificLocation.latlng);
    let sorted = sortCarparks(carparkObjs, availability, sortCriteria);
    dispatch(setCarparks(sorted));
    ToastAndroid.show('Carpark markers updated', ToastAndroid.SHORT);
  }

  /**
   * Callback function when sorting criteria is changed by the user
   * @param {sortCriteria} newSortCriteria 
   */
  const sortCriteriaChanged = (newSortCriteria) => {
    let sorted = sortCarparks([...carparks], availability, newSortCriteria);
    dispatch(setCarparks(sorted));
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        !isConnected ? (<NoInternetScreen />) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>
            <StatusBar backgroundColor="#2EBD6B" barStyle="default" />
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              region={region}
              onRegionChangeComplete={(region) => {
                dispatch(setRegion(region)); // update current map region
              }}>                
              {/* render carpark markers */}
              {carparks.map((carpark, index) => {
                if (index < maxCarparks) {
                  return (
                    <CarparkMarker
                      carpark={carpark}
                      index={index}
                      key={index}
                    />
                  );
                }
              })}
              {/* display a pin for specificLocation, if it is set */}
              {specificLocation && (
                <Marker
                  tracksViewChanges={true}
                  key={specificLocation.title}
                  coordinate={specificLocation.latlng}
                  title={specificLocation.title}>
                  <Image
                    source={require('./images/pin.png')}
                    style={styles.pin}
                  />
                </Marker>
              )}
            </MapView>

            <View style={styles.searchContainer}>
              <SearchScreen />
            </View>

            <View style={styles.refreshButtonContainer}>
              <Pressable
                android_ripple={{color: 'lightgrey'}}
                style={styles.refreshPressable}
                onPress={() => refreshCarparks()}>
                <Image
                  source={require('./images/refresh.png')}
                  style={styles.refreshButton}
                />
              </Pressable>
            </View>

            <View style={styles.orientateButtonContainer}>
              <Pressable
                android_ripple={{color: 'lightgrey'}}
                style={styles.refreshPressable}
                onPress={() => {
                  currentLocation();
                }}>
                <Image
                  source={require('./images/mylocationAndroid.png')}
                  style={styles.refreshButton}
                />
              </Pressable>
            </View>

            <View style={styles.menu}>
              <BottomDisplay
                sortCriteriaChanged={sortCriteriaChanged} // for NearbyScreen
              />
            </View>

            <AwesomeAlert
              show={alertState.alertData}
              showProgress={false}
              message={alertState.alertMessage}
              closeOnTouchOutside={true}
              closeOnHardwareBackPress={false}
              showCancelButton={false}
              showConfirmButton={true}
              confirmText="Ok :("
              confirmButtonColor="#0c39ed"
              onConfirmPressed={() => dispatch(setAlert(false))}
            />
          </View>
        </TouchableWithoutFeedback>
      ))}
    </>
  );
}
