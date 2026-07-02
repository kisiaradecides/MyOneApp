// src/components/transaction/SuccessScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CATEGORIES = [
  { name: 'Shopping', icon: 'bag', color: '#0077b6' },
  { name: 'Food & Beverage', icon: 'restaurant', color: '#00a651' },
  { name: 'Entertainment', icon: 'musical-notes', color: '#06d6a0' },
  { name: 'Transport', icon: 'bus', color: '#7209b7' },
  { name: 'Bills', icon: 'home', color: '#d62828' },
  { name: 'Education', icon: 'school', color: '#f9c74f' },
  { name: 'Withdrawal', icon: 'cash', color: '#4361ee' },
  { name: 'Family & Friends', icon: 'people', color: '#4cc9f0' },
];

const randomID = () =>
  Array.from({ length: 11 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]).join('');

export default function SuccessScreen({ contact, amount, transactionType, onDone }) {
  const [txId] = useState(randomID());
  const [category, setCategory] = useState({ name: 'GENERAL', color: 'orange' });
  const [showCats, setShowCats] = useState(false);

  // Checkmark animation
  const line1 = useRef(new Animated.Value(0)).current;
  const line2 = useRef(new Animated.Value(0)).current;
  const circle = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(line1, { toValue: 1, duration: 250, useNativeDriver: false }),
      Animated.timing(line2, { toValue: 1, duration: 350, useNativeDriver: false }),
      Animated.timing(circle, { toValue: 1, duration: 500, useNativeDriver: false }),
    ]).start();
  }, []);

  const initials = ((contact?.familyName?.[0] ?? '') + (contact?.givenName?.[0] ?? '')).toUpperCase();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={onDone} style={styles.closeBtn}>
          <Ionicons name="close" size={26} color="#333" />
        </TouchableOpacity>

        {/* Contact */}
        <View style={styles.avatarLarge}>
          {contact?.givenName
            ? <Text style={styles.avatarInitials}>{initials}</Text>
            : <Ionicons name="person" size={32} color="#666" />}
        </View>
        {contact?.givenName && (
          <Text style={styles.name}>
            {(contact.givenName + ' ' + contact.familyName).toUpperCase()}
          </Text>
        )}

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>PHONE NUMBER</Text>
          <Text style={styles.infoValue}>{contact?.mobileNumber ?? ''}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.amountText}>KSH. {amount.toFixed(2)}</Text>
          <Text style={styles.feeText}>FEE: KSH. 0.00</Text>
        </View>

        {/* Category badge */}
        <TouchableOpacity
          style={[styles.categoryBadge, { borderColor: category.color, backgroundColor: category.color + '18' }]}
          onPress={() => setShowCats((v) => !v)}
        >
          <Text style={[styles.categoryText, { color: category.color }]}>{category.name}</Text>
          <Ionicons name="chevron-down" size={14} color={category.color} />
        </TouchableOpacity>

        {showCats && (
          <View style={styles.catList}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.name}
                style={styles.catRow}
                onPress={() => { setCategory(cat); setShowCats(false); }}
              >
                <View style={[styles.catIcon, { backgroundColor: cat.color }]}>
                  <Ionicons name={cat.icon} size={16} color="#fff" />
                </View>
                <Text style={styles.catLabel}>{cat.name.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Animated checkmark */}
        <View style={styles.checkContainer}>
          <Animated.View
            style={[styles.line1, { width: line1.interpolate({ inputRange: [0,1], outputRange: ['0%','40%'] }) }]}
          />
          <Animated.View
            style={[styles.line2, { width: line2.interpolate({ inputRange: [0,1], outputRange: ['0%','60%'] }) }]}
          />
        </View>

        <Text style={styles.successText}>Your transaction is successful</Text>
        <TouchableOpacity style={styles.idBadge}>
          <Text style={styles.idText}>ID: {txId}</Text>
          <Ionicons name="copy-outline" size={14} color="#00a651" />
        </TouchableOpacity>

        {/* Reverse */}
        <TouchableOpacity style={styles.reverseBtn}>
          <View style={styles.reverseCircle}>
            <Ionicons name="refresh" size={24} color="#fff" />
          </View>
          <Text style={styles.reverseText}>REVERSE TRANSACTION</Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }} />

        <TouchableOpacity style={styles.doneBtn} onPress={onDone}>
          <Text style={styles.doneBtnText}>DONE</Text>
        </TouchableOpacity>

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
  name: { fontWeight: '600', marginBottom: 6 },
  infoRow: { flexDirection: 'row', gap: 8, marginBottom: 6, alignItems: 'center' },
  infoLabel: { fontWeight: '600', fontSize: 13 },
  infoValue: { fontWeight: '300', fontSize: 13 },
  amountText: { fontWeight: '500', fontSize: 18 },
  feeText: { color: '#666', fontSize: 12 },
  categoryBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderWidth: 1, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginTop: 8,
  },
  categoryText: { fontWeight: '600' },
  catList: { width: '100%', marginTop: 8 },
  catRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  catIcon: { width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  catLabel: { fontWeight: '600', fontSize: 13 },
  checkContainer: {
    width: 80, height: 80, justifyContent: 'center', alignItems: 'center', marginTop: 12,
  },
  line1: {
    height: 3, backgroundColor: '#00a651', borderRadius: 2,
    position: 'absolute', bottom: 22, left: 16, transformOrigin: 'left',
    transform: [{ rotate: '45deg' }],
  },
  line2: {
    height: 3, backgroundColor: '#00a651', borderRadius: 2,
    position: 'absolute', bottom: 22, left: 30,
    transform: [{ rotate: '-55deg' }],
  },
  successText: { fontSize: 16, fontWeight: '600', color: '#00a651', marginTop: 8 },
  idBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(0,166,81,0.1)', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8, marginTop: 8,
  },
  idText: { color: '#00a651', fontWeight: '500', fontSize: 13 },
  reverseBtn: { alignItems: 'center', marginTop: 16 },
  reverseCircle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(100,100,100,0.5)', justifyContent: 'center', alignItems: 'center',
  },
  reverseText: { fontSize: 11, marginTop: 4, color: '#555' },
  doneBtn: {
    backgroundColor: '#00a651', borderRadius: 25, height: 52,
    width: '100%', justifyContent: 'center', alignItems: 'center',
  },
  doneBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
