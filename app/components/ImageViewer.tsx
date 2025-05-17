import { Image } from 'expo-image';
import { Button, StyleSheet, View } from 'react-native';

interface ImageViewerProps {
  imageUri: string;
  onReset: () => void;
}

export default function ImageViewer({ imageUri, onReset }: ImageViewerProps) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageUri }}
        contentFit="contain"
        style={styles.image}
      />
      <Button onPress={onReset} title="Take another picture" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  image: {
    width: 300,
    aspectRatio: 1,
    marginBottom: 16,
  },
});
