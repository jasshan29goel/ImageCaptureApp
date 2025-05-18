import Constants from 'expo-constants';
import { initializeApp } from 'firebase/app';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { Platform } from 'react-native';
import { generateKeyPair } from './crypto';

const extra = Constants.expoConfig?.extra;

// Platform-specific config
const firebaseConfig = {
  apiKey: Platform.OS === 'android' ? extra?.FIREBASE_ANDROID_API_KEY : extra?.FIREBASE_IOS_API_KEY,
  authDomain: `${extra?.FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: extra?.FIREBASE_PROJECT_ID,
  storageBucket: extra?.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: Platform.OS === 'android'
    ? extra?.FIREBASE_ANDROID_MESSAGING_SENDER_ID
    : extra?.FIREBASE_IOS_MESSAGING_SENDER_ID,
  appId: Platform.OS === 'android' ? extra?.FIREBASE_ANDROID_APP_ID : extra?.FIREBASE_IOS_APP_ID,
  measurementId: extra?.FIREBASE_MEASUREMENT_ID || undefined,
};

console.log('[Firebase] App ID:', firebaseConfig.appId);

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Initialize and store public key in Firestore
export async function initializeKeys(keyTag: string): Promise<void> {
  const docRef = doc(db, 'public_keys', keyTag);
  const existingDoc = await getDoc(docRef);

  if (!existingDoc.exists()) {
    const publicKey = await generateKeyPair(keyTag);

    await setDoc(docRef, {
      publicKey,
      createdAt: new Date().toISOString(),
    });
  }
}
