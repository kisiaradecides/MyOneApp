// src/screens/mshwari/MshwariScreen.js
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, Modal, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../../context/AppContext';
import { deductUserBalance, addUserBalance } from '../../firebase/database';

const AVAILABLE_LIMIT = 14000;

export default function MshwariScreen() {
  const nav = useNavigation();
  const { mshwariBalance, saveMshwariBalance, loanBalance, saveLoanBalance, mpesaBalance, refreshUserData } = useApp();
  const [showBalance, setShowBalance] = useState(false);
  const [depositModal, setDepositModal] = useState(false);
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [loanModal, setLoanModal] = useState(false);
  const [payLoanModal, setPayLoanModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('deposit'); // deposit|lock|loan

  const loanPct = Math.min(loanBalance / AVAILABLE_LIMIT, 1);

  const handleDeposit = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { Alert.alert('Enter a valid amount'); return; }
    if (amt > mpesaBalance) { Alert.alert('Insufficient M-PESA balance'); return; }
    setLoading(true);
    try {
      await deductUserBalance(amt);
      await saveMshwariBalance(mshwariBalance + amt);
      await refreshUserData();
      setDepositModal(false); setAmount('');
    } catch (e) { Alert.alert('Error', e.message); }
    setLoading(false);
  };

  const handleWithdraw = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { Alert.alert('Enter a valid amount'); return; }
    if (amt > mshwariBalance) { Alert.alert('Insufficient Mshwari balance'); return; }
    setLoading(true);
    try {
      await addUserBalance(amt);
      await saveMshwariBalance(mshwariBalance - amt);
      await refreshUserData();
      setWithdrawModal(false); setAmount('');
    } catch (e) { Alert.alert('Error', e.message); }
    setLoading(false);
  };

  const handleGetLoan = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { Alert.alert('Enter a valid amount'); return; }
    if (loanBalance + amt > AVAILABLE_LIMIT) { Alert.alert('Exceeds loan limit'); return; }
    setLoading(true);
    try {
      await addUserBalance(amt);
      await saveLoanBalance(loanBalance + amt);
      await refreshUserData();
      setLoanModal(false); setAmount('');
    } catch (e) { Alert.alert('Error', e.message); }
    setLoading(false);
  };

  const handlePayLoan = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { Alert.alert('Enter a valid amount'); return; }
    if (amt > loanBalance) { Alert.alert('Amount exceeds loan balance'); return; }
    if (amt > mpesaBalance) { Alert.alert('Insufficient M-PESA balance'); return; }
    setLoading(true);
    try {
      await deductUserBalance(amt);
      await saveLoanBalance(loanBalance - amt);
      await refreshUserData();
      setPayLoanModal(false); setAmount('');
    } catch (e) { Alert.alert('Error', e.message); }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Green header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => nav.goBack()}>
            <Ionicons name="home-outline" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>M-Shwari</Text>
          <TouchableOpacity onPress={() => nav.goBack()}>
            <Ionicons name="close-circle-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.savingsLabel}>SAVINGS BALANCE</Text>
        <View style={styles.balanceRow}>
          {showBalance
            ? <View style={styles.blurBox} />
            : <Text style={styles.balanceAmt}>
                KSH. {mshwariBalance.toLocaleString('en', { minimumFractionDigits: 2 })}
              </Text>}
          <TouchableOpacity onPress={() => setShowBalance((v) => !v)}>
            <Ionicons name={showBalance ? 'eye' : 'eye-off'} size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Lock savings card */}
        <View style={styles.infoCard}>
          <View style={styles.circleOutline}>
            <Text style={styles.circleText}>0%</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>LOCK SAVINGS</Text>
              <Text style={styles.cardValue}>KSH 0.00</Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.cardMuted}>TARGET AMOUNT</Text>
              <Text style={styles.cardMuted}>KSH 0.00</Text>
            </View>
            <Text style={styles.cardMuted}>Maturity Date</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#333" />
        </View>

        {/* Loan card */}
        <View style={styles.infoCard}>
          <View style={[styles.circleOutline, { borderColor: loanPct > 0 ? '#00a651' : '#ccc' }]}>
            <Text style={[styles.circleText, { color: '#00a651' }]}>{Math.round(loanPct * 100)}%</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>LOAN AMOUNT</Text>
              <Text style={styles.cardValue}>
                KSH. {loanBalance.toLocaleString('en', { minimumFractionDigits: 2 })}
              </Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.cardMuted}>AVAILABLE LIMIT</Text>
              <Text style={styles.cardMuted}>
                KSH. {AVAILABLE_LIMIT.toLocaleString()}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#333" />
        </View>

        {/* Deposit / Withdraw buttons */}
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => setDepositModal(true)}>
            <View style={[styles.actionCircle, { backgroundColor: '#00a651' }]}>
              <Ionicons name="arrow-down" size={18} color="#fff" />
            </View>
            <Text style={styles.actionLabel}>DEPOSIT FROM{'\n'}M-PESA</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => setWithdrawModal(true)}>
            <View style={[styles.actionCircle, { backgroundColor: '#d62828' }]}>
              <Ionicons name="arrow-up" size={18} color="#fff" />
            </View>
            <Text style={styles.actionLabel}>WITHDRAW TO{'\n'}M-PESA</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => setLoanModal(true)}>
            <View style={[styles.actionCircle, { backgroundColor: '#0077b6' }]}>
              <Ionicons name="cash" size={18} color="#fff" />
            </View>
            <Text style={styles.actionLabel}>GET LOAN</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => setPayLoanModal(true)}>
            <View style={[styles.actionCircle, { backgroundColor: '#7209b7' }]}>
              <Ionicons name="card" size={18} color="#fff" />
            </View>
            <Text style={styles.actionLabel}>PAY LOAN</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {['deposit','lock','loan'].map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && { color: '#fff' }]}>
              {t === 'deposit' ? 'DEPOSIT' : t === 'lock' ? 'LOCK SAVINGS' : 'LOAN'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.emptyHistory}>
        <Ionicons name="book-outline" size={40} color="#ccc" />
        <Text style={{ color: '#aaa', marginTop: 8 }}>No records available</Text>
      </View>

      {/* ── Modals ── */}
      {[
        { visible: depositModal, title: 'Deposit to M-Shwari', onClose: () => { setDepositModal(false); setAmount(''); }, onConfirm: handleDeposit },
        { visible: withdrawModal, title: 'Withdraw to M-PESA', onClose: () => { setWithdrawModal(false); setAmount(''); }, onConfirm: handleWithdraw },
        { visible: loanModal, title: 'Get Loan', onClose: () => { setLoanModal(false); setAmount(''); }, onConfirm: handleGetLoan },
        { visible: payLoanModal, title: 'Pay Loan', onClose: () => { setPayLoanModal(false); setAmount(''); }, onConfirm: handlePayLoan },
      ].map((m) => (
        <Modal key={m.title} visible={m.visible} transparent animationType="slide" onRequestClose={m.onClose}>
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={m.onClose} />
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>{m.title}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter amount (KSH)"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              autoFocus
            />
            {loading
              ? <ActivityIndicator color="#00a651" />
              : (
                <TouchableOpacity style={styles.modalBtn} onPress={m.onConfirm}>
                  <Text style={styles.modalBtnText}>CONFIRM</Text>
                </TouchableOpacity>
              )}
          </View>
        </Modal>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: '#2d6a4f', padding: 16, paddingTop: 52 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  savingsLabel: { color: '#fff', fontWeight: '300', textAlign: 'center', marginBottom: 4 },
  balanceRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginBottom: 12 },
  balanceAmt: { color: '#fff', fontSize: 20, fontWeight: '300' },
  blurBox: { width: 120, height: 28, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 6 },
  infoCard: {
    backgroundColor: '#fff', borderRadius: 10, padding: 12,
    flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 10,
  },
  circleOutline: {
    width: 48, height: 48, borderRadius: 24, borderWidth: 1.5,
    borderColor: '#aaa', justifyContent: 'center', alignItems: 'center',
  },
  circleText: { fontSize: 11, color: '#7209b7' },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  cardLabel: { fontSize: 12, fontWeight: '300' },
  cardValue: { fontSize: 12, fontWeight: '500' },
  cardMuted: { fontSize: 11, color: '#888' },
  btnRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 12 },
  actionBtn: { alignItems: 'center', width: 70 },
  actionCircle: {
    width: 38, height: 38, borderRadius: 19,
    justifyContent: 'center', alignItems: 'center', marginBottom: 4,
  },
  actionLabel: { fontSize: 9, color: '#fff', textAlign: 'center', fontFamily: 'monospace' },
  tabs: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  tab: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  tabActive: { backgroundColor: '#00a651' },
  tabText: { fontSize: 12, fontWeight: '600', color: '#333' },
  emptyHistory: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  modalSheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 24,
  },
  modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16, textAlign: 'center' },
  modalInput: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 10,
    padding: 14, fontSize: 18, marginBottom: 16, textAlign: 'center',
  },
  modalBtn: {
    backgroundColor: '#00a651', borderRadius: 25, height: 48,
    justifyContent: 'center', alignItems: 'center',
  },
  modalBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
