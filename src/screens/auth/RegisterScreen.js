// src/screens/auth/RegisterScreen.js
import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  FlatList, Image, Dimensions, ActivityIndicator, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native';

const { width } = Dimensions.get('window');

const SLIDES = [
  { key: '1', color: '#1a472a' },
  { key: '2', color: '#2d6a4f' },
  { key: '3', color: '#40916c' },
];

export default function RegisterScreen({ navigation }) {
  const [step, setStep] = useState('landing'); // 'landing' | 'form'
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const flatRef = useRef(null);
  const [slideIndex, setSlideIndex] = useState(0);

  // auto-scroll slides
  React.useEffect(() => {
    const t = setInterval(() => {
      const next = (slideIndex + 1) % SLIDES.length;
      flatRef.current?.scrollToIndex({ index: next, animated: true });
      setSlideIndex(next);
    }, 3000);
    return () => clearInterval(t);
  }, [slideIndex]);

  const validate = () => {
    const e = {};
    if (!firstName.trim()) e.firstName = true;
    if (!lastName.trim()) e.lastName = true;
    if (!phoneNumber.trim()) e.phoneNumber = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignIn = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      navigation.navigate('OTP', {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phoneNumber.trim(),
      });
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'landing') {
    return (
      <View style={styles.container}>
        <FlatList
          ref={flatRef}
          data={SLIDES}
          keyExtractor={(i) => i.key}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={[styles.slide, { backgroundColor: item.color }]} />
          )}
          style={StyleSheet.absoluteFill}
        />
        {/* Overlay */}
        <View style={styles.overlay}>
          <Text style={styles.mpesaTitle}>My OneApp</Text>
          <View style={{ flex: 1 }} />
          <Text style={styles.welcomeText}>WELCOME TO MY ONEAPP</Text>
          <Text style={styles.subText}>MADE JUST FOR YOU</Text>
          <TouchableOpacity
            style={styles.signInBtn}
            onPress={() => setStep('form')}
          >
            <Text style={styles.signInBtnText}>SIGN IN</Text>
          </TouchableOpacity>
          <View style={{ height: 60 }} />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.formTitle}>Sign In</Text>
        {(errors.firstName || errors.lastName || errors.phoneNumber) && (
          <Text style={styles.errorBanner}>Please fill in the required fields</Text>
        )}

        <TextInput
          style={[styles.input, errors.firstName && styles.inputError]}
          placeholder="First name"
          value={firstName}
          onChangeText={(v) => { setFirstName(v); setErrors((e) => ({ ...e, firstName: false })); }}
          returnKeyType="next"
        />
        <TextInput
          style={[styles.input, errors.lastName && styles.inputError]}
          placeholder="Second name"
          value={lastName}
          onChangeText={(v) => { setLastName(v); setErrors((e) => ({ ...e, lastName: false })); }}
          returnKeyType="next"
        />
        <TextInput
          style={[styles.input, errors.phoneNumber && styles.inputError]}
          placeholder="Phone number (e.g. +254712345678)"
          value={phoneNumber}
          onChangeText={(v) => { setPhoneNumber(v); setErrors((e) => ({ ...e, phoneNumber: false })); }}
          keyboardType="phone-pad"
          returnKeyType="done"
        />

        <TouchableOpacity
          style={styles.signInBtn}
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.signInBtnText}>SIGN IN</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  slide: { width, height: '100%' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  mpesaTitle: { fontSize: 36, fontWeight: 'bold', color: '#00a651' },
  welcomeText: { fontSize: 16, fontWeight: '600', color: '#00a651', marginBottom: 4 },
  subText: { fontSize: 16, fontWeight: '600', color: '#00a651', marginBottom: 24 },
  signInBtn: {
    backgroundColor: '#00a651',
    borderRadius: 25,
    width: 280,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  signInBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  formContainer: { padding: 20, paddingTop: 40 },
  formTitle: { fontSize: 22, fontWeight: '300', marginBottom: 16, textAlign: 'center' },
  errorBanner: { color: 'red', textAlign: 'center', marginBottom: 8 },
  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    fontSize: 16,
  },
  inputError: { backgroundColor: 'rgba(255,0,0,0.08)' },
});
