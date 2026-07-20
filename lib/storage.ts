import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Type-safe storage abstraction over AsyncStorage.
 * Works on iOS, Android, and Web.
 */
export const storage = {
  async get<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const raw = await AsyncStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage write failed silently
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // Storage remove failed silently
    }
  },
};
