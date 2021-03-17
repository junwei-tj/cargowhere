/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import {decode, encode} from 'base-64';

import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

import carparkData from './DataManager';
// here so that it only runs once when app is started instead of when App.js is rendered
carparkData.retrieveCarparkStaticData();

const AppWithRedux = () => (
  <Provider store={store}>
    <App />
  </Provider>
)

AppRegistry.registerComponent(appName, () => AppWithRedux);
