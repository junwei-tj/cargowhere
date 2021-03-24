/**
 * @format
 */
import React from 'react';
import BottomDisplay from '../BottomDisplay';

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

it('BottomDisplay renders correctly', () => {
  let outputData = '';
  var storeLog = (inputs) => (outputData += inputs);
  console.log = jest.fn(storeLog);
  console.error = jest.fn(storeLog);
  const tree = renderer
    .create(
      <Provider store={store}>
        <BottomDisplay />
      </Provider>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
