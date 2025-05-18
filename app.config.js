import 'dotenv/config';

export default {
  expo: {
    name: 'ImageCaptureApp',
    slug: 'ImageCaptureApp',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'imagecaptureapp',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.jasshan.imagecaptureapp',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      package: 'com.jasshan.imagecaptureapp',
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
      ],
      'expo-secure-store',
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      // Shared
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,

      // Android
      FIREBASE_ANDROID_API_KEY: process.env.FIREBASE_ANDROID_API_KEY,
      FIREBASE_ANDROID_APP_ID: process.env.FIREBASE_ANDROID_APP_ID,
      FIREBASE_ANDROID_MESSAGING_SENDER_ID: process.env.FIREBASE_ANDROID_MESSAGING_SENDER_ID,

      // iOS
      FIREBASE_IOS_API_KEY: process.env.FIREBASE_IOS_API_KEY,
      FIREBASE_IOS_APP_ID: process.env.FIREBASE_IOS_APP_ID,
      FIREBASE_IOS_MESSAGING_SENDER_ID: process.env.FIREBASE_IOS_MESSAGING_SENDER_ID,
    },
  },
};
