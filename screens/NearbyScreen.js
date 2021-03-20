import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Carpark from './Carpark';
import DetailedView from './DetailedView';
import { MAX_CARPARKS_TO_DISPLAY } from '../constants/carparkConstants';

import { useSelector, useDispatch } from 'react-redux';
import { setSortCriteria } from '../redux/sortCriteriaSlice';
import { SORT_BY_DISTANCE, SORT_BY_AVAILABILITY } from '../constants/sortCriteriaConstants';
import { setLatlng } from '../redux/regionSlice';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    backgroundColor: '#eee',
  },
  sortBy: {
    fontSize: 20,
    paddingTop: 10,
    textAlign: 'right',
    flex: 1,
  },
  headerText: {
    fontSize: 20,
    paddingTop: 10,
    paddingLeft: 20,
    textDecorationLine: 'underline',
  },
  picker: {
    width: '43%',
    color: 'black',
  },
  normalView: {
    left: '0%',
    height: '100%',
  },
  detailedView: {
    position: 'absolute',
    bottom: 0,
    left: '100%',
    height: '100%',
    width: '100%',
  },
});

const screenWidth = Math.round(Dimensions.get('window').width);

export default function NearbyScreen(props) {
  //const [value, setValue] = useState('key0');
  const sortCriteria = useSelector(state => state.sortCriteria.criteria);
  const specificLocation = useSelector(state => state.specificLocation);

  const transformXValue = React.useRef(new Animated.Value(0)).current;
  const [selectedCarpark, setSelectedCarpark] = useState(null);

  const carparks = useSelector(state => state.carparks.carparksData);
  const region = useSelector(state => state.region);

  const dispatch = useDispatch();

  const goToDetailedView = (carpark) => () => {
    setSelectedCarpark(carpark);
    // changing the value to make sliding left animation
    Animated.timing(transformXValue, {
      toValue: -screenWidth,
      duration: 200,
      useNativeDriver: true,
    }).start();
    // on click, move map to center that carpark
    dispatch(setLatlng({
      latitude: carpark.latlng.latitude,
      longitude: carpark.latlng.longitude,
    }))
    // props.setRegion((prev) => ({
    //   ...prev,
    //   latitude: carpark.latlng.latitude,
    //   longitude: carpark.latlng.longitude,
    // }));
  };

  function backFromDetailedView() {
    // changing the value to make sliding right animation
    Animated.timing(transformXValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }

  useEffect(() => {}, []);

  return (
    <View style={styles.container}>
      {/* <Text>Nearby Screen</Text> */}
      {/* Need key extractor also*/}
      <Animated.View
        style={[
          styles.normalView,
          {transform: [{translateX: transformXValue}]},
        ]}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Nearby</Text>
          <Text style={styles.sortBy}>Sort By:</Text>
          <Picker
            style={styles.picker}
            selectedValue={sortCriteria}
            onValueChange={(itemValue, itemIndex) => {
              dispatch(setSortCriteria(itemValue));
              props.pickerCallback(itemValue);              
            }}>
            <Picker.Item label="Distance" value={SORT_BY_DISTANCE} />
            <Picker.Item label="Availability" value={SORT_BY_AVAILABILITY} />
          </Picker>
        </View>
        {/* <FlatList data={Array(9).fill(0)} renderItem={() => <Carpark />} /> */}
        <FlatList
          data={carparks.slice(0, MAX_CARPARKS_TO_DISPLAY)}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => {
            return (
              <Carpark
                carpark={item}
                index={index}
                currentRegion={specificLocation.latlng}
                press={goToDetailedView}
              />
            );
          }}
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.detailedView,
          {transform: [{translateX: transformXValue}]},
        ]}>
        <DetailedView
          backFromDetailedView={backFromDetailedView}
          selectedCarpark={selectedCarpark}
        />
      </Animated.View>
    </View>
  );
}
