import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TextInput,
  Pressable,
  Keyboard,
  Text,
  FlatList,
  Animated,
  Alert
} from 'react-native';
import {Overlay} from 'react-native-elements';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setLatlng } from '../redux/regionSlice';
import { setSpecificLocation } from '../redux/specificLocationSlice';
import {setAlert, setMessage} from '../redux/alertSlice';

/**
 * @module SearchScreen
 * */

const styles = StyleSheet.create({
  resultsContainer: {
    width:'80%',
    height:'80%',
    padding: 0,
    borderRadius: 20,
    borderColor: 'lightgrey',
    borderWidth: 3,
    borderStyle: 'solid',
    overflow: 'hidden',
  },
  searchContainer: {
    flex: 1,
  },
  infoContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    flexWrap: 'wrap',
    padding: 10,
  },
  searchField: {
    width: '100%',
    flexDirection:'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 50,
    padding: 3,
    paddingLeft: 20,
    paddingRight: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 20,
    borderColor: 'lightgrey',
    backgroundColor: 'white',
    margin: 10,
  },
  name: {
    fontSize: 15,
    color: '#494949',
  },
  address: {
    fontSize: 12,
    color: '#231213',
  },
  inputStyle: {
    width: '90%',
    alignItems:'flex-start',
  },
  headerIcon: {
    position: 'absolute',
    right: 5,
    width: 25,
    height: 25,
    padding: 10,
    paddingBottom: 25,
    paddingLeft: 20,
    resizeMode: 'stretch',
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
  },
  icon: {
    width: 15,
    height: 15,
    tintColor: 'grey',
  },
  searchOverlay: {
    paddingTop: 20,
    paddingBottom:20,
    marginBottom: 10,
  },
  header: {
    borderBottomWidth: 1,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomColor: '#eee',
    marginTop:-20,
    backgroundColor: '#eee'
  },
  headerText: {
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    fontWeight: "bold",
  },
  overlay:{
    //flex:1
  },
});



export default function SearchScreen(props) {
  const [searchValue, setSearchValue] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const [results, setResults] = React.useState([]);
  const dispatch = useDispatch();
  let itemNames = [];
  let addresses = [];

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  /**
   * Queries TomTom Search API with the search term. Returns an array of location objects relevant to the search term
   * @name getLocation
   * @async
   * @param {string} queryTerm - search term
   * @returns {Array} array of location objects
   */
  async function getLocation(queryTerm) {
    var tomtomBaseUrl = 'https://api.tomtom.com/search/2/search/';
    var params = {
      key: 'i4wG1tT0cG0IPTnu7wRGJXkjsK2lNcxU',
      countrySet: 'SG',
    };
    var queryURL = tomtomBaseUrl + encodeURIComponent(queryTerm) + '.json';

    try {
      var response = await axios.get(queryURL, {params: params});
    } catch (error) {
      throw error;
    }

    var results = response.data.results;
    if (results.length > 0) {
      return results;
    } else {
      return [];
    }
  }

   /**
   * Pass the search term to TomTom Search API and receives the results of the search
   * @name onSubmitSearch
   * @function
   * @param {object} nativeEvent - Native object comprising of the search term
   */
  function onSubmitSearch({nativeEvent, ...rest}) {
    getLocation(nativeEvent.text).then((locations) => {
      if (locations.length !== 0) {
        setResults(locations);
        toggleOverlay();
      }
      else {
        dispatch(setAlert(true));
        dispatch(setMessage("No results found!"));
      }
    })
  }

   /**
   * Pass the coordinates of the selected location to StateUpdater for update
   * @name onSelectResult
   * @function
   * @param {object} location - Object that contains information e.g coordinates, address etc. of the location
   */
  function onSelectResult(location){
      console.log(location.position);
      console.log(location.address);
      // update map view
      dispatch(setLatlng({
        latitude: location.position.lat,
        longitude: location.position.lon,
      }));
      dispatch(setSpecificLocation({
        latlng: {
          latitude: location.position.lat,
          longitude: location.position.lon,
        },
        title: location.type === "POI" ? location.poi.name : location.address.freeformAddress,
      }));
      toggleOverlay();
  }
  
  return (
      <View style={styles.searchContainer}>
          <View style={styles.searchField}>
              <TextInput
                editable
                style={styles.inputStyle}
                placeholder={'Search...'}
                value={searchValue}
                onChangeText={(text) => setSearchValue(text)}
                onSubmitEditing={onSubmitSearch}
                returnKeyType = {"search"}
              />
              <Pressable
                  style={styles.headerIcon}
                  onPress={() => {
                    setSearchValue('');
                    Keyboard.dismiss();
                  }}>
                <Image
                    style={styles.icon}
                    source={require('../images/cross.png')}
                />
              </Pressable>
          </View>
          <View style = {styles.overlay}>
             <Overlay isVisible={visible} overlayStyle = {styles.resultsContainer}>
               <Animated.View style={styles.searchOverlay}>
                 <View style={styles.header}>
                   <Text style={styles.headerText}>Search Results</Text>
                   <Pressable
                       style={styles.headerIcon}
                       onPress={toggleOverlay}>
                     <Image
                         style={styles.icon}
                         source={require('../images/cross.png')}
                     />
                   </Pressable>
                 </View>
                 <FlatList
                     data={results}
                     keyExtractor={(item, index) => index.toString()}
                     renderItem={({item, index}) => {
                       console.log(item);
                       if(item.type === "POI") {
                         if (itemNames.indexOf(item.poi.name) === -1 || addresses.indexOf(item.address.freeformAddress) === -1) {
                           itemNames.push(item.poi.name);
                           addresses.push(item.address.freeformAddress)
                           console.log(itemNames);
                           return (
                               <Pressable onPress={() => {
                                 onSelectResult(item);
                               }}>
                                 <View style={styles.infoContainer}>
                                   <Text style={styles.name}>{item.poi.name}</Text>
                                   <Text style={styles.address}>{item.address.freeformAddress}</Text>
                                 </View>
                               </Pressable>
                           )
                         }
                       }
                       else{
                         return (
                             <Pressable onPress={() => {
                               onSelectResult(item);
                             }}>
                               <View style={styles.infoContainer}>
                                 <Text style={styles.name}>{item.address.freeformAddress}</Text>
                               </View>
                             </Pressable>
                         )

                       }

                     }}
                 />
               </Animated.View>
            </Overlay>
          </View>
        </View>
  )
}
