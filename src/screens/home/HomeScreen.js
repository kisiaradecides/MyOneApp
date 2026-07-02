// src/screens/home/HomeScreen.js
import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  FlatList, Dimensions, Modal, RefreshControl, Image,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import SendRequestModal from '../../components/modals/SendRequestModal';
import TransactionTypeModal from '../../components/modals/TransactionTypeModal';
import IncomingRequestModal from '../../components/modals/IncomingRequestModal';
import PayBillModal from '../../components/modals/PayBillModal';
import BuyGoodsModal from '../../components/modals/BuyGoodsModal';
import WithdrawModal from '../../components/modals/WithdrawModal';
import BuyAirtimeModal from '../../components/modals/BuyAirtimeModal';
import { useNavigation } from '@react-navigation/native';
import { approveRequest, clearRequestState } from '../../firebase/database';

const { width } = Dimensions.get('window');
const CAROUSEL_COLORS = ['#1a472a','#2d6a4f','#40916c','#52b788','#74c69d'];

export default function HomeScreen() {
  const nav = useNavigation();
  const {
    username, mpesaBalance, transactions,
    requestState, setRequestState, refreshUserData,
    userPhone,
  } = useApp();

  const [showBalance, setShowBalance] = useState(false);
  const [txTypeModal, setTxTypeModal] = useState(false);
  const [txType, setTxType] = useState('send'); // send|pay|withdraw|airtime
  const [refreshing, setRefreshing] = useState(false);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const carouselRef = useRef(null);

  // Sub-modal states
  const [sendModal, setSendModal] = useState(false);
  const [sendPath, setSendPath] = useState('send');
  const [payBillModal, setPayBillModal] = useState(false);
  const [buyGoodsModal, setBuyGoodsModal] = useState(false);
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [airtimeModal, setAirtimeModal] = useState(false);

  // Auto scroll carousel
  React.useEffect(() => {
    const t = setInterval(() => {
      const next = (carouselIdx + 1) % CAROUSEL_COLORS.length;
      carouselRef.current?.scrollToIndex({ index: next, animated: true });
      setCarouselIdx(next);
    }, 3500);
    return () => clearInterval(t);
  }, [carouselIdx]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshUserData();
    setRefreshing(false);
  };

  const openTxType = (type) => {
    setTxType(type);
    setTxTypeModal(true);
  };

  const handleTxTypeSelect = (action) => {
    setTxTypeModal(false);
    setTimeout(() => {
      if (action === 'sendMoney') { setSendPath('send'); setSendModal(true); }
      else if (action === 'requestMoney') { setSendPath('request'); setSendModal(true); }
      else if (action === 'payBill') setPayBillModal(true);
      else if (action === 'buyGoods') setBuyGoodsModal(true);
      else if (action === 'withdraw') setWithdrawModal(true);
      else if (action === 'airtime') setAirtimeModal(true);
    }, 300);
  };

  const latest = transactions[0];
  const fmt = (d) => {
    const dd = new Date(d);
    return dd.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
      + ', ' + dd.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const SERVICE_SECTIONS = [
    {
      title: 'Financial Services',
      items: [
        { label: 'MĀLI', bg: '#00a651', text: '#fff', isText: true },
        { label: 'M-SHWARI', bg: '#888', text: '#fff', isText: true, onPress: () => nav.navigate('Mshwari') },
        { label: 'KCB M-PESA', bg: '#003087', text: '#fff', isText: true },
        { label: 'MPESA RATIBA', bg: '#00a651', text: '#fff', isText: true },
      ],
    },
    {
      title: 'Public Sector',
      items: [
        { label: 'MYCOUNTY', bg: '#eee', text: '#333', isText: true },
        { label: 'Hustler Fund', bg: '#f4a261', text: '#fff', isText: true },
        { label: 'NHIF', bg: '#457b9d', text: '#fff', isText: true },
        { label: 'NSSF', bg: '#e63946', text: '#fff', isText: true },
      ],
    },
    {
      title: 'Transport & Travel',
      items: [
        { label: 'FLIGHTS', bg: '#023e8a', text: '#fff', isText: true },
        { label: 'SGR', bg: '#d62828', text: '#fff', isText: true },
        { label: 'BUS', bg: '#4cc9f0', text: '#333', isText: true },
        { label: 'TRIPS', bg: '#7209b7', text: '#fff', isText: true },
      ],
    },
    {
      title: 'Health & Wellness',
      items: [
        { label: 'MDAKTARI', bg: '#e63946', text: '#fff', isText: true },
        { label: 'NHIF', bg: '#457b9d', text: '#fff', isText: true },
        { label: 'INSURANCE', bg: '#2dc653', text: '#fff', isText: true },
        { label: 'SASADOCTOR', bg: '#f77f00', text: '#fff', isText: true },
      ],
    },
    {
      title: 'Education',
      items: [
        { label: 'HELB', bg: '#003049', text: '#fff', isText: true },
        { label: 'KUCCPS', bg: '#023e8a', text: '#fff', isText: true },
        { label: 'KNEC', bg: '#4cc9f0', text: '#333', isText: true },
        { label: 'TVET', bg: '#7209b7', text: '#fff', isText: true },
      ],
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00a651" />}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Top bar ── */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => nav.navigate('Profile')}>
            <View style={styles.avatarSmall}>
              <Ionicons name="person" size={22} color="#666" />
            </View>
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.greeting}>Good Morning</Text>
            <Text style={styles.username}>{username} 👋</Text>
          </View>
          <Ionicons name="notifications-outline" size={24} color="#333" style={{ marginRight: 14 }} />
          <TouchableOpacity onPress={() => nav.navigate('Stats')}>
            <Ionicons name="pie-chart-outline" size={24} color="#333" style={{ marginRight: 14 }} />
          </TouchableOpacity>
          <Ionicons name="qr-code-outline" size={24} color="#333" />
        </View>

        <View style={{ paddingHorizontal: 10 }}>
          {/* ── Balance card ── */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Balance</Text>
            <Text style={[styles.balanceAmount, showBalance && styles.blurred]}>
              KSH. {mpesaBalance.toLocaleString('en', { minimumFractionDigits: 2 })}
            </Text>
            <Text style={styles.fuliza}>Available FULIZA: KSH 500.00</Text>
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowBalance((v) => !v)}
            >
              <Ionicons name={showBalance ? 'eye' : 'eye-off'} size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* ── Action buttons ── */}
          <View style={styles.actionRow}>
            {[
              { label: 'SEND AND\nREQUEST', icon: 'arrow-left-right', type: 'send', color: '#00a651' },
              { label: 'PAY', icon: 'credit-card', type: 'pay', color: '#0077b6' },
              { label: 'WITHDRAW', icon: 'cash-multiple', type: 'withdraw', color: '#d62828' },
              { label: 'AIRTIME', icon: 'cellphone', type: 'airtime', color: '#7209b7' },
            ].map((a) => (
              <TouchableOpacity key={a.type} style={styles.actionBtn} onPress={() => openTxType(a.type)}>
                <View style={[styles.actionCircle, { backgroundColor: a.color }]}>
                  <MaterialCommunityIcons name={a.icon} size={20} color="#fff" />
                </View>
                <Text style={styles.actionLabel}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Statements preview ── */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>M-PESA STATEMENTS</Text>
            <TouchableOpacity onPress={() => nav.navigate('Statements')}>
              <Text style={styles.seeAll}>SEE ALL</Text>
            </TouchableOpacity>
          </View>

          {latest ? (
            <View style={[styles.txRow, showBalance && { opacity: 0.3 }]}>
              <View style={styles.txAvatar}>
                <Text style={styles.txInitials}>
                  {(latest.contact?.familyName?.[0] ?? '') + (latest.contact?.givenName?.[0] ?? '')}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.txName}>
                  {latest.contact?.familyName} {latest.contact?.givenName}
                </Text>
                <Text style={styles.txPhone}>{latest.contact?.mobileNumber || latest.phoneNumber}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.txAmount}>
                  -KSH. {latest.amount.toLocaleString('en', { minimumFractionDigits: 2 })}
                </Text>
                <Text style={styles.txDate}>{fmt(latest.date)}</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.noTx}>No transactions available</Text>
          )}

          {/* ── Carousel ── */}
          <FlatList
            ref={carouselRef}
            data={CAROUSEL_COLORS}
            keyExtractor={(_, i) => String(i)}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.carousel}
            renderItem={({ item }) => (
              <View style={[styles.carouselSlide, { backgroundColor: item }]}>
                <Text style={styles.carouselText}>M-PESA</Text>
              </View>
            )}
          />

          {/* ── Service sections ── */}
          {SERVICE_SECTIONS.map((sec) => (
            <View key={sec.title} style={styles.serviceSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{sec.title}</Text>
                <Text style={styles.seeAll}>SEE ALL</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.serviceRow}>
                  {sec.items.map((item, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.serviceItem}
                      onPress={item.onPress}
                    >
                      <View style={[styles.serviceCircle, { backgroundColor: item.bg }]}>
                        <Text style={[styles.serviceCircleText, { color: item.text }]} numberOfLines={1}>
                          {item.label.substring(0, 4)}
                        </Text>
                      </View>
                      <Text style={styles.serviceLabel} numberOfLines={2}>{item.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          ))}

          <View style={{ height: 24 }} />
        </View>
      </ScrollView>

      {/* ── Modals ── */}
      <TransactionTypeModal
        visible={txTypeModal}
        txType={txType}
        onSelect={handleTxTypeSelect}
        onClose={() => setTxTypeModal(false)}
      />
      <SendRequestModal
        visible={sendModal}
        path={sendPath}
        onClose={() => setSendModal(false)}
        onDone={() => { setSendModal(false); refreshUserData(); }}
      />
      <PayBillModal visible={payBillModal} onClose={() => setPayBillModal(false)} />
      <BuyGoodsModal visible={buyGoodsModal} onClose={() => setBuyGoodsModal(false)} />
      <WithdrawModal
        visible={withdrawModal}
        onClose={() => setWithdrawModal(false)}
        onDone={() => { setWithdrawModal(false); refreshUserData(); }}
      />
      <BuyAirtimeModal
        visible={airtimeModal}
        onClose={() => setAirtimeModal(false)}
        onDone={() => { setAirtimeModal(false); refreshUserData(); }}
      />

      {/* ── Incoming Request ── */}
      <IncomingRequestModal
        visible={requestState}
        name="Incoming Request"
        amount={500}
        onApprove={async () => {
          try {
            await approveRequest('+15555648583', userPhone);
            await clearRequestState();
            setRequestState(false);
            await refreshUserData();
          } catch (e) { alert(e.message); }
        }}
        onDecline={async () => {
          await clearRequestState();
          setRequestState(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingTop: 52, paddingBottom: 12,
    backgroundColor: '#fff',
  },
  avatarSmall: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center',
  },
  greeting: { fontSize: 12, color: '#666', fontWeight: '300' },
  username: { fontSize: 15, fontWeight: '800' },
  balanceCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 18,
    marginTop: 10, marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  balanceLabel: { textAlign: 'center', color: '#666', fontWeight: '300', marginBottom: 4 },
  balanceAmount: { textAlign: 'center', fontSize: 26, fontWeight: '300' },
  blurred: { opacity: 0.1 },
  fuliza: { textAlign: 'center', color: '#0077b6', fontWeight: '300', fontSize: 13, marginTop: 4 },
  eyeBtn: { position: 'absolute', right: 18, top: 18 },
  actionRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionBtn: { alignItems: 'center', flex: 1 },
  actionCircle: {
    width: 48, height: 48, borderRadius: 24,
    justifyContent: 'center', alignItems: 'center', marginBottom: 4,
  },
  actionLabel: { fontSize: 10, fontWeight: '300', textAlign: 'center' },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 8,
  },
  sectionTitle: { fontWeight: '600', fontSize: 13 },
  seeAll: { color: '#00a651', fontWeight: '700', fontSize: 13 },
  txRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  txAvatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(0,166,81,0.15)', justifyContent: 'center', alignItems: 'center',
    marginRight: 10,
  },
  txInitials: { color: '#00a651', fontWeight: '700', fontSize: 14 },
  txName: { fontWeight: '500', fontSize: 14 },
  txPhone: { color: '#666', fontSize: 12 },
  txAmount: { fontWeight: '300', fontSize: 13 },
  txDate: { color: '#666', fontSize: 11 },
  noTx: { color: '#666', fontWeight: '300', marginBottom: 12 },
  carousel: { height: 120, marginBottom: 16, borderRadius: 12, overflow: 'hidden' },
  carouselSlide: { width: width - 20, height: 120, justifyContent: 'center', alignItems: 'center' },
  carouselText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  serviceSection: { marginBottom: 16 },
  serviceRow: { flexDirection: 'row', paddingBottom: 4 },
  serviceItem: { width: 80, alignItems: 'center', marginRight: 12 },
  serviceCircle: {
    width: 52, height: 52, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', marginBottom: 4,
  },
  serviceCircleText: { fontSize: 10, fontWeight: '700' },
  serviceLabel: { fontSize: 10, textAlign: 'center', fontWeight: '300' },
});
