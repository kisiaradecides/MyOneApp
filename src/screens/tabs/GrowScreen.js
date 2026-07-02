// src/screens/tabs/GrowScreen.js
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as LocalAuthentication from 'expo-local-authentication';

const SERVICES = [
  { label: 'M-SOKO', bg: '#00a651', text: '#fff' },
  { label: 'HUSTLER FUND', bg: '#f4a261', text: '#fff' },
  { label: 'NHIF', bg: '#457b9d', text: '#fff' },
  { label: 'SGR', bg: '#d62828', text: '#fff' },
  { label: 'MOOKH', bg: '#f9c74f', text: '#333' },
  { label: 'SAFARICOM BUNDLES', bg: '#00a651', text: '#fff' },
  { label: 'MALI', bg: '#023e8a', text: '#fff' },
];

export default function GrowScreen() {
  const nav = useNavigation();

  const goGlobalPay = async () => {
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (enrolled) {
      const res = await LocalAuthentication.authenticateAsync({ promptMessage: 'Authenticate' });
      if (res.success) nav.navigate('GlobalPay');
    } else {
      nav.navigate('GlobalPay');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.toolbar}>
        <Text style={styles.toolbarTitle}>GROW</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
        {/* Feature cards */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
          <TouchableOpacity style={[styles.featureCard, { backgroundColor: '#1a1a2e' }]} onPress={goGlobalPay}>
            <Ionicons name="storefront" size={40} color="#fff" style={{ marginBottom: 40 }} />
            <View style={styles.featureCardFooter}>
              <View style={styles.safLogo}>
                <Text style={{ color: '#00a651', fontWeight: '700', fontSize: 10 }}>SAF</Text>
              </View>
              <View>
                <Text style={styles.featureCardTitle}>GLOBAL PAY</Text>
                <Text style={styles.featureCardSub}>The World is yours</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.featureCard, { backgroundColor: '#2d3748' }]}
            onPress={() => nav.navigate('Mshwari')}
          >
            <Ionicons name="trending-up" size={40} color="#00a651" style={{ marginBottom: 40 }} />
            <View style={styles.featureCardFooter}>
              <View style={styles.safLogo}>
                <Text style={{ color: '#00a651', fontWeight: '700', fontSize: 10 }}>SAF</Text>
              </View>
              <View>
                <Text style={styles.featureCardTitle}>M-SHWARI</Text>
                <Text style={styles.featureCardSub}>Go for it</Text>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>

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
    paddingHorizontal: 16, paddingTop: 52, paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#eee',
  },
  toolbarTitle: { fontSize: 18, fontWeight: '700' },
  featureCard: {
    width: 340, height: 220, borderRadius: 12, padding: 16,
    marginRight: 12, justifyContent: 'space-between',
  },
  featureCardFooter: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  safLogo: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center',
  },
  featureCardTitle: { color: '#fff', fontWeight: '700' },
  featureCardSub: { color: '#aaa', fontSize: 12 },
  sectionLabel: { fontWeight: '700', fontSize: 13, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridItem: { width: 70, alignItems: 'center', marginBottom: 4 },
  serviceCircle: {
    width: 52, height: 52, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', marginBottom: 4,
  },
  serviceText: { fontSize: 11, fontWeight: '700' },
  serviceLabel: { fontSize: 9, textAlign: 'center' },
});
