// src/screens/home/StatementsScreen.js
import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  TextInput, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { useNavigation } from '@react-navigation/native';

export default function StatementsScreen() {
  const nav = useNavigation();
  const { transactions, refreshUserData } = useApp();
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const filtered = search
    ? transactions.filter((t) =>
        (t.contact?.givenName + ' ' + t.contact?.familyName).toLowerCase().includes(search.toLowerCase()) ||
        (t.contact?.mobileNumber ?? '').includes(search)
      )
    : transactions;

  const fmt = (d) => {
    const dd = new Date(d);
    return dd.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) +
      ', ' + dd.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshUserData();
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Toolbar */}
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={() => nav.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        {showSearch
          ? <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              value={search}
              onChangeText={setSearch}
              autoFocus
            />
          : <Text style={styles.toolbarTitle}>M-PESA STATEMENTS</Text>}
        <TouchableOpacity onPress={() => { setShowSearch((v) => !v); setSearch(''); }}>
          <Ionicons name={showSearch ? 'close-circle' : 'search'} size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(_, i) => String(i)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00a651" />}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.empty}>No transactions yet</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.avatar}>
              <Text style={styles.initials}>
                {(item.contact?.familyName?.[0] ?? '') + (item.contact?.givenName?.[0] ?? '')}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.contact?.givenName} {item.contact?.familyName}</Text>
              <Text style={styles.phone}>{item.contact?.mobileNumber || item.phoneNumber}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.amount}>
                -KSH. {item.amount.toLocaleString('en', { minimumFractionDigits: 2 })}
              </Text>
              <Text style={styles.date}>{fmt(item.date)}</Text>
            </View>
          </View>
        )}
      />

      {/* Export button */}
      <View style={styles.exportRow}>
        <View style={styles.exportBtn}>
          <Ionicons name="document-outline" size={18} color="#00a651" />
          <Text style={styles.exportText}>EXPORT STATEMENTS</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 52, paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#eee',
  },
  toolbarTitle: { fontWeight: '600', fontSize: 15 },
  searchInput: { flex: 1, marginHorizontal: 12, fontSize: 15, borderBottomWidth: 1, borderColor: '#00a651' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  avatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(0,166,81,0.15)', justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  initials: { color: '#00a651', fontWeight: '700' },
  name: { fontWeight: '500', fontSize: 14 },
  phone: { color: '#666', fontSize: 12 },
  amount: { fontWeight: '300', fontSize: 13 },
  date: { color: '#666', fontSize: 11 },
  empty: { textAlign: 'center', color: '#aaa', marginTop: 40 },
  exportRow: { padding: 16, alignItems: 'flex-end' },
  exportBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: 16,
    paddingHorizontal: 14, paddingVertical: 10,
  },
  exportText: { color: '#00a651', fontWeight: '600', fontSize: 13 },
});
