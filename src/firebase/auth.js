// src/firebase/auth.js
// Uses Firebase REST API for phone auth — works in Expo Go without ejecting.
import { signInWithCredential, PhoneAuthProvider, signOut } from 'firebase/auth';
import { auth } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = () => auth.app.options.apiKey;

// Step 1 — send OTP via Firebase REST API
export const sendVerificationCode = async (phoneNumber) => {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:sendVerificationCode?key=${API_KEY()}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phoneNumber,
      recaptchaToken: 'test', // works only when phone auth testing is enabled in Firebase
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || 'Failed to send OTP');
  await AsyncStorage.setItem('sessionInfo', data.sessionInfo);
  return data.sessionInfo;
};

// Step 2 — verify OTP
export const verifyCode = async (otp) => {
  const sessionInfo = await AsyncStorage.getItem('sessionInfo');
  if (!sessionInfo) throw new Error('Session expired. Please request a new OTP.');

  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPhoneNumber?key=${API_KEY()}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionInfo, code: otp }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || 'Invalid OTP');

  // Sign in to Firebase SDK using credential
  const credential = PhoneAuthProvider.credential(sessionInfo, otp);
  const result = await signInWithCredential(auth, credential);
  return result.user;
};

export const logout = () => signOut(auth);

export const getCurrentUser = () => auth.currentUser;
