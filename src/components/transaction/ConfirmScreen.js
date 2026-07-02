// src/components/transaction/ConfirmScreen.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { useApp } from '../../context/AppContext';
import {
  deductUserBalance, saveTransactionHistory, updateUserBalanceByPhoneNumber, initiateRequest,
} from '../../firebase/database';

const CORRECT_PIN = '1234';

export default function ConfirmScreen({ contact, amount, transactionType, onBack, onSuccess }) {
  const { refreshUserData } = useApp();
  const [pin, setPin] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [loading, setLoading] = useState(false);
  const fee = 0; // simplified — fee already included in amount from AmountScreen

  useEffect(() => {
    tryBiometric();
  }, []);

  const tryBiometric = async () => {
    try {
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (enrolled) {
        const res = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate to complete transaction',
        });
        if (res.success) await executeTransaction();
      }
    } catch (_) {}
  };

  const executeTransaction = async () => {
    setLoading(true);
    try {
      if (transactionType === 'sendMoney') {
        await deductUserBalance(amount);
        await saveTransactionHistory({ contact, phoneNumber: contact?.mobileNumber, amount });
        if (contact?.mobileNumber) {
          await updateUserBalanceByPhoneNumber(contact.mobileNumber, amount).catch(() => {});
        }
      } else if (transactionType === 'requestMoney') {
        await initiateRequest(contact?.mobileNumber ?? '');
      } else if (transactionType === 'airtime' || transactionType === 'withdraw') {
        await deductUserBalance(amount);
        await saveTransactionHistory({ contact, phoneNumber: contact?.mobileNumber, amount });
      }
      await refreshUserData();
      onSuccess();
    } catch (e) {
      Alert.alert('Transaction Failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (key) => {
    if (key === '⌫') { setPin((p) => p.slice(0, -1)); return; }
    if (pin.length >= 4) return;
    const newPin = pin + key;
    setPin(newPin);
    if (newPin.length === 4) setTimeout(() => checkPin(newPin), 100);
  };

  const checkPin = async (entered) => {
    if (entered !== CORRECT_PIN) { Alert.alert('Wrong PIN'); setPin(''); return; }
    await executeTransaction();
  };

  const KEYS = [['1','2','3'],['4','5','6'],['7','8','9'],['','0','⌫']];
  const initials = ((contact?.familyName?.[0] ?? '') + (contact?.givenName?.[0] ?? '')).toUpperCase();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={onBack} style={styles.closeBtn}>
          <Ionicons name="close" size={26} color="#333" />
        </TouchableOpacity>

        {/* Contact / agent */}
        <View style={styles.avatarLarge}>
          {contact?.givenName
            ? <Text style={styles.avatarInitials}>{initials}</Text>
            : <Ionicons name="person" size={32} color="#666" />}
        </View>
        <Text style={styles.name}>
          {contact?.givenName ? `${contact.givenName} ${contact.familyName}` : 'Agent'}
        </Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>PHONE NUMBER</Text>
          <Text style={styles.infoValue}>{contact?.mobileNumber ?? ''}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>KSH</Text>
          <Text style={styles.infoValue}>{amount.toFixed(2)}</Text>
          <Text style={styles.feeText}>FEE: KSH. {fee.toFixed(2)}</Text>
        </View>

        <View style={{ flex: 1 }} />
        <Text style={styles.pinLabel}>ENTER M-PESA PIN</Text>

        <View style={styles.dotsRow}>
          {[0,1,2,3].map((i) => (
            <View key={i} style={[styles.dot, i < pin.length && styles.dotFilled]} />
          ))}
        </View>

        <View style={{ flex: 1 }} />

        {loading
          ? <ActivityIndicator color="#00a651" size="large" />
          : (
            <View style={styles.keypad}>
              {KEYS.map((row, ri) => (
                <View key={ri} style={styles.keyRow}>
                  {row.map((k, ki) => (
                    <TouchableOpacity
                      key={ki}
                      style={[styles.keyBtn, k === '' && { opacity: 0 }]}
                      onPress={() => k && handleKey(k)}
                      disabled={k === ''}
                    >
                      <Text style={styles.keyText}>{k}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
          )}
        <View style={{ height: 24 }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, alignItems: 'center', paddingTop: 12 },
  closeBtn: { alignSelf: 'flex-start', marginBottom: 12 },
  avatarLarge: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  avatarInitials: { fontSize: 30, color: '#555' },
  name: { fontWeight: '600', fontSize: 15, marginBottom: 8 },
  infoRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 6 },
  infoLabel: { fontWeight: '600', fontSize: 13 },
  infoValue: { fontWeight: '300', fontSize: 13 },
  feeText: { color: '#666', fontSize: 12 },
  pinLabel: { fontSize: 14, fontWeight: '500', letterSpacing: 1, marginBottom: 16 },
  dotsRow: { flexDirection: 'row', gap: 20 },
  dot: { width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: '#00a651' },
  dotFilled: { backgroundColor: '#00a651' },
  keypad: { width: '85%' },
  keyRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  keyBtn: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center' },
  keyText: { fontSize: 26, fontWeight: '500' },
});
