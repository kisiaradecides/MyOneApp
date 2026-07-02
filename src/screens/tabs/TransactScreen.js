// src/screens/tabs/TransactScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import SendRequestModal from '../../components/modals/SendRequestModal';
import PayBillModal from '../../components/modals/PayBillModal';
import BuyGoodsModal from '../../components/modals/BuyGoodsModal';
import WithdrawModal from '../../components/modals/WithdrawModal';
import BuyAirtimeModal from '../../components/modals/BuyAirtimeModal';
import { useApp } from '../../context/AppContext';

const FREQUENTS = [
  { code: 'JD', title: 'JOHN DOE', type: 'Send Money', color: '#7209b7' },
  { code: 'KP', title: 'KPLC PREPAID', type: 'Pay Bill', color: '#0077b6' },
  { code: 'NS', title: 'Naivas', type: 'Buy Goods', color: '#f9c74f' },
  { code: 'NH', title: 'NHIF', type: 'Pay Bill', color: '#00a651' },
];

export default function TransactScreen() {
  const nav = useNavigation();
  const { refreshUserData } = useApp();
  const [sendModal, setSendModal] = useState(false);
  const [sendPath, setSendPath] = useState('send');
  const [payBill, setPayBill] = useState(false);
  const [buyGoods, setBuyGoods] = useState(false);
  const [withdraw, setWithdraw] = useState(false);
  const [airtime, setAirtime] = useState(false);

  const ActionIcon = ({ icon, bg, label, onPress, mcIcon }) => (
    <TouchableOpacity style={styles.actionItem} onPress={onPress}>
      <View style={[styles.actionCircle, { backgroundColor: bg }]}>
        {mcIcon
          ? <MaterialCommunityIcons name={icon} size={20} color="#fff" />
          : <Ionicons name={icon} size={20} color="#fff" />}
      </View>
      <Text style={styles.actionLabel} numberOfLines={2}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.toolbar}>
        <Text style={styles.toolbarTitle}>Transact</Text>
        <Ionicons name="search" size={22} color="#333" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
        {/* Frequents */}
        <Text style={styles.sectionLabel}>FREQUENTS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
          {FREQUENTS.map((f) => (
            <View key={f.code} style={styles.freqItem}>
              <View style={[styles.freqCircle, { backgroundColor: 'rgba(0,0,0,0.1)' }]}>
                <Text style={[styles.freqInitial, { color: f.color }]}>{f.code}</Text>
              </View>
              <Text style={styles.freqTitle}>{f.title}</Text>
              <Text style={styles.freqType}>{f.type}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Financial */}
        <Text style={styles.sectionLabel}>FINANCIAL SERVICES</Text>
        <View style={styles.iconRow}>
          <ActionIcon icon="logo-usd" bg="#0077b6" label="FULIZA" />
          <ActionIcon icon="briefcase" bg="#06d6a0" label="KCB M-PESA" />
          <TouchableOpacity style={styles.actionItem} onPress={() => nav.navigate('Mshwari')}>
            <View style={[styles.actionCircle, { backgroundColor: '#00a651' }]}>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>M</Text>
            </View>
            <Text style={styles.actionLabel}>M-SHWARI</Text>
          </TouchableOpacity>
        </View>

        {/* Send & Request */}
        <Text style={styles.sectionLabel}>SEND AND REQUEST</Text>
        <View style={styles.iconRow}>
          <ActionIcon icon="arrow-up" bg="#00a651" label="SEND MONEY" onPress={() => { setSendPath('send'); setSendModal(true); }} />
          <ActionIcon icon="arrow-down" bg="#00a651" label="RECEIVE MONEY" onPress={() => { setSendPath('request'); setSendModal(true); }} />
          <ActionIcon icon="people" bg="#00a651" label="SEND TO MANY" />
        </View>
        <View style={styles.iconRow}>
          <ActionIcon icon="globe-outline" bg="#00a651" label="GLOBAL" />
        </View>

        {/* Pay */}
        <Text style={styles.sectionLabel}>PAY</Text>
        <View style={styles.iconRow}>
          <ActionIcon icon="document-text" bg="#0077b6" label="PAY BILL" onPress={() => setPayBill(true)} />
          <ActionIcon icon="basket" bg="#0077b6" label="BUY GOODS" onPress={() => setBuyGoods(true)} />
          <ActionIcon icon="phone-portrait" bg="#0077b6" label="POCHI" />
        </View>
        <View style={styles.iconRow}>
          <ActionIcon icon="card" bg="#0077b6" label="GLOBAL PAY" onPress={() => nav.navigate('GlobalPay')} />
        </View>

        {/* Withdraw */}
        <Text style={styles.sectionLabel}>WITHDRAW</Text>
        <View style={styles.iconRow}>
          <ActionIcon icon="storefront" bg="#d62828" label="WITHDRAW AT AGENT" onPress={() => setWithdraw(true)} mcIcon />
          <ActionIcon icon="atm" bg="#d62828" label="WITHDRAW AT ATM" onPress={() => setWithdraw(true)} mcIcon />
        </View>

        {/* Airtime */}
        <Text style={styles.sectionLabel}>AIRTIME</Text>
        <View style={styles.iconRow}>
          <ActionIcon icon="call" bg="#7209b7" label="AIRTIME FOR MY NUMBER" onPress={() => setAirtime(true)} />
          <ActionIcon icon="phone-portrait" bg="#7209b7" label="AIRTIME FOR OTHER" />
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      <SendRequestModal visible={sendModal} path={sendPath} onClose={() => setSendModal(false)} onDone={() => { setSendModal(false); refreshUserData(); }} />
      <PayBillModal visible={payBill} onClose={() => setPayBill(false)} />
      <BuyGoodsModal visible={buyGoods} onClose={() => setBuyGoods(false)} />
      <WithdrawModal visible={withdraw} onClose={() => setWithdraw(false)} onDone={() => { setWithdraw(false); refreshUserData(); }} />
      <BuyAirtimeModal visible={airtime} onClose={() => setAirtime(false)} onDone={() => { setAirtime(false); refreshUserData(); }} />
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
  sectionLabel: { fontWeight: '700', fontSize: 13, marginBottom: 12, marginTop: 4 },
  iconRow: { flexDirection: 'row', marginBottom: 16, gap: 8 },
  actionItem: { alignItems: 'center', width: 80 },
  actionCircle: {
    width: 52, height: 52, borderRadius: 26,
    justifyContent: 'center', alignItems: 'center', marginBottom: 4,
  },
  actionLabel: { fontSize: 10, textAlign: 'center', lineHeight: 13 },
  freqItem: { width: 80, alignItems: 'center', marginRight: 12 },
  freqCircle: {
    width: 42, height: 42, borderRadius: 21,
    justifyContent: 'center', alignItems: 'center', marginBottom: 4,
  },
  freqInitial: { fontWeight: '700' },
  freqTitle: { fontSize: 10, fontWeight: '600', textAlign: 'center' },
  freqType: { fontSize: 9, color: '#666', textAlign: 'center' },
});
