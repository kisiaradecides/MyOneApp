// src/screens/auth/LoginScreen.js
// PIN + biometric gate shown after user is logged in (session persisted)
import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Vibration, Alert,
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useApp } from '../../context/AppContext';
import { Ionicons } from '@expo/vector-icons';

const CORRECT_PIN = '1234';

export default function LoginScreen() {
  const { setIsAuthenticated, username, userPhone } = useApp();
  const [pin, setPin] = useState('');
  const [shake, setShake] = useState(false);

  useEffect(() => {
    tryBiometric();
  }, []);

  const tryBiometric = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (compatible && enrolled) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate to access M-PESA',
          fallbackLabel: 'Use PIN',
        });
        if (result.success) setIsAuthenticated(true);
      }
    } catch (_) {}
  };

  const handleKey = (key) => {
    if (key === '⌫') {
      setPin((p) => p.slice(0, -1));
      return;
    }
    if (pin.length >= 4) return;
    const newPin = pin + key;
    setPin(newPin);
    if (newPin.length === 4) {
      setTimeout(() => checkPin(newPin), 100);
    }
  };

  const checkPin = (enteredPin) => {
    if (enteredPin === CORRECT_PIN) {
      setIsAuthenticated(true);
    } else {
      Vibration.vibrate(400);
      setShake(true);
      setTimeout(() => { setShake(false); setPin(''); }, 600);
    }
  };

  const KEYS = [
    ['1','2','3'],
    ['4','5','6'],
    ['7','8','9'],
    ['','0','⌫'],
  ];

  return (
    <View style={styles.container}>
      {/* Profile */}
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color="#666" />
        </View>
        <Text style={styles.name}>{username || 'User'}</Text>
        <Text style={styles.phone}>{userPhone}</Text>
      </View>

      <View style={{ flex: 1 }} />

      <Text style={styles.enterPin}>ENTER M-PESA PIN</Text>

      {/* Dots */}
      <View style={[styles.dotsRow, shake && styles.shake]}>
        {[0,1,2,3].map((i) => (
          <View
            key={i}
            style={[styles.dot, i < pin.length && styles.dotFilled]}
          />
        ))}
      </View>

      <View style={{ flex: 1 }} />

      {/* Keypad */}
      <View style={styles.keypad}>
        {KEYS.map((row, ri) => (
          <View key={ri} style={styles.keyRow}>
            {row.map((key, ki) => (
              <TouchableOpacity
                key={ki}
                style={[styles.keyBtn, key === '' && { opacity: 0 }]}
                onPress={() => key && handleKey(key)}
                disabled={key === ''}
              >
                <Text style={styles.keyText}>{key}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      <TouchableOpacity onPress={tryBiometric} style={styles.biometricBtn}>
        <Ionicons name="finger-print" size={32} color="#00a651" />
        <Text style={styles.biometricText}>Use Biometrics</Text>
      </TouchableOpacity>

      <View style={{ height: 32 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', paddingTop: 60 },
  profileSection: { alignItems: 'center' },
  avatar: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center',
  },
  name: { fontSize: 18, fontWeight: '600', marginTop: 12 },
  phone: { color: '#666', marginTop: 4 },
  enterPin: { fontSize: 14, fontWeight: '500', letterSpacing: 1, color: '#333' },
  dotsRow: { flexDirection: 'row', gap: 20, marginTop: 16 },
  dot: {
    width: 18, height: 18, borderRadius: 9,
    borderWidth: 1.5, borderColor: '#00a651',
  },
  dotFilled: { backgroundColor: '#00a651' },
  shake: { transform: [{ translateX: 10 }] },
  keypad: { width: '80%' },
  keyRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  keyBtn: {
    width: 72, height: 72, borderRadius: 36,
    justifyContent: 'center', alignItems: 'center',
  },
  keyText: { fontSize: 26, fontWeight: '500' },
  biometricBtn: { alignItems: 'center', marginTop: 16 },
  biometricText: { color: '#00a651', marginTop: 4, fontSize: 13 },
});
