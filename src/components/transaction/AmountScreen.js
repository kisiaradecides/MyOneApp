// src/components/transaction/AmountScreen.js
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';

const withdrawalFee = (amount) => {
  if (amount <= 50) return 0;
  if (amount <= 100) return 11;
  if (amount <= 2500) return 29;
  if (amount <= 3500) return 52;
  if (amount <= 5000) return 69;
  if (amount <= 7500) return 87;
  if (amount <= 10000) return 115;
  if (amount <= 15000) return 167;
  if (amount <= 20000) return 105;
  return 0;
};

export default function AmountScreen({ contact, sendOrRequest, onBack, onContinue }) {
  const { mpesaBalance } = useApp();
  const [amountStr, setAmountStr] = useState('');
  const amount = parseFloat(amountStr) || 0;
  const fee = withdrawalFee(amount);
  const [addFee, setAddFee] = useState(false);

  const handleKey = (key) => {
    if (key === 'X') { setAmountStr((s) => s.slice(0, -1)); return; }
    if (key === '' ) return;
    setAmountStr((s) => s + key);
  };

  const total = addFee ? amount + fee : amount;
  const insufficient = total > mpesaBalance;

  const KEYS = [
    [1,2,3],[4,5,6],[7,8,9],['',0,'X']
  ];

  const initials = ((contact?.familyName?.[0] ?? '') + (contact?.givenName?.[0] ?? '')).toUpperCase();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          {/* progress bar */}
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: '50%' }]} />
          </View>
        </View>

        {/* Contact info */}
        {contact?.mobileNumber && !contact?.givenName ? (
          <>
            <View style={styles.avatarLarge}>
              <Ionicons name="person" size={32} color="#666" />
            </View>
            <Text style={styles.contactLabel}>PHONE NUMBER</Text>
            <Text style={styles.contactValue}>{contact.mobileNumber}</Text>
          </>
        ) : (
          <>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarInitials}>{initials || '?'}</Text>
            </View>
            <Text style={styles.contactValue}>
              {contact?.givenName} {contact?.familyName}
            </Text>
          </>
        )}

        <View style={{ flex: 1 }} />

        {/* Amount display */}
        <View style={styles.amountRow}>
          <Text style={styles.currency}>KSH.</Text>
          <Text style={[styles.amountText, insufficient && { color: 'orange' }]}>
            {amountStr || '0'}
          </Text>
        </View>
        <Text style={styles.balanceHint}>
          BALANCE: KSH. {mpesaBalance.toLocaleString('en', { minimumFractionDigits: 2 })}
          {'  '}FULIZA: KSH. 500.00
        </Text>

        {amount > 50 && sendOrRequest === 'send' && (
          <TouchableOpacity style={styles.feeRow} onPress={() => setAddFee((v) => !v)}>
            <View style={[styles.checkbox, addFee && styles.checkboxChecked]}>
              {addFee && <Ionicons name="checkmark" size={14} color="#fff" />}
            </View>
            <Text style={styles.feeText}>
              ADD WITHDRAWAL FEES{' '}
              <Text style={{ color: '#00a651' }}>KSH.({fee.toFixed(2)})</Text>
            </Text>
          </TouchableOpacity>
        )}

        {/* Continue */}
        <TouchableOpacity
          style={[styles.continueBtn, (amount === 0 || insufficient) && styles.continueBtnDisabled]}
          disabled={amount === 0 || insufficient}
          onPress={() => onContinue(total)}
        >
          <Text style={styles.continueBtnText}>Continue</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Numpad */}
        <View style={styles.numpad}>
          {KEYS.map((row, ri) => (
            <View key={ri} style={styles.numRow}>
              {row.map((k, ki) => (
                <TouchableOpacity
                  key={ki}
                  style={[styles.numBtn, k === '' && { opacity: 0 }]}
                  onPress={() => handleKey(String(k))}
                  disabled={k === ''}
                >
                  <Text style={styles.numText}>{k === 'X' ? '⌫' : k}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 12 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  progressBg: {
    flex: 1, height: 6, backgroundColor: '#ccc',
    borderRadius: 3, marginLeft: 14,
  },
  progressFill: { height: 6, backgroundColor: '#00a651', borderRadius: 3 },
  avatarLarge: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center',
    alignSelf: 'center',
  },
  avatarInitials: { fontSize: 28, color: '#555' },
  contactLabel: { textAlign: 'center', fontWeight: '600', marginTop: 8, fontSize: 13 },
  contactValue: { textAlign: 'center', color: '#555', marginTop: 2 },
  amountRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' },
  currency: { fontSize: 18, fontWeight: '200', marginRight: 4, marginBottom: 4 },
  amountText: { fontSize: 36, fontWeight: '500' },
  balanceHint: { textAlign: 'center', fontSize: 11, color: '#555', marginTop: 4 },
  feeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  checkbox: {
    width: 20, height: 20, borderRadius: 3, borderWidth: 1,
    borderColor: '#333', justifyContent: 'center', alignItems: 'center', marginRight: 8,
  },
  checkboxChecked: { backgroundColor: '#00a651', borderColor: '#00a651' },
  feeText: { fontSize: 13 },
  continueBtn: {
    backgroundColor: '#00a651', borderRadius: 25, height: 52,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    marginTop: 16, gap: 8,
  },
  continueBtnDisabled: { backgroundColor: 'rgba(0,0,0,0.15)' },
  continueBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  numpad: { marginTop: 12 },
  numRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 4 },
  numBtn: { width: 90, height: 56, justifyContent: 'center', alignItems: 'center' },
  numText: { fontSize: 26, fontWeight: '500' },
});
