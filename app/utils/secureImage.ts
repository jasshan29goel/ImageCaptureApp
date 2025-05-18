import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { doc, getDoc } from 'firebase/firestore';
import { SECURE_IMAGE_EXTENSION } from '../constants/CommonConstants';
import { verifySignature } from './crypto';
import { db } from './firebase';

interface SecureImageObject {
  base64: string;
  KEY_TAG: string;
  signature: string;
}

/**
 * Saves a secure image file with embedded base64 content, key tag, and signature.
 * @param base64 The base64-encoded image.
 * @param signature Signature of the base64 content.
 * @param keyTag the key tag of the image.
 * @returns URI of the saved `.simg` file.
 */
export async function saveSecureImage(base64: string, signature: string, keyTag: string): Promise<string> {
  const fileName = `${keyTag}_${Date.now()}${SECURE_IMAGE_EXTENSION}`;

  const secureObject: SecureImageObject = {
    base64,
    KEY_TAG: keyTag,
    signature,
  };

  const data = JSON.stringify(secureObject);
  const fileUri = FileSystem.documentDirectory + fileName;

  await FileSystem.writeAsStringAsync(fileUri, data);

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri);
  } else {
    alert("Sharing is not available on this device.");
  }

  return fileUri;
}

/**
 * Opens a file picker, reads a `.simg` file, and verifies its authenticity.
 * @returns Data URI of the image if verified, or null if invalid.
 */
export async function pickAndVerifySecureImage(): Promise<string | null> {
  const result = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true });
  if (result.canceled || !result.assets?.length) return null;

  const file = result.assets[0];

  if (!file.name.toLowerCase().endsWith(SECURE_IMAGE_EXTENSION)) {
    alert(`❌ Please select a valid ${SECURE_IMAGE_EXTENSION} file.`);
    return null;
  }

  const fileContent = await FileSystem.readAsStringAsync(file.uri);

  try {
    const { base64, KEY_TAG: imageKeyTag, signature } = JSON.parse(fileContent) as SecureImageObject;

    if (!imageKeyTag) {
      alert("⚠️ No KEY_TAG found in image.");
      return null;
    }

    const docSnap = await getDoc(doc(db, 'public_keys', imageKeyTag));
    if (!docSnap.exists()) {
      alert("❌ Public key not found for this image.");
      return null;
    }
    const publicKey = docSnap.data().publicKey;

    const valid = await verifySignature(signature, base64, publicKey);
    if (!valid) {
      alert("❌ Signature is invalid — image was forged or modified.");
      return null;
    }

    return `data:image/jpeg;base64,${base64}`;
  } catch (err) {
    console.error("Invalid file format", err);
    alert("⚠️ Invalid secure image file.");
    return null;
  }
}
