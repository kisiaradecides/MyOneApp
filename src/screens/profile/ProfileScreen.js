// src/screens/profile/ProfileScreen.js
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Switch, Modal, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../../context/AppContext';
import { logout } from '../../firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Row = ({ icon, label, color, right }) => (
  <View style={rowStyles.row}>
    <View style={[rowStyles.iconCircle, { backgroundColor: color }]}>
      <Ionicons name={icon} size={18} color="#fff" />
    </View>
    <Text style={rowStyles.label}>{label.toUpperCase()}</Text>
    {right && <View style={{ marginLeft: 'auto' }}>{right}</View>}
  </View>
);

const rowStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  iconCircle: {
    width: 38, height: 38, borderRadius: 19,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  label: { fontWeight: '600', fontSize: 13 },
});

export default function ProfileScreen({ route }) {
  const nav = useNavigation();
  const { username, userPhone, setUserLoggedIn, setIsAuthenticated } = useApp();
  const [biometric, setBiometric] = useState(true);
  const [fastLogin, setFastLogin] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      await AsyncStorage.removeItem('sessionInfo');
      setIsAuthenticated(false);
      setUserLoggedIn(false);
      setShowLogout(false);
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={() => nav.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.toolbarTitle}>ACCOUNT</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Profile header */}
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={32} color="#666" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.profileName}>{username}</Text>
            <Text style={styles.profilePhone}>{userPhone}</Text>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnText}>EDIT PICTURE</Text>
          </TouchableOpacity>
        </View>

        {/* Quick actions */}
        <View style={styles.quickRow}>
          {[
            { icon: 'briefcase', label: 'M-Pesa\nStatements' },
            { icon: 'book', label: 'M-Pesa\nStatements' },
            { icon: 'pie-chart', label: 'My Spend' },
          ].map((q) => (
            <TouchableOpacity key={q.label} style={styles.quickItem}>
              <View style={styles.quickCircle}>
                <Ionicons name={q.icon} size={22} color="#333" />
              </View>
              <Text style={styles.quickLabel}>{q.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>SETTINGS</Text>
        <Row icon="star" label="Manage Favourites" color="#e63946" />
        <Row icon="link" label="Share App Link" color="#0077b6" />
        <Row icon="ban" label="Blocked Businesses" color="#d62828" />
        <Row icon="moon" label="Appearance" color="#888" />
        <Row icon="log-out" label="Log Out" color="#06d6a0"
          right={
            <TouchableOpacity onPress={() => setShowLogout(true)}>
              <Ionicons name="chevron-forward" size={18} color="#aaa" />
            </TouchableOpacity>
          }
        />

        <Text style={styles.sectionLabel}>SECURITY</Text>
        <Row icon="finger-print" label="Biometric Authentication" color="#00a651"
          right={<Switch value={biometric} onValueChange={setBiometric} thumbColor="#00a651" />}
        />
        <Row icon="lock-closed" label="Fast Login" color="#4361ee"
          right={<Switch value={fastLogin} onValueChange={setFastLogin} thumbColor="#4361ee" />}
        />
        <Row icon="key" label="Change PIN" color="#06d6a0" />

        <Text style={styles.sectionLabel}>SUPPORT</Text>
        <Row icon="call" label="Call Support" color="#d62828" />
        <Row icon="book-open" label="FAQs" color="#4cc9f0" />
        <Row icon="globe" label="Visit Website" color="#00a651" />

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Logout modal */}
      <Modal visible={showLogout} transparent animationType="slide" onRequestClose={() => setShowLogout(false)}>
        <TouchableOpacity style={styles.modalBg} activeOpacity={1} onPress={() => setShowLogout(false)} />
        <View style={styles.modalSheet}>
          <Text style={styles.modalTitle}>LOG OUT</Text>
          <Text style={styles.modalBody}>
            You are about to logout from this device. You will need to sign in again to use M-PESA.
          </Text>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutBtn}>LOG OUT</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity onPress={() => setShowLogout(false)}>
            <Text style={styles.cancelBtn}>CANCEL</Text>
          </TouchableOpacity>
          <View style={{ height: 24 }} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 52, paddingBottom: 12,
  },
  toolbarTitle: { fontSize: 18, fontWeight: '700' },
  profileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center',
  },
  profileName: { fontSize: 16, fontWeight: '600' },
  profilePhone: { color: '#666', marginTop: 2 },
  editBtn: {
    borderWidth: 1, borderColor: '#333', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  editBtnText: { fontSize: 10, fontWeight: '700' },
  quickRow: { flexDirection: 'row', gap: 20, marginBottom: 20 },
  quickItem: { alignItems: 'center', flex: 1 },
  quickCircle: {
    width: 52, height: 52, borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.07)', justifyContent: 'center', alignItems: 'center', marginBottom: 4,
  },
  quickLabel: { fontSize: 10, textAlign: 'center', color: '#333' },
  sectionLabel: { fontWeight: '700', fontSize: 13, marginBottom: 16, marginTop: 8 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  modalSheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 24, alignItems: 'center',
  },
  modalTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  modalBody: { textAlign: 'center', color: '#555', marginBottom: 20, lineHeight: 20 },
  logoutBtn: { color: '#d62828', fontWeight: '700', fontSize: 16, marginBottom: 16 },
  divider: { width: '100%', height: StyleSheet.hairlineWidth, backgroundColor: '#ccc', marginBottom: 16 },
  cancelBtn: { fontWeight: '700', fontSize: 16 },
});
