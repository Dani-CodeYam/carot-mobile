// AsyncStorage is a native module: importing it under jest throws unless it is
// mocked. The package ships its own in-memory mock, so any module that reaches
// storage transitively (lib/lang → lib/dailyCard → lib/storage) is importable
// in a test without every test file repeating a jest.mock.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
