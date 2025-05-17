import { CameraType, CameraView } from 'expo-camera';
import { RefObject } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CameraComponentProps {
  cameraRef: RefObject<CameraView | null>;
  facing: CameraType;
  onFlip: () => void;
  onTakePicture: () => void;
  onOpenImage: () => void;
}

export default function CameraComponent({
  cameraRef,
  facing,
  onFlip,
  onTakePicture,
  onOpenImage,
}: CameraComponentProps) {
  return (
    <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onOpenImage}>
          <Text style={styles.text}>Open Picture</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onTakePicture}>
          <Text style={styles.text}>Take Picture</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onFlip}>
          <Text style={styles.text}>Flip Camera</Text>
        </TouchableOpacity>
      </View>
    </CameraView>
  );
}

const styles = StyleSheet.create({
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
