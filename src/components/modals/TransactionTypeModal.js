// src/components/modals/TransactionTypeModal.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const CONFIG = {
  send: {
    title: 'SEND AND REQUEST',
    color: '#00a651',
    items: [
      { action: 'sendMoney', icon: 'arrow-up-right', label: 'Send Money' },
      { action: 'requestMoney', icon: 'arrow-down-left', label: 'Request Money' },
      { action: 'global', icon: 'globe-outline', label: 'Global', ionicon: true },
      { action: 'scanQr', icon: 'qr-code-outline', label: 'Scan QR', ionicon: true },
    ],
  },
  pay: {
    title: 'PAY',
    color: '#0077b6',
    items: [
      { action: 'payBill', icon: 'file-document-outline', label: 'Pay Bill' },
      { action: 'buyGoods', icon: 'basket-outline', label: 'Buy Goods', ionicon: true },
      { action: 'pochi', icon: 'phone-portrait-outline', label: 'Pochi la Biashara', ionicon: true },
      { action: 'globalPay', icon: 'card-outline', label: 'Global Pay', ionicon: true },
    ],
  },
  withdraw: {
    title: 'WITHDRAW',
    color: '#d62828',
    items: [
      { action: 'withdraw', icon: 'storefront', label: 'Withdraw at Agent' },
      { action: 'withdrawATM', icon: 'cash-multiple', label: 'Withdraw at ATM' },
      { action: 'scanQr', icon: 'qr-code-outline', label: 'Scan QR', ionicon: true },
    ],
  },
  airtime: {
    title: 'AIRTIME',
    color: '#7209b7',
    items: [
      { action: 'airtime', icon: 'cellphone-arrow-down', label: 'Buy for My Number' },
      { action: 'airtimeOther', icon: 'cellphone-arrow-up', label: 'Buy for Other Number' },
      { action: 'bundles', icon: 'signal-4g', label: 'Buy Bundles' },
    ],
  },
};

export default function TransactionTypeModal({ visible, txType, onSelect, onClose }) {
  const cfg = CONFIG[txType] || CONFIG.send;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title}>{cfg.title}</Text>
        {cfg.items.map((item) => (
          <TouchableOpacity
            key={item.action}
            style={styles.row}
            onPress={() => onSelect(item.action)}
          >
            <View style={[styles.iconCircle, { backgroundColor: cfg.color }]}>
              {item.ionicon
                ? <Ionicons name={item.icon} size={18} color="#fff" />
                : <MaterialCommunityIcons name={item.icon} size={18} color="#fff" />}
            </View>
            <Text style={styles.rowLabel}>{item.label.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
        <View style={{ height: 24 }} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 20, paddingTop: 12,
  },
  handle: {
    width: 50, height: 5, borderRadius: 3,
    backgroundColor: '#ccc', alignSelf: 'center', marginBottom: 16,
  },
  title: { fontWeight: '300', fontSize: 14, marginBottom: 16, letterSpacing: 1 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  iconCircle: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  rowLabel: { fontSize: 14, fontWeight: '500' },
});
