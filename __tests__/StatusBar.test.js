/**
 * @format
 */
import React from 'react';
import StatusBar from '../StatusBar';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('StatusBar renders correctly', () => {
  const tree = renderer.create(<StatusBar />).toJSON();
  expect(tree).toMatchSnapshot();
});
