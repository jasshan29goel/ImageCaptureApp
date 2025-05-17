import { initializeApp } from 'firebase/app';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { RSAKeychain } from 'react-native-rsa-native';

const firebaseConfig = {
  apiKey: "AIzaSyATjhOhWDYryn77-V9QICl1n2SeyQWkW9c",
  authDomain: "imagesigndatabase.firebaseapp.com",
  projectId: "imagesigndatabase",
  storageBucket: "imagesigndatabase.appspot.com",
  messagingSenderId: "714400965699",
  appId: "1:714400965699:web:729dfde0662f37caff60f6",
  measurementId: "G-4GF9N3GE10"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Firestore instance
export const db = getFirestore(app);

// Generate a new RSA key pair
export async function generateKeyPair(keyTag: string): Promise<string> {
  const keys = await RSAKeychain.generate(keyTag);
  return keys.public;
}

/**
 * Initialize and store public key in Firestore
 *
 * @param keyTag the key tag of the image
 */
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
