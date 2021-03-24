/**
 * @format
 */
import React from 'react';
import AboutScreen from '../screens/AboutScreen';
import Carpark from '../screens/Carpark';
import DetailedView from '../screens/DetailedView';
import Favourite from '../screens/Favourite';
import FavouritesScreen from '../screens/FavouritesScreen';
import NearbyScreen from '../screens/NearbyScreen';
import SearchScreen from '../screens/SearchScreen';

import {Provider} from 'react-redux';
import store from '../redux/store';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

/*
let outputData = '';
var storeLog = (inputs) => (outputData += inputs);
console['log'] = jest.fn(storeLog);
console['error'] = jest.fn(storeLog);
These lines of code are so that Jest doesn't throw an error 
when the components attempt to console.log() or console.error(),
especially when there are async functions that will console.log or console.error
after Jest is done testing that it renders correctly
*/

it('AboutScreen renders correctly', () => {
  let outputData = '';
  var storeLog = (inputs) => (outputData += inputs);
  console.log = jest.fn(storeLog);
  console.error = jest.fn(storeLog);
  const tree = renderer.create(<AboutScreen />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('Carpark renders correctly', () => {
  let outputData = '';
  var storeLog = (inputs) => (outputData += inputs);
  console.log = jest.fn(storeLog);
  console.error = jest.fn(storeLog);

  var currentRegion = {
    longitude: 0,
    latitude: 0,
  };
  var latlng = {
    longitude: 0,
    latitude: 0,
  };
  var carpark = {latlng};

  const tree = renderer
    .create(
      <Provider store={store}>
        <Carpark
          currentRegion={currentRegion}
          carpark={carpark}
          press={jest.fn()}
        />
      </Provider>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('DetailedView renders correctly', () => {
  let outputData = '';
  var storeLog = (inputs) => (outputData += inputs);
  console.log = jest.fn(storeLog);
  console.error = jest.fn(storeLog);
  const tree = renderer
    .create(
      <Provider store={store}>
        <DetailedView />
      </Provider>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('Favourite renders correctly', () => {
  let outputData = '';
  var storeLog = (inputs) => (outputData += inputs);
  console.log = jest.fn(storeLog);
  console.error = jest.fn(storeLog);

  var favourite = [];
  const tree = renderer
    .create(
      <Provider store={store}>
        <Favourite favourite={favourite} press={jest.fn()} />
      </Provider>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('FavouritesScreen renders correctly', () => {
  let outputData = '';
  var storeLog = (inputs) => (outputData += inputs);
  console.log = jest.fn(storeLog);
  console.error = jest.fn(storeLog);
  const tree = renderer
    .create(
      <Provider store={store}>
        <FavouritesScreen />
      </Provider>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('NearbyScreen renders correctly', () => {
  let outputData = '';
  var storeLog = (inputs) => (outputData += inputs);
  console.log = jest.fn(storeLog);
  console.error = jest.fn(storeLog);
  const tree = renderer
    .create(
      <Provider store={store}>
        <NearbyScreen />
      </Provider>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('SearchScreen renders correctly', () => {
  let outputData = '';
  var storeLog = (inputs) => (outputData += inputs);
  console.log = jest.fn(storeLog);
  console.error = jest.fn(storeLog);
  const tree = renderer
    .create(
      <Provider store={store}>
        <SearchScreen />
      </Provider>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
