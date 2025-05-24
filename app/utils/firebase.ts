import Constants from 'expo-constants';
import { initializeApp } from 'firebase/app';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { Platform } from 'react-native';
import { RSAKeychain } from 'react-native-rsa-native';

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


// Generate a new RSA key pair
export async function generateKeyPair(keyTag: string): Promise<string> {
  const keys = await RSAKeychain.generate(keyTag);
  return keys.public;
}

// Initialize and store public key in Firestore
export async function initializeKeys(keyTag: string): Promise<void> {
  console.log("I was here: " + keyTag);
  const docRef = doc(db, 'public_keys', keyTag);
  console.log("I was here 2");
  const existingDoc = await getDoc(docRef);
  console.log("I was here 3");
  if (!existingDoc.exists()) {
    console.log("I was ehre 4");
    const publicKey = await generateKeyPair(keyTag);
    console.log("I was here 5");
    await setDoc(docRef, {
      publicKey,
      createdAt: new Date().toISOString(),
    });
    console.log("I was here 6");
  }
}
