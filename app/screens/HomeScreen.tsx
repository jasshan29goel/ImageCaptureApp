// app/screens/HomeScreen.tsx

import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import CameraComponent from '../components/CameraComponent';
import ImageViewer from '../components/ImageViewer';

import { signMessage } from '../utils/crypto';
import { getDeviceId } from '../utils/device';
import { initializeKeys } from '../utils/firebase';
import { pickAndVerifySecureImage, saveSecureImage } from '../utils/secureImage';

export default function HomeScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const [keyTag, setKeyTag] = useState<string | null>(null);

  useEffect(() => {
  (async () => {
    const id = await getDeviceId();
    setKeyTag(id);
    if (!id) return;
    await initializeKeys(id);
    console.log("✅ Keys initialized");
  })();
  }, []);


  if (!permission) return <View />;

  if (!permission.granted || !keyTag) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Camera Permission" />
      </View>
    );
  }

  async function handleOpenImage() {
    const uri = await pickAndVerifySecureImage();
    if (uri) setImageUri(uri);
  }

  async function handleTakePicture() {
    const photo = await cameraRef.current?.takePictureAsync({ base64: true });
    if (photo?.base64) {
        if (!keyTag) {
            alert("Device not ready — missing key tag.");
            return;
        }
        const signature = await signMessage(photo.base64, keyTag);
        await saveSecureImage(photo.base64, signature, keyTag);
    }
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  if (imageUri) {
    return <ImageViewer imageUri={imageUri} onReset={() => setImageUri(null)} />;
  }

  return (
    <View style={styles.container}>
      <CameraComponent
        cameraRef={cameraRef}
        facing={facing}
        onOpenImage={handleOpenImage}
        onTakePicture={handleTakePicture}
        onFlip={toggleCameraFacing}
      />
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
});
