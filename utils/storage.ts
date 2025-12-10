import AsyncStorage from '@react-native-async-storage/async-storage';
import {User} from '../types';

const STORAGE_KEYS = {
  USER: '@perpustakaan:user',
  FAVORITES: '@perpustakaan:favorites',
  BORROWINGS: '@perpustakaan:borrowings',
  THEME: '@perpustakaan:theme',
  LANGUAGE: '@perpustakaan:language',
};

export const storage = {
  // User/Profile
  async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  },

  async getUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  async getAllUsers(): Promise<User[]> {
    try {
      const usersJson = await AsyncStorage.getItem('@perpustakaan:all_users');
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  },

  async registerUser(user: User): Promise<void> {
    try {
      const users = await this.getAllUsers();
      // Check if email already exists
      if (users.find(u => u.email === user.email)) {
        throw new Error('Email sudah terdaftar');
      }
      users.push(user);
      await AsyncStorage.setItem('@perpustakaan:all_users', JSON.stringify(users));
      // Don't save as current user - user needs to login first
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const users = await this.getAllUsers();
      return users.find(u => u.email === email) || null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  },

  async removeUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Error removing user:', error);
    }
  },

  // Favorites
  async getFavorites(): Promise<number[]> {
    try {
      const favoritesJson = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      return favoritesJson ? JSON.parse(favoritesJson) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  },

  async addFavorite(bookId: number): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      if (!favorites.includes(bookId)) {
        favorites.push(bookId);
        await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  },

  async removeFavorite(bookId: number): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const filtered = favorites.filter(id => id !== bookId);
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  },

  // Borrowings
  async getBorrowings(): Promise<any[]> {
    try {
      const borrowingsJson = await AsyncStorage.getItem(STORAGE_KEYS.BORROWINGS);
      return borrowingsJson ? JSON.parse(borrowingsJson) : [];
    } catch (error) {
      console.error('Error getting borrowings:', error);
      return [];
    }
  },

  async addBorrowing(borrowing: any): Promise<void> {
    try {
      const borrowings = await this.getBorrowings();
      borrowings.push(borrowing);
      await AsyncStorage.setItem(STORAGE_KEYS.BORROWINGS, JSON.stringify(borrowings));
    } catch (error) {
      console.error('Error adding borrowing:', error);
    }
  },

  // Settings
  async getTheme(): Promise<'light' | 'dark' | 'auto'> {
    try {
      const theme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
      return (theme as 'light' | 'dark' | 'auto') || 'auto';
    } catch (error) {
      console.error('Error getting theme:', error);
      return 'auto';
    }
  },

  async setTheme(theme: 'light' | 'dark' | 'auto'): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (error) {
      console.error('Error setting theme:', error);
    }
  },

  async getLanguage(): Promise<'id' | 'en'> {
    try {
      const language = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE);
      return (language as 'id' | 'en') || 'id';
    } catch (error) {
      console.error('Error getting language:', error);
      return 'id';
    }
  },

  async setLanguage(language: 'id' | 'en'): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
    } catch (error) {
      console.error('Error setting language:', error);
    }
  },
};

