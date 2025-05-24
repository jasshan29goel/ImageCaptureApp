import { FontAwesome5 } from '@expo/vector-icons';
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
      <View style={styles.overlay}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={onOpenImage}>
            <FontAwesome5 name="folder-open" size={24} color="white" />
            <Text style={styles.text}>Open</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={onTakePicture}>
            <FontAwesome5 name="camera" size={24} color="white" />
            <Text style={styles.text}>Snap</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={onFlip}>
            <FontAwesome5 name="sync" size={24} color="white" />
            <Text style={styles.text}>Flip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </CameraView>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 92,
    backgroundColor: 'transparent',
  },
  button: {
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    color: 'white',
    marginTop: 4,
  },
});
