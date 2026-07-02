// src/components/modals/SendRequestModal.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Modal, FlatList, ActivityIndicator, Alert,
} from 'react-native';
import * as Contacts from 'expo-contacts';
import { Ionicons } from '@expo/vector-icons';
import AmountScreen from '../transaction/AmountScreen';
import ConfirmScreen from '../transaction/ConfirmScreen';
import SuccessScreen from '../transaction/SuccessScreen';

export default function SendRequestModal({ visible, path, onClose, onDone }) {
  const [step, setStep] = useState('contacts'); // contacts|amount|confirm|success
  const [contacts, setContacts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [manualPhone, setManualPhone] = useState('');
  const [amount, setAmount] = useState(0);
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [currentPath, setCurrentPath] = useState(path);

  useEffect(() => {
    setCurrentPath(path);
  }, [path]);

  useEffect(() => {
    if (visible) {
      setStep('contacts');
      setSelectedContact(null);
      setAmount(0);
      setSearch('');
      setShowPhoneInput(false);
      loadContacts();
    }
  }, [visible]);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
        });
        const withPhone = data.filter((c) => c.phoneNumbers?.length > 0).map((c) => ({
          id: c.id,
          givenName: c.firstName || '',
          familyName: c.lastName || '',
          mobileNumber: c.phoneNumbers[0].number,
        }));
        setContacts(withPhone);
        setFiltered(withPhone);
      }
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => {
    if (!search) { setFiltered(contacts); return; }
    setFiltered(contacts.filter((c) =>
      c.givenName.toLowerCase().includes(search.toLowerCase()) ||
      c.familyName.toLowerCase().includes(search.toLowerCase()) ||
      c.mobileNumber.includes(search)
    ));
  }, [search, contacts]);

  const selectContact = (contact) => {
    setSelectedContact(contact);
    setStep('amount');
  };

  const handlePhoneContinue = () => {
    if (manualPhone.length < 9) { Alert.alert('Invalid phone number'); return; }
    setSelectedContact({ givenName: '', familyName: '', mobileNumber: manualPhone });
    setStep('amount');
  };

  const initials = (c) =>
    ((c?.familyName?.[0] ?? '') + (c?.givenName?.[0] ?? '')).toUpperCase() || '?';

  if (!visible) return null;

  if (step === 'amount') return (
    <AmountScreen
      contact={selectedContact}
      sendOrRequest={currentPath}
      onBack={() => setStep('contacts')}
      onContinue={(amt) => { setAmount(amt); setStep('confirm'); }}
    />
  );

  if (step === 'confirm') return (
    <ConfirmScreen
      contact={selectedContact}
      amount={amount}
      transactionType={currentPath === 'send' ? 'sendMoney' : 'requestMoney'}
      onBack={() => setStep('amount')}
      onSuccess={() => setStep('success')}
    />
  );

  if (step === 'success') return (
    <SuccessScreen
      contact={selectedContact}
      amount={amount}
      transactionType={currentPath === 'send' ? 'sendMoney' : 'requestMoney'}
      onDone={onDone}
    />
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={26} color="#333" />
          </TouchableOpacity>
          {/* Send / Request toggle */}
          <View style={styles.toggle}>
            <TouchableOpacity
              style={[styles.toggleBtn, currentPath === 'send' && styles.toggleActive]}
              onPress={() => setCurrentPath('send')}
            >
              <Text style={[styles.toggleText, currentPath === 'send' && { color: '#fff' }]}>SEND</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, currentPath === 'request' && styles.toggleActive]}
              onPress={() => setCurrentPath('request')}
            >
              <Text style={[styles.toggleText, currentPath === 'request' && { color: '#fff' }]}>REQUEST</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#fff" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Contacts"
            placeholderTextColor="#aaa"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Enter phone manually */}
        <TouchableOpacity style={styles.phoneRow} onPress={() => setShowPhoneInput((v) => !v)}>
          <View style={styles.blueCircle}>
            <Ionicons name="keypad" size={18} color="#fff" />
          </View>
          <Text style={styles.phoneLabel}>ENTER PHONE NUMBER</Text>
        </TouchableOpacity>

        {showPhoneInput && (
          <View style={styles.manualInput}>
            <TextInput
              style={styles.manualField}
              placeholder="e.g. +254712345678"
              value={manualPhone}
              onChangeText={setManualPhone}
              keyboardType="phone-pad"
              autoFocus
            />
            <TouchableOpacity style={styles.continueBtn} onPress={handlePhoneContinue}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>CONTINUE</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Contacts list */}
        {loading
          ? <ActivityIndicator color="#00a651" style={{ marginTop: 20 }} />
          : (
            <FlatList
              data={filtered}
              keyExtractor={(c) => c.id || c.mobileNumber}
              ListHeaderComponent={<Text style={styles.freqLabel}>FREQUENTS</Text>}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.contactRow} onPress={() => selectContact(item)}>
                  <View style={styles.contactAvatar}>
                    <Text style={styles.contactInitials}>{initials(item)}</Text>
                  </View>
                  <View>
                    <Text style={styles.contactName}>{item.givenName} {item.familyName}</Text>
                    <Text style={styles.contactPhone}>{item.mobileNumber}</Text>
                  </View>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 52, paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  toggle: {
    flexDirection: 'row', backgroundColor: 'rgba(150,150,150,0.4)',
    borderRadius: 20, marginLeft: 12, overflow: 'hidden',
  },
  toggleBtn: { paddingHorizontal: 18, paddingVertical: 8 },
  toggleActive: { backgroundColor: 'rgba(100,100,100,0.8)' },
  toggleText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 8, marginBottom: 14,
  },
  searchInput: { flex: 1, marginLeft: 8, color: '#333' },
  phoneRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  blueCircle: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#0077b6', justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  phoneLabel: { color: '#0077b6', fontWeight: '700', fontSize: 14 },
  manualInput: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  manualField: {
    flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 10, fontSize: 16,
  },
  continueBtn: {
    backgroundColor: '#00a651', borderRadius: 8,
    paddingHorizontal: 14, paddingVertical: 10,
  },
  freqLabel: { fontWeight: '600', fontSize: 13, marginBottom: 10 },
  contactRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  contactAvatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  contactInitials: { fontWeight: '300' },
  contactName: { fontSize: 14, fontWeight: '500' },
  contactPhone: { fontSize: 12, color: '#666' },
});
