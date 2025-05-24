import { FontAwesome5 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LoadingScreen from './LoadingScreen';

interface ImageViewerProps {
  imageUri: string;
  onReset: () => void;
  onOpenAnother: () => Promise<void>;
}

export default function ImageViewer({ imageUri, onReset, onOpenAnother }: ImageViewerProps) {
  const [loading, setLoading] = useState(false);

  const handleOpen = async () => {
    setLoading(true);
    await onOpenAnother(); // defined in HomeScreen
    setLoading(false);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUri }} contentFit="contain" style={styles.image} />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onReset}>
          <FontAwesome5 name="camera" size={24} color="white" />
          <Text style={styles.text}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleOpen}>
          <FontAwesome5 name="folder-open" size={24} color="white" />
          <Text style={styles.text}>Open</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  image: {
    flex: 1,
    width: '100%',
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
