import { ActivityIndicator, StyleSheet, View } from 'react-native';

interface LoadingScreenProps {
  color?: string;
  backgroundColor?: string;
}

export default function LoadingScreen({
  color = '#fff',
  backgroundColor = 'black',
}: LoadingScreenProps) {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ActivityIndicator size="large" color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
