import React from 'react';
import { render } from '@testing-library/react-native';
import { HelloWave } from '../HelloWave';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  return {
    ...Reanimated,
    useSharedValue: jest.fn(() => ({ value: 0 })),
    useAnimatedStyle: jest.fn(() => ({})),
    withTiming: jest.fn(() => 0),
    withRepeat: jest.fn(() => 0),
    withSequence: jest.fn(() => 0),
  };
});

test('renders HelloWave component correctly', () => {
  const { getByText } = render(<HelloWave />);
  expect(getByText('👋')).toBeTruthy();
});

test('does not crash due to animation', () => {
    expect(() => render(<HelloWave />)).not.toThrow();
  });