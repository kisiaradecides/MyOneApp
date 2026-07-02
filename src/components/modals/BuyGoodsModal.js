// src/components/modals/BuyGoodsModal.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FREQUENTS = [
  { label: 'Naivas Supermarket', code: 'NS' },
  { label: 'Rubis Petrol Station', code: 'RP' },
  { label: 'Quick Mart', code: 'QM' },
  { label: 'Total South C', code: 'TS' },
  { label: 'Caffe Light', code: 'CL' },
];

export default function BuyGoodsModal({ visible, onClose }) {
  const [search, setSearch] = useState('');
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={26} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>BUY GOODS</Text>
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
          <TouchableOpacity style={styles.row}>
            <View style={[styles.circle, { backgroundColor: '#0077b6' }]}>
              <Ionicons name="keypad" size={18} color="#fff" />
            </View>
            <Text style={styles.rowLabel}>ENTER TILL NUMBER</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row}>
            <View style={[styles.circle, { backgroundColor: '#06d6a0' }]}>
              <Ionicons name="qr-code" size={18} color="#fff" />
            </View>
            <Text style={styles.rowLabel}>SCAN QR CODE</Text>
          </TouchableOpacity>

          <Text style={styles.sectionLabel}>FREQUENTS</Text>
          {FREQUENTS.filter((f) => f.label.toLowerCase().includes(search.toLowerCase())).map((f) => (
            <View key={f.code} style={styles.row}>
              <View style={[styles.circle, { backgroundColor: '#ccc' }]}>
                <Text style={{ fontWeight: '700' }}>{f.code}</Text>
              </View>
              <Text style={styles.rowLabel}>{f.label}</Text>
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
  sectionLabel: { fontWeight: '600', marginBottom: 12, marginTop: 8 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  circle: {
    width: 42, height: 42, borderRadius: 21,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  rowLabel: { fontWeight: '500', fontSize: 14 },
});
