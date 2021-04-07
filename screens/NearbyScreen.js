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
import Carpark from '../components/Carpark';
import DetailedView from './DetailedView';
import {MAX_CARPARKS_TO_DISPLAY} from '../constants/carparkConstants';

import {useSelector, useDispatch} from 'react-redux';
import {setSortCriteria} from '../redux/sortCriteriaSlice';
import {
  SORT_BY_DISTANCE,
  SORT_BY_AVAILABILITY,
} from '../constants/sortCriteriaConstants';
import {setLatlng} from '../redux/regionSlice';
import { setMaxCarparks } from '../redux/maxCarparksSlice';
import CarparkContainer from '../components/Carpark';

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
  // sortBy: {
  //   fontSize: 20,
  //   paddingTop: 10,
  //   textAlign: 'right',
  //   flex: 1,
  // },
  headerText: {
    fontSize: 15,
    paddingTop: 14,
    paddingLeft: 20,
    fontWeight: 'bold'
  },
  limitPicker: {
    width: '25%',
    color: 'black',
  },
  sortByPicker: {
    width: '40%',
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
const MAX_ALLOWED_CARPARKS = 20;

export default function NearbyScreen(props) {
  // const [value, setValue] = useState('key0');
  const transformXValue = React.useRef(new Animated.Value(0)).current;
  const [selectedCarpark, setSelectedCarpark] = useState(null);

  const carparks = useSelector((state) => state.carparks.carparksData);
  const maxCarparks = useSelector((state) => state.maxCarparks.limit);
  const sortCriteria = useSelector((state) => state.sortCriteria.criteria);
  const specificLocation = useSelector((state) => state.specificLocation);

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
    dispatch(
      setLatlng({
        latitude: carpark.latlng.latitude,
        longitude: carpark.latlng.longitude,
      }),
    );
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
          <Text style={styles.headerText}>Limit:</Text>
          <Picker
            style={styles.limitPicker}
            selectedValue={maxCarparks}
            onValueChange={(itemValue) => {
              dispatch(setMaxCarparks(itemValue))
            }}>
            {new Array(MAX_ALLOWED_CARPARKS).fill(0).map((element, index) => {
              return (
              <Picker.Item label={""+(index+1)} value={index+1} key={index}/>
            )})}
          </Picker>
          <Text style={styles.headerText}>Sort By:</Text>
          <Picker
            style={styles.sortByPicker}
            selectedValue={sortCriteria}
            onValueChange={(itemValue) => {
              dispatch(setSortCriteria(itemValue));
              props.sortCriteriaChanged(itemValue)
            }}>
            <Picker.Item label="Distance" value={SORT_BY_DISTANCE} />
            <Picker.Item label="Availability" value={SORT_BY_AVAILABILITY} />
          </Picker>
        </View>
        <CarparkContainer
          press={goToDetailedView}
        />
        {/* <FlatList
          data={carparks.slice(0, maxCarparks)}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => {
            return (
              <CarparkContainer
                carpark={item}
                index={index}
                currentRegion={specificLocation.latlng}
                press={goToDetailedView}
              />
            );
          }}
        /> */}
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
