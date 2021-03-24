/**
 * @format
 */

import 'react-native';
import React from 'react';
import index from '../index';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import {cleanup} from '@testing-library/react-native';

it('renders correctly', () => {
  let outputData = '';
  var storeLog = (inputs) => (outputData += inputs);
  console.log = jest.fn(storeLog);

  // this will cause the DataManager to get carpark data,
  // but we are not testing for that here.
  // So the above code is to workaround the error when DataManager
  // tries to console.log() something
  renderer.create(<index />);

  cleanup();
});
