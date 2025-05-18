// app/screens/HomeScreen.tsx

import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import CameraComponent from '../components/CameraComponent';
import ImageViewer from '../components/ImageViewer';
import LoadingScreen from '../components/LoadingScreen';

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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        if (!permission?.granted) {
          const { granted } = await requestPermission();
          if (!granted) {
            alert("Camera permission is required to use this app.");
            return;
          }
        }

        const id = await getDeviceId();

        if (!id) {
          throw new Error("❌ Device ID could not be generated.");
        }

        setKeyTag(id);
        await initializeKeys(id);
      } catch (err) {
        console.error("Initialization failed:", err);
        alert("App initialization failed. Please try restarting the app.");
      } finally {
        setLoading(false);
      }
    })();
  }, [permission]);

  if (loading || !permission?.granted || !keyTag) {
    return <LoadingScreen />;
  }

  const handleOpenImage = async () => {
    const uri = await pickAndVerifySecureImage();
    if (uri) setImageUri(uri);
  };


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
    return <ImageViewer imageUri={imageUri} onReset={() => setImageUri(null)} onOpenAnother={handleOpenImage}/>;
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

});
