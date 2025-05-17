import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Image } from "expo-image";
import * as Sharing from 'expo-sharing';
import { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';





import { initializeApp } from 'firebase/app';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { RSAKeychain } from 'react-native-rsa-native';

const firebaseConfig = {
  apiKey: "AIzaSyATjhOhWDYryn77-V9QICl1n2SeyQWkW9c",
  authDomain: "imagesigndatabase.firebaseapp.com",
  projectId: "imagesigndatabase",
  storageBucket: "imagesigndatabase.firebasestorage.app",
  messagingSenderId: "714400965699",
  appId: "1:714400965699:web:729dfde0662f37caff60f6",
  measurementId: "G-4GF9N3GE10"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const USER_ID = 'Jasshan';
const KEY_TAG = 'com.jasshan.imagekey';

export async function generateKeyPair(keyTag: string): Promise<string> {
  const keys = await RSAKeychain.generate(keyTag);
  return keys.public;
}

export async function initializeKeys(): Promise<void> {
  const docRef = doc(db, 'public_keys', KEY_TAG);
  const existingDoc = await getDoc(docRef);

  if (!existingDoc.exists()) {
    const publicKey = await generateKeyPair(KEY_TAG);

    await setDoc(docRef, {
      publicKey: publicKey,
      createdAt: new Date().toISOString(),
    });
  }
}

export default function HomeScreen() {


useEffect(() => {
  (async () => {
    await initializeKeys();
    console.log("Keys are ready");
  })();
}, []);

  const [facing, setFacing] = useState<CameraType>('back');
  const [uri, setUri] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);

  if (!permission) {
    // Camera/ media permissions are still loading.
    return <View />;
  }


  if (!permission.granted) {
    // Camera/media permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant camera permission" />
      </View>
    );
  }



async function pickAndVerifySecureImage(): Promise<string | null> {
  const result = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true });
  if (result.canceled || !result.assets?.length) return null;

  const file = result.assets[0];
  const fileContent = await FileSystem.readAsStringAsync(file.uri);

  try {
    const { base64, IMAGE_KEY_TAG=KEY_TAG, signature } = JSON.parse(fileContent);
    

    
    if (!IMAGE_KEY_TAG) {
      alert("no KEY_TAG found in image");
      return null;
    }

    const docSnap = await getDoc(doc(db, 'public_keys', IMAGE_KEY_TAG));
    if (!docSnap.exists()) {
      alert("❌ Public key not found for this image.");
      return null;
    }
   const valid = await RSAKeychain.verify(signature, base64, IMAGE_KEY_TAG)
  

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



  const handleOpenImage = async () => {
    const uri = await pickAndVerifySecureImage();
    if (uri) setUri(uri);
  };


  async function saveSecureImageDirectly(photo) {
    if(!photo) {
      return;
    }
    const fileName = `secure_image_${Date.now()}.simg`;

    const base64 = photo.base64;

    let messageSignature = await RSAKeychain.sign(base64, KEY_TAG);

  const secureObject = {
    base64: photo.base64,
    KEY_TAG: KEY_TAG,
    signature: messageSignature
  };


    const data = JSON.stringify(secureObject);
    const fileUri = FileSystem.documentDirectory + fileName;
    await FileSystem.writeAsStringAsync(fileUri, data);

    // Share the file (user chooses location like Downloads or Drive)
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    } else {
      alert("Sharing is not available on this device.");
    }
  }


  async function takePicture() {
    const photo = await ref.current?.takePictureAsync({ base64: true });
    if (photo) {
      await saveSecureImageDirectly(photo);
    }
  }



  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  if (uri) {
    return (
      <View>
        <Image 
          source = {{uri}}
          contentFit="contain"
          style={{ width: 300, aspectRatio: 1 }}
        />
        <Button onPress={() => setUri(null)} title="Take another picture" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={ref}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleOpenImage}>
            <Text style={styles.text}>Open Picture</Text>
          </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Take Picture</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
