import * as SecureStore from 'expo-secure-store';
import uuid from 'react-native-uuid';

const DEVICE_ID_KEY = 'device_id';

export async function getDeviceId(): Promise<string | null> {
  try {
    const existingId = await SecureStore.getItemAsync(DEVICE_ID_KEY);
    if (existingId) { 
        console.log("[Device ID] Fetched from SecureStore");
        return existingId;
    }

    const newId = uuid.v4() as string;
    await SecureStore.setItemAsync(DEVICE_ID_KEY, newId);

    console.log("[Device ID] Stored new UUID to SecureStore.");

    return newId;
  } catch (err) {
    console.error("[Device ID] Error using SecureStore:", err);
    return null;
  }
}
