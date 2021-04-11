import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Pressable,
  Image,
  Button,
  Linking,
  Platform,
} from 'react-native';
import DataManager from '../managers/DataManager';
import {useSelector} from 'react-redux';

/**
 * @module DetailedView
 * */

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
  },
  header: {
    borderBottomColor: '#eee',
    flexDirection: 'row',
    backgroundColor: '#eee',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 16,
    paddingTop: 10,
    paddingLeft: 20,
    paddingBottom: 10,
    width: '90%',
  },
  headerIcon: {
    width: '10%',
    paddingRight: 20,
  },
  icon: {
    width: 15,
    height: 15,
    tintColor: 'grey',
  },
  bodyView: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 40,
  },
  bodyGridTop: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  bodyGridRow: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    borderColor: 'grey',
    padding: 5,
    borderWidth: 1,
    margin: -0.5,
  },
  bodyTitle: {
    width: '35%',
  },
  bodyNormal: {
    width: '65%',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 5,
    paddingHorizontal: 30,
    borderTopWidth: 1,
  },
  button: {
    width: '20%',
  },
  favouritesButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default function DetailedView(props) {
  const availability = useSelector(
    (state) => state.availability.availabilityData,
  );
  const [cp, setCp] = useState(null);
  const [availableNum, setAvailableNum] = React.useState('--');

  React.useEffect(() => {
    if (
      props.selectedCarpark &&
      availability[props.selectedCarpark.identifier]
    ) {
      setAvailableNum(
        availability[props.selectedCarpark.identifier].availableLots_car,
      );
    } else {
      setAvailableNum('--');
    }
  }, [availability, props.selectedCarpark]);

  // to get full carpark info
  useEffect(() => {
    if (props.selectedCarpark) {
      var temp = DataManager._carparksData.filter((val) => {
        return val.name.trim() === props.selectedCarpark.title.trim();
      });
      setCp(temp[0]);
    }
  }, [props.selectedCarpark]);


  
  /**
   * Opens Google Maps for navigation to the selected carpark.
   * Google Maps will be preloaded with the coordinates of the selected carpark.
   * @name openMap 
   * @function
   */
  function openMap() {
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latlng = `${cp.latitude},${cp.longitude}`;
    const url = Platform.select({
      ios: `${scheme}@${latlng}`,
      android: `${scheme}@${latlng}`,
    });
    Linking.openURL(url);
  }

  return (
    <>
      {cp && (
        <View style={styles.rootView} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <Text style={styles.headerText}>
              {props.selectedCarpark.title} {cp.code ? `(${cp.code})` : ''}
            </Text>
            <Pressable
              style={styles.headerIcon}
              onPress={props.backFromDetailedView}>
              <Image
                style={styles.icon}
                source={require('../images/cross.png')}
              />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.bodyView}>
            <View style={styles.bodyGridTop}>
              <View>
                <Text>Distance:</Text>
                <Text>{props.selectedCarpark.distance.toFixed(0)}m away</Text>
              </View>
              <View>
                <Text>Agency:</Text>
                <Text>{cp.agency}</Text>
              </View>
              <View>
                <Text>Car Available Lots: </Text>
                <Text>{availableNum}</Text>
              </View>
            </View>
            <Text>Details:</Text>
            {/* for hdb carpark */}
            {cp.agency === 'HDB' && (
              <>
                <View style={styles.bodyGridRow}>
                  <Text style={styles.bodyTitle}>Short Term Parking</Text>
                  <Text style={styles.bodyNormal}>
                    {cp.hdbFields.short_term_parking}
                  </Text>
                </View>

                <View style={styles.bodyGridRow}>
                  <Text style={styles.bodyTitle}>Free Parking</Text>
                  <Text style={styles.bodyNormal}>
                    {cp.hdbFields.free_parking}
                  </Text>
                </View>

                <View style={styles.bodyGridRow}>
                  <Text style={styles.bodyTitle}>Night Parking</Text>
                  <Text style={styles.bodyNormal}>
                    {cp.hdbFields.night_parking}
                  </Text>
                </View>

                <View style={styles.bodyGridRow}>
                  <Text style={styles.bodyTitle}>Type</Text>
                  <Text style={styles.bodyNormal}>
                    {cp.hdbFields.car_park_type}
                  </Text>
                </View>

                <View style={styles.bodyGridRow}>
                  <Text style={styles.bodyTitle}>System</Text>
                  <Text style={styles.bodyNormal}>
                    {cp.hdbFields.type_of_parking_system}
                  </Text>
                </View>
              </>
            )}
            {/* for ura carpark */}
            {cp.agency === 'URA' && (
              <>
                <View style={styles.bodyGridRow}>
                  <Text style={styles.bodyTitle}>Weekday Rate</Text>
                  <Text style={styles.bodyNormal}>
                    {cp.uraFields.weekdayRate}/{cp.uraFields.weekdayMin}
                  </Text>
                </View>
                <View style={styles.bodyGridRow}>
                  <Text style={styles.bodyTitle}>Saturday Rate</Text>
                  <Text style={styles.bodyNormal}>
                    {cp.uraFields.satdayRate}/{cp.uraFields.satdayMin}
                  </Text>
                </View>
                <View style={styles.bodyGridRow}>
                  <Text style={styles.bodyTitle}>
                    Sunday/Public Holiday Rate
                  </Text>
                  <Text style={styles.bodyNormal}>
                    {cp.uraFields.sunPHRate}/{cp.uraFields.sunPHMin}
                  </Text>
                </View>
              </>
            )}
            {/* for lta carpark */}
            {cp.agency === 'LTA' && (
              <>
                <View style={styles.bodyGridRow}>
                  <Text style={styles.bodyTitle}>Weekday Rate 1</Text>
                  <Text style={styles.bodyNormal}>
                    {cp.ltaFields.weekdays_rate_1}
                  </Text>
                </View>

                <View style={styles.bodyGridRow}>
                  <Text style={styles.bodyTitle}>Weekday Rate 2</Text>
                  <Text style={styles.bodyNormal}>
                    {cp.ltaFields.weekdays_rate_2}
                  </Text>
                </View>

                <View style={styles.bodyGridRow}>
                  <Text style={styles.bodyTitle}>Saturday</Text>
                  <Text style={styles.bodyNormal}>
                    {cp.ltaFields.saturday_rate}
                  </Text>
                </View>

                <View style={styles.bodyGridRow}>
                  <Text style={styles.bodyTitle}>Sunday</Text>
                  <Text style={styles.bodyNormal}>
                    {cp.ltaFields.sunday_publicholiday_rate}
                  </Text>
                </View>
              </>
            )}
          </ScrollView>
          <View style={styles.footer}>
            <View style={styles.button}>
              <Button color="#00B3A6" title="GO" onPress={openMap} />
            </View>
          </View>
        </View>
      )}
    </>
  );
}
