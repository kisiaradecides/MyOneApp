# M-PESA Clone Android App — Setup Guide

## Step 1: Wait for npm install to finish

Open PowerShell in `MpesaCloneApp` folder and run:
```
npm install --legacy-peer-deps
```
Wait until you see "added X packages". This can take 5–10 minutes.

---

## Step 2: Set up Firebase

1. Go to https://console.firebase.google.com
2. Click **Add Project** → name it `MpesaClone` → Continue
3. In your project, click **Add App** → choose **Android**
4. Set package name: `com.mpesaclone.app`
5. Download `google-services.json` (you will need values from it)
6. Go to **Authentication** → **Sign-in method** → Enable **Phone**
7. Under Phone, scroll to **Phone numbers for testing** → add your number  
   e.g. `+254712345678` with code `123456`  
   (Add BOTH phones you will use for testing)
8. Go to **Firestore Database** → Create database → Start in **test mode**

---

## Step 3: Fill in your Firebase config

Open `src/firebase/config.js` and replace the placeholder values with your real ones.

Find values in Firebase Console → Project Settings → Your apps → SDK setup:

```js
const firebaseConfig = {
  apiKey: 'AIzaSy...',           // from google-services.json → api_key[0].current_key
  authDomain: 'mpesaclone-xxxxx.firebaseapp.com',
  projectId: 'mpesaclone-xxxxx', // from project_info.project_id
  storageBucket: 'mpesaclone-xxxxx.appspot.com',
  messagingSenderId: '123456789', // from project_info.project_number
  appId: '1:123456789:android:xxxx', // from client[0].client_info.mobilesdk_app_id
};
```

---

## Step 4: Install Expo Go on your Tecno phone

1. Open Google Play Store on your Tecno
2. Search **Expo Go** and install it
3. Make sure your phone and PC are on the SAME WiFi network

---

## Step 5: Start the development server

In PowerShell inside the `MpesaCloneApp` folder:
```
npx expo start
```

A QR code will appear in the terminal.

---

## Step 6: Run the app on your Tecno

1. Open **Expo Go** on your Tecno phone
2. Tap **Scan QR Code**
3. Scan the QR code from the terminal
4. The app will load on your phone in ~30 seconds

---

## Step 7: Test sending and receiving money

You need **two phones** both running the app logged in to different accounts.

### Phone A (Sender):
1. Register with your real phone number
2. Firebase will send a real SMS OTP → enter it
3. You're logged in

### Phone B (Receiver):
1. Register with a second phone number
2. Same OTP process

### To test Send Money:
- On Phone A → Home → SEND AND REQUEST → Send Money
- Pick a contact or enter Phone B's number manually
- Enter amount (e.g. 100)
- Continue → enter PIN: **1234**
- Money deducts from Phone A, credits Phone B

### To test Request Money:
- On Phone A → Home → SEND AND REQUEST → Request Money
- Enter Phone B's number
- On Phone B, a popup appears: "INCOMING REQUEST"
- Tap APPROVE → balance transfers

---

## Step 8: Build an APK to install without Expo Go

1. Login to Expo: `npx eas-cli login`
2. Initialize: `npx eas-cli init --id YOUR_EXPO_ID`  
   (get your ID from expo.dev dashboard)
3. Build: `npx eas-cli build --profile preview --platform android`
4. Wait ~10 minutes → download the APK link
5. Transfer APK to your Tecno → tap to install  
   (enable "Install from unknown sources" in Settings → Security)

---

## Important Notes

- PIN for all transactions: **1234** (you can change in ConfirmScreen.js)
- Biometric: if your Tecno has fingerprint, it will be used automatically
- Balance polling: every 3 seconds — incoming requests appear automatically
- M-Shwari balance is stored locally on the device (not Firebase)
