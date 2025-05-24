# 📷 ImageCaptureApp

A secure image (and video) capture app built with React Native + Expo Bare Workflow. Every captured image is cryptographically signed using a device-specific private key and verified using a public key stored in Firebase. This ensures that shared media can be trusted as authentic and unedited.

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

---

## 🔐 Core Features

- ✅ **Capture images directly from the camera**
- ✅ **Cryptographically sign images using a secure private key**
- ✅ **Verify image authenticity using Firebase-hosted public keys**
- ✅ **Custom `.simg` format** for signed image objects
- ✅ **Cross-device trust** via signature verification
- ✅ **Platform-specific Firebase config** (Android/iOS)
- ✅ **Secure key storage via `react-native-rsa-native`**
- ✅ **Loading and verifying `.simg` files**
- 🧪 **(Planned)** Secure video capture and `.svdo` verification
- 🧪 **(Planned)** Drive/iCloud upload + QR code generation for shareable trust links

---

## 🏗️ Project Structure

ImageCaptureApp/
├── app/
│ ├── components/ # Reusable UI components (Camera, ImageViewer, Loader)
│ ├── screens/ # Screen logic (HomeScreen, future screens)
│ ├── utils/ # Logic modules (crypto, firebase, secureImage, deviceId)
│ ├── constants/ # Config values (e.g., file extensions)
├── assets/ # Icons, splash images, etc.
├── .env # Firebase config (platform-specific)
├── app.config.js # Expo dynamic config (uses .env)
├── ios/ # iOS native project (Xcode-managed)
├── android/ # Android native project (Gradle-managed)



---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
npx pod-install ios
```

### 2. Set up firbase config .env file. 

Create a .env file in the root:
```bash
# common
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-bucket
FIREBASE_MEASUREMENT_ID=...

# android
FIREBASE_ANDROID_API_KEY=...
FIREBASE_ANDROID_APP_ID=...
FIREBASE_ANDROID_MESSAGING_SENDER_ID=...

# ios
FIREBASE_IOS_API_KEY=...
FIREBASE_IOS_APP_ID=...
FIREBASE_IOS_MESSAGING_SENDER_ID=...
```

### 3. Run the APP


```bash
npx expo run:android
```
or
```bash
npx expo run:ios --device
```


## ✨ Roadmap
- Image capture & signature verification
- .simg format with secure metadata
- Platform-specific Firebase setup
- QR-based sharing & verification
- Video capture + .svdo format
- Public key viewer screen
- iCloud/Drive integration
- Frame-by-frame video integrity (optional)

## 📄 License
MIT License — © 2025 [Your Name]

## 🙏 Credits
Built with Expo
Crypto powered by react-native-rsa-native
Verification storage by Firebase Firestore


## Standard expo application information.

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).



To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.


Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
