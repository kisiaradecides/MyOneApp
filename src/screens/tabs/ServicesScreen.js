// src/screens/tabs/ServicesScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const CATEGORIES = [
  { label: 'Bill Manager', icon: 'cash', color: '#00a651' },
  { label: 'Financial Services', icon: 'business', color: '#0077b6' },
  { label: 'Shop & Gift', icon: 'basket', color: '#f9c74f' },
  { label: 'Public Sector', icon: 'water', color: '#d62828' },
  { label: 'Insurance', icon: 'shield', color: '#00a651' },
  { label: 'Transport', icon: 'bus', color: '#7209b7' },
  { label: 'Utilities', icon: 'construct', color: '#f9c74f' },
  { label: 'Loans', icon: 'cash', color: '#d62828' },
  { label: 'My Safaricom', icon: 'phone-portrait', color: '#00a651' },
  { label: 'Education', icon: 'school', color: '#0077b6' },
];

const SERVICES = [
  { label: 'M-SHWARI', bg: '#00a651', text: '#fff' },
  { label: 'KCB M-PESA', bg: '#003087', text: '#fff' },
  { label: 'GLOBAL PAY', bg: '#0077b6', text: '#fff' },
  { label: 'FLIGHTS', bg: '#023e8a', text: '#fff' },
  { label: 'HUSTLER FUND', bg: '#f4a261', text: '#fff' },
  { label: 'NHIF', bg: '#457b9d', text: '#fff' },
  { label: 'HELB', bg: '#003049', text: '#fff' },
  { label: 'NSSF', bg: '#e63946', text: '#fff' },
  { label: 'KPLC', bg: '#0077b6', text: '#fff' },
  { label: 'DSTV', bg: '#d62828', text: '#fff' },
  { label: 'SAFARICOM', bg: '#00a651', text: '#fff' },
  { label: 'PRUDENTIAL', bg: '#888', text: '#fff' },
  { label: 'SGR', bg: '#d62828', text: '#fff' },
  { label: 'MDAKTARI', bg: '#e63946', text: '#fff' },
  { label: 'SHELL', bg: '#f77f00', text: '#fff' },
  { label: 'MALI', bg: '#00a651', text: '#fff' },
  { label: 'PAYPAL', bg: '#003087', text: '#fff' },
  { label: 'WESTERN UNION', bg: '#f9c74f', text: '#333' },
];

const col = [
  { key: 'flex', size: 1 },
  { key: 'flex', size: 1 },
  { key: 'flex', size: 1 },
];

export default function ServicesScreen() {
  const nav = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.toolbar}>
        <Text style={styles.toolbarTitle}>SERVICES</Text>
        <Ionicons name="search" size={22} color="#333" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
        {/* Categories horizontal scroll */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.label} style={styles.catItem}>
              <View style={[styles.catCircle, { backgroundColor: cat.color }]}>
                <Ionicons name={cat.icon} size={18} color="#fff" />
              </View>
              <Text style={styles.catLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Frequents */}
        <Text style={styles.sectionLabel}>FREQUENTS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
          {SERVICES.slice(0, 6).map((s) => (
            <TouchableOpacity key={s.label} style={styles.serviceItem}>
              <View style={[styles.serviceCircle, { backgroundColor: s.bg }]}>
                <Text style={[styles.serviceText, { color: s.text }]}>{s.label.substring(0,3)}</Text>
              </View>
              <Text style={styles.serviceLabel}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Discover more grid */}
        <Text style={styles.sectionLabel}>DISCOVER MORE</Text>
        <View style={styles.grid}>
          {SERVICES.map((s) => (
            <TouchableOpacity key={s.label} style={styles.gridItem}>
              <View style={[styles.serviceCircle, { backgroundColor: s.bg }]}>
                <Text style={[styles.serviceText, { color: s.text }]}>{s.label.substring(0,3)}</Text>
              </View>
              <Text style={styles.serviceLabel}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 52, paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#eee',
  },
  toolbarTitle: { fontSize: 18, fontWeight: '700' },
  sectionLabel: { fontWeight: '700', fontSize: 13, marginBottom: 12 },
  catItem: { width: 70, alignItems: 'center', marginRight: 12 },
  catCircle: {
    width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center', marginBottom: 4,
  },
  catLabel: { fontSize: 9, textAlign: 'center' },
  serviceItem: { width: 70, alignItems: 'center', marginRight: 12 },
  serviceCircle: {
    width: 52, height: 52, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', marginBottom: 4,
  },
  serviceText: { fontSize: 11, fontWeight: '700' },
  serviceLabel: { fontSize: 9, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridItem: { width: 70, alignItems: 'center', marginBottom: 4 },
});
