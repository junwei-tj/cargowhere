import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TextInput,
  Pressable,
  Keyboard,
  Text, FlatList, Animated, ImageBackground, TouchableOpacity
} from 'react-native';
import {ListItem, Overlay} from 'react-native-elements';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setLatlng } from '../redux/regionSlice';
import { setSpecificLocation } from '../redux/specificLocationSlice';
import {Picker} from "@react-native-picker/picker";
import {setSortCriteria} from "../redux/sortCriteriaSlice";
import {SORT_BY_AVAILABILITY, SORT_BY_DISTANCE} from "../constants/sortCriteriaConstants";
import {MAX_SEARCH_RESULTS} from "../constants/carparkConstants";
import Carpark from "../components/Carpark";

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
    flexWrap: 'wrap',
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
    textDecorationLine: 'underline',
  },
  overlay:{
    //flex:1
  },
});

export default function SearchScreen(props) {
  const [searchValue, setSearchValue] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  // const [location, setLocation] = React.useState(null);
  const [results, setResults] = React.useState([]);

  const carparks = useSelector(state => state.carparks.carparksData)
  const region = useSelector(state => state.region);
  const dispatch = useDispatch();

  const toggleOverlay = () => {
    setVisible(!visible);
  };


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
      var topResult = results[0];
      return results;
    } else {
      return [];
    }
  }

  function selectLocation(){
    setLocation()
  }

  function onSubmitSearch({nativeEvent, ...rest}) {
    getLocation(nativeEvent.text).then((locations) => {
      setResults(locations);
      toggleOverlay();
    })

      // props.setRegion((prevState) => ({
      //   ...prevState,
      //   latitude: location.position.lat,
      //   longitude: location.position.lon,
      // }));
      // props.setSpecificLocation({
      //   latlng: {
      //     latitude: location.position.lat,
      //     longitude: location.position.lon,
      //   },
      //   active: true,
      //   title: searchValue,
      // });
  }
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
                styles={styles.inputStyle}
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
                 {/* <FlatList data={Array(9).fill(0)} renderItem={() => <Carpark />} /> */}
                 <FlatList
                     data={results}
                     keyExtractor={(item, index) => index.toString()}
                     renderItem={({item, index}) => {
                       console.log(item);
                       if(item.type === "POI") {

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
