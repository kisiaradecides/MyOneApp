// src/components/modals/WithdrawModal.js
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AmountScreen from '../transaction/AmountScreen';
import ConfirmScreen from '../transaction/ConfirmScreen';
import SuccessScreen from '../transaction/SuccessScreen';

export default function WithdrawModal({ visible, onClose, onDone }) {
  const [step, setStep] = useState('entry'); // entry|amount|confirm|success
  const [agentNumber, setAgentNumber] = useState('');
  const [amount, setAmount] = useState(0);

  const reset = () => { setStep('entry'); setAgentNumber(''); setAmount(0); };

  const KEYS = [['1','2','3'],['4','5','6'],['7','8','9'],['','0','⌫']];
  const handleKey = (k) => {
    if (k === '⌫') { setAgentNumber((s) => s.slice(0, -1)); return; }
    if (k === '') return;
    if (agentNumber.length >= 6) return;
    setAgentNumber((s) => s + k);
  };

  if (!visible) return null;

  if (step === 'amount') return (
    <AmountScreen
      contact={{ givenName: 'Agent', familyName: '', mobileNumber: agentNumber }}
      sendOrRequest="send"
      onBack={() => setStep('entry')}
      onContinue={(amt) => { setAmount(amt); setStep('confirm'); }}
    />
  );

  if (step === 'confirm') return (
    <ConfirmScreen
      contact={{ givenName: 'Agent', familyName: agentNumber, mobileNumber: agentNumber }}
      amount={amount}
      transactionType="withdraw"
      onBack={() => setStep('amount')}
      onSuccess={() => setStep('success')}
    />
  );

  if (step === 'success') return (
    <SuccessScreen
      contact={{ givenName: 'Agent', familyName: agentNumber, mobileNumber: agentNumber }}
      amount={amount}
      transactionType="withdraw"
      onDone={() => { reset(); onDone(); }}
    />
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={26} color="#333" />
            </TouchableOpacity>
            <View style={styles.progress}><View style={[styles.progressFill, { width: '25%' }]} /></View>
          </View>

          <Text style={styles.title}>WITHDRAW AT AGENT</Text>

          <View style={{ flex: 1 }} />

          <View style={styles.displayBox}>
            <Text style={styles.placeholder}>
              {agentNumber || 'Enter Agent Number'}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.continueBtn, agentNumber.length < 4 && styles.continueBtnDisabled]}
            disabled={agentNumber.length < 4}
            onPress={() => setStep('amount')}
          >
            <Text style={styles.continueBtnText}>Continue</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>

          <View style={styles.numpad}>
            {KEYS.map((row, ri) => (
              <View key={ri} style={styles.numRow}>
                {row.map((k, ki) => (
                  <TouchableOpacity
                    key={ki}
                    style={[styles.numBtn, k === '' && { opacity: 0 }]}
                    onPress={() => k && handleKey(k)}
                    disabled={k === ''}
                  >
                    <Text style={styles.numText}>{k}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
          <View style={{ height: 24 }} />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 12 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  progress: { flex: 1, height: 6, backgroundColor: '#ccc', borderRadius: 3, marginLeft: 14 },
  progressFill: { height: 6, backgroundColor: '#d62828', borderRadius: 3 },
  title: { fontSize: 22, fontWeight: '300', marginBottom: 16 },
  displayBox: { alignItems: 'center', marginBottom: 20 },
  placeholder: { fontSize: 24, fontWeight: '300', color: '#555' },
  continueBtn: {
    backgroundColor: '#d62828', borderRadius: 25, height: 52,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    marginBottom: 16, gap: 8,
  },
  continueBtnDisabled: { backgroundColor: 'rgba(0,0,0,0.15)' },
  continueBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  numpad: {},
  numRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 4 },
  numBtn: { width: 90, height: 56, justifyContent: 'center', alignItems: 'center' },
  numText: { fontSize: 26, fontWeight: '500' },
});
