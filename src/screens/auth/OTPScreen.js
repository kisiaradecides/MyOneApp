// src/screens/auth/OTPScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { sendVerificationCode, verifyCode } from '../../firebase/auth';
import { saveUserData, saveRequestState } from '../../firebase/database';
import { useApp } from '../../context/AppContext';

export default function OTPScreen({ route, navigation }) {
  const { firstName, lastName, phoneNumber } = route.params;
  const { setUserLoggedIn, refreshUserData } = useApp();

  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    sendCode();
    return () => clearInterval(timerRef.current);
  }, []);

  const startTimer = () => {
    setTimer(60);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((v) => {
        if (v <= 1) { clearInterval(timerRef.current); return 0; }
        return v - 1;
      });
    }, 1000);
  };

  const sendCode = async () => {
    setSending(true);
    setError('');
    try {
      await sendVerificationCode(phoneNumber);
      startTimer();
      setTimeout(() => inputRef.current?.focus(), 500);
    } catch (e) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async () => {
    if (otp.length < 6) { setError('Enter the 6-digit code'); return; }
    setVerifying(true);
    setError('');
    try {
      await verifyCode(otp);
      await saveUserData({ firstName, lastName, phoneNumber });
      await saveRequestState();
      await refreshUserData();
      setUserLoggedIn(true);
    } catch (e) {
      setError(e.message);
      setOtp('');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.title}>SIGN IN ON MY ONEAPP</Text>
        <Text style={styles.subtitle}>
          Enter the OTP code sent to{'\n'}
          <Text style={{ fontWeight: '700', color: '#00a651' }}>{phoneNumber}</Text>
        </Text>

        {sending ? (
          <View style={styles.sendingRow}>
            <ActivityIndicator color="#00a651" />
            <Text style={{ marginLeft: 10, color: '#555' }}>Sending code...</Text>
          </View>
        ) : (
          <>
            {/* OTP boxes */}
            <View style={styles.otpRow}>
              {[0,1,2,3,4,5].map((i) => (
                <View
                  key={i}
                  style={[styles.otpBox, otp.length > i && styles.otpBoxFilled]}
                >
                  <Text style={styles.otpChar}>{otp[i] ?? ''}</Text>
                </View>
              ))}
            </View>

            {/* Hidden real input */}
            <TextInput
              ref={inputRef}
              style={styles.hiddenInput}
              value={otp}
              onChangeText={(v) => { setOtp(v.replace(/\D/g, '').slice(0, 6)); setError(''); }}
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
            />

            {!!error && <Text style={styles.error}>{error}</Text>}

            <TouchableOpacity
              style={[styles.verifyBtn, (otp.length < 6 || verifying) && styles.btnDisabled]}
              onPress={handleVerify}
              disabled={otp.length < 6 || verifying}
            >
              {verifying
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.verifyBtnText}>Verify</Text>}
            </TouchableOpacity>

            <View style={styles.resendRow}>
              {timer > 0
                ? <Text style={styles.timerText}>Resend code in <Text style={{ fontWeight: '700' }}>{timer}s</Text></Text>
                : (
                  <TouchableOpacity onPress={sendCode}>
                    <Text style={styles.resendBtn}>Resend Code</Text>
                  </TouchableOpacity>
                )}
            </View>

            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Text style={styles.backBtnText}>← Change Number</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 28, paddingTop: 70, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 12 },
  subtitle: { fontSize: 14, color: '#555', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  sendingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  otpRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  otpBox: {
    width: 46, height: 54, borderRadius: 10,
    borderWidth: 1.5, borderColor: '#ccc',
    justifyContent: 'center', alignItems: 'center',
  },
  otpBoxFilled: { borderColor: '#00a651', backgroundColor: 'rgba(0,166,81,0.06)' },
  otpChar: { fontSize: 24, fontWeight: '600' },
  hiddenInput: {
    position: 'absolute', opacity: 0, height: 1, width: 1,
  },
  error: { color: '#d62828', marginTop: 8, textAlign: 'center', fontSize: 13 },
  verifyBtn: {
    backgroundColor: '#00a651', borderRadius: 25, height: 52, width: '100%',
    justifyContent: 'center', alignItems: 'center', marginTop: 24,
  },
  btnDisabled: { opacity: 0.4 },
  verifyBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  resendRow: { marginTop: 20 },
  timerText: { color: '#666', fontSize: 14 },
  resendBtn: { color: '#00a651', fontWeight: '700', fontSize: 15 },
  backBtn: { marginTop: 16 },
  backBtnText: { color: '#0077b6', fontSize: 14 },
});
