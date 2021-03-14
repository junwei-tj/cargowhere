import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Pressable,
  Image,
  Button,
} from 'react-native';
import carparkData from '../DataManager';

const styles = StyleSheet.create({
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
    paddingVertical: 5,
  },
  bodyTextFirstLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bodyTitle: {
    marginTop: 2,
    textDecorationLine: 'underline',
  },
  bodyNormal: {},
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 5,
    paddingHorizontal: 30,
    borderTopWidth: 1,
  },
  button: {
    width: 100,
  },
});

export default function DetailedView(props) {
  const [cp, setCp] = useState(null);

  // to get full carpark info
  useEffect(() => {
    var temp = carparkData._carparksData.filter((val) => {
      return val.name.trim() === props.selectedCarpark.title.trim();
    });
    setCp(temp[0]);
  }, [props.selectedCarpark]);

  return (
    <>
      {cp && (
        <>
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
            <View style={styles.bodyTextFirstLine}>
              <Text>Agency: {cp.agency}</Text>
              <Text>Car Available Lots: {cp.availableLots_car}</Text>
            </View>
            {/* for hdb carpark */}
            {cp.agency === 'HDB' && (
              <>
                <Text style={styles.bodyTitle}>Type: </Text>
                <Text style={styles.bodyNormal}>
                  {cp.hdbFields.car_park_type}
                </Text>
                <Text style={styles.bodyTitle}>Short Term Parking: </Text>
                <Text style={styles.bodyNormal}>
                  {cp.hdbFields.short_term_parking}
                </Text>
                <Text style={styles.bodyTitle}>Free Parking: </Text>
                <Text style={styles.bodyNormal}>
                  {cp.hdbFields.free_parking}
                </Text>
                <Text style={styles.bodyTitle}>Night Parking: </Text>
                <Text style={styles.bodyNormal}>
                  {cp.hdbFields.night_parking}
                </Text>
                <Text style={styles.bodyTitle}>System: </Text>
                <Text style={styles.bodyNormal}>
                  {cp.hdbFields.type_of_parking_system}
                </Text>
              </>
            )}
            {/* for ura carpark */}
            {cp.agency === 'URA' && (
              <>
                <Text style={styles.bodyTitle}>Weekday Rate:</Text>
                <Text style={styles.bodyNormal}>
                  {cp.uraFields.weekdayRate}/{cp.uraFields.weekdayMin}
                </Text>
                <Text style={styles.bodyTitle}>Saturday Rate:</Text>
                <Text style={styles.bodyNormal}>
                  {cp.uraFields.satdayRate}/{cp.uraFields.satdayMin}
                </Text>
                <Text style={styles.bodyTitle}>
                  Sunday/Public Holiday Rate:
                </Text>
                <Text style={styles.bodyNormal}>
                  {cp.uraFields.sunPHRate}/{cp.uraFields.sunPHMin}
                </Text>
              </>
            )}
            {/* for lta carpark */}
            {cp.agency === 'LTA' && (
              <>
                <Text style={styles.bodyTitle}>Weekday Rate 1: </Text>
                <Text style={styles.bodyNormal}>
                  {cp.ltaFields.weekdays_rate_1}
                </Text>
                <Text style={styles.bodyTitle}>Weekday Rate 2: </Text>
                <Text style={styles.bodyNormal}>
                  {cp.ltaFields.weekdays_rate_2}
                </Text>
                <Text style={styles.bodyTitle}>Saturday: </Text>
                <Text style={styles.bodyNormal}>
                  {cp.ltaFields.saturday_rate}
                </Text>
                <Text style={styles.bodyTitle}>Sunday: </Text>
                <Text style={styles.bodyNormal}>
                  {cp.ltaFields.sunday_publicholiday_rate}
                </Text>
              </>
            )}
          </ScrollView>
          <View style={styles.footer}>
            <Button
              style={styles.button}
              title="GO"
              onPress={() => console.log('go')}
            />
          </View>
        </>
      )}
    </>
  );
}