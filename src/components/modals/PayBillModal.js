// src/components/modals/PayBillModal.js
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal,
  ScrollView, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const POPULAR = [
  { label: 'KPLC Prepaid', code: '888880', color: '#0077b6' },
  { label: 'KPLC Postpaid', code: '888882', color: '#0077b6' },
  { label: 'Absa Bank', code: '303030', color: '#e63946' },
  { label: 'NHIF', code: '200999', color: '#457b9d' },
  { label: 'NSSF', code: '333200', color: '#f9c74f' },
  { label: 'Safaricom Postpaid', code: '200200', color: '#00a651' },
  { label: 'DStv', code: '345678', color: '#d62828' },
  { label: 'Nairobi Water', code: '444000', color: '#4cc9f0' },
];

export default function PayBillModal({ visible, onClose }) {
  const [search, setSearch] = useState('');
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={26} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>PAY BILL</Text>
          <View style={{ width: 26 }} />
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color="#aaa" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionLabel}>POPULAR BILLS</Text>
          {POPULAR.filter((b) => b.label.toLowerCase().includes(search.toLowerCase())).map((b) => (
            <View key={b.code} style={styles.billRow}>
              <View style={[styles.billCircle, { backgroundColor: b.color }]}>
                <Text style={styles.billInitial}>{b.label[0]}</Text>
              </View>
              <View>
                <Text style={styles.billLabel}>{b.label}</Text>
                <Text style={styles.billCode}>{b.code}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 52, paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  title: { fontSize: 18, fontWeight: '300' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f0f0f0', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 8, marginBottom: 16,
  },
  searchInput: { flex: 1, marginLeft: 8 },
  sectionLabel: { fontWeight: '600', marginBottom: 12 },
  billRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  billCircle: {
    width: 42, height: 42, borderRadius: 21,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  billInitial: { color: '#fff', fontWeight: '700', fontSize: 16 },
  billLabel: { fontWeight: '500', fontSize: 14 },
  billCode: { color: '#666', fontSize: 12 },
});
