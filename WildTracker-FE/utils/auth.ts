
// utils/auth.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, firestore } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export const storeUserData = async (user: any) => {
  try {
    const userDoc = await getDoc(doc(firestore, 'users', user.uid));
    const userData = userDoc.data();
    
    await AsyncStorage.setItem('user', JSON.stringify({
      uid: user.uid,
      email: user.email,
      ...userData
    }));
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};

export const getUserData = async () => {
  try {
    const userString = await AsyncStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export const removeUserData = async () => {
  try {
    await AsyncStorage.removeItem('user');
  } catch (error) {
    console.error('Error removing user data:', error);
  }
};