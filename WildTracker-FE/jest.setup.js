import 'react-native-gesture-handler/jestSetup';
import 'react-native-reanimated/mock';

// Mock `expo-haptics`
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));
