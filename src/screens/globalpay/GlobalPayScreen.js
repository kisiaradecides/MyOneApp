// src/screens/globalpay/GlobalPayScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Switch, Modal, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as LocalAuthentication from 'expo-local-authentication';

const CARD_COLORS = ['#1a1a2e','#16213e','#0f3460','#533483','#e94560'];
const CARD_IMAGES_LABELS = ['Elephant','Lion','Waterfall','Savannah','Mountain'];

export default function GlobalPayScreen() {
  const nav = useNavigation();
  const [showDetails, setShowDetails] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [budget, setBudget] = useState(false);
  const [repeatPayments, setRepeatPayments] = useState(false);
  const [blockCard, setBlockCard] = useState(false);
  const [cardColorIdx, setCardColorIdx] = useState(0);
  const [fromAmount, setFromAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [rate] = useState(130); // KES per USD approx
  const timerRef = useRef(null);

  // Auto-hide card details after 10s
  useEffect(() => {
    if (showDetails) {
      setCountdown(10);
      timerRef.current = setInterval(() => {
        setCountdown((v) => {
          if (v <= 1) { setShowDetails(false); clearInterval(timerRef.current); return 10; }
          return v - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [showDetails]);

  const handleSeeDetails = async () => {
    if (showDetails) { setShowDetails(false); return; }
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (enrolled) {
      const res = await LocalAuthentication.authenticateAsync({ promptMessage: 'Authenticate to see card details' });
      if (res.success) setShowDetails(true);
    } else {
      setShowDetails(true);
    }
  };

  const converted = fromAmount ? (parseFloat(fromAmount) / rate).toFixed(2) : '0.00';

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.toolbar}>
        <Text style={styles.toolbarTitle}>GlobalPay</Text>
        <TouchableOpacity onPress={() => nav.goBack()}>
          <Ionicons name="close-circle" size={26} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
        {/* Virtual Card */}
        <View style={[styles.card, { backgroundColor: CARD_COLORS[cardColorIdx] }]}>
          <View style={styles.cardTop}>
            <Text style={styles.cardLabel}>MPESA GLOBAL PAY</Text>
            <Ionicons name="wifi" size={20} color="rgba(255,255,255,0.6)" />
          </View>
          <Text style={styles.cardNumber}>
            {showDetails ? '4532 1234 5678 9012' : '•••• •••• •••• 9012'}
          </Text>
          <View style={styles.cardBottom}>
            <View>
              <Text style={styles.cardMini}>CARD HOLDER</Text>
              <Text style={styles.cardName}>MPESA USER</Text>
            </View>
            <View>
              <Text style={styles.cardMini}>EXPIRES</Text>
              <Text style={styles.cardName}>{showDetails ? '12/28' : '••/••'}</Text>
            </View>
            <View>
              <Text style={styles.cardMini}>CVV</Text>
              <Text style={styles.cardName}>{showDetails ? '123' : '•••'}</Text>
            </View>
            <Text style={styles.visaLabel}>VISA</Text>
          </View>
        </View>

        {/* See details button */}
        <TouchableOpacity style={styles.detailsBtn} onPress={handleSeeDetails}>
          {showDetails
            ? <><Text style={styles.detailsBtnText}>{countdown}</Text><Text style={styles.detailsBtnText}> Hide Card Details</Text></>
            : <><Ionicons name="eye" size={18} color="#fff" /><Text style={styles.detailsBtnText}> See Card Details</Text></>}
        </TouchableOpacity>

        {/* Currency estimator */}
        <View style={styles.estimator}>
          <View style={styles.estimatorRow}>
            <Text style={styles.estimatorTitle}>Cost estimator</Text>
            <Text style={styles.estimatorRate}>1 {currency} = KSH {rate}</Text>
          </View>
          <View style={styles.estimatorField}>
            <View style={styles.currencyTag}><Text style={{ fontWeight: '600' }}>{currency}</Text></View>
            <TextInput
              style={styles.estimatorInput}
              placeholder="Amount"
              keyboardType="decimal-pad"
              value={fromAmount}
              onChangeText={setFromAmount}
            />
          </View>
          <View style={styles.arrowRow}>
            <Ionicons name="arrow-up" size={16} color="#333" />
            <Ionicons name="arrow-down" size={16} color="#333" />
          </View>
          <View style={styles.estimatorField}>
            <View style={styles.currencyTag}><Text style={{ fontWeight: '600' }}>KSH</Text></View>
            <Text style={styles.convertedText}>
              {fromAmount ? (parseFloat(fromAmount) * rate).toFixed(2) : '0'}
            </Text>
          </View>
        </View>

        {/* Toggles */}
        <View style={styles.toggleRow}>
          <View style={styles.toggleLeft}>
            <Ionicons name="wallet" size={20} color="#333" style={styles.toggleIcon} />
            <View>
              <Text style={styles.toggleLabel}>Set budget</Text>
              <Text style={styles.toggleSub}>Track your spend</Text>
            </View>
          </View>
          <Switch value={budget} onValueChange={setBudget} thumbColor="#00a651" />
        </View>
        <View style={styles.divider} />

        <View style={styles.toggleRow}>
          <View style={styles.toggleLeft}>
            <Ionicons name="refresh" size={20} color="#333" style={styles.toggleIcon} />
            <View>
              <Text style={styles.toggleLabel}>Enable Repeat Payments</Text>
              <Text style={styles.toggleSub}>Pay for your subscription</Text>
            </View>
          </View>
          <Switch value={repeatPayments} onValueChange={setRepeatPayments} thumbColor="#00a651" />
        </View>
        <View style={styles.divider} />

        <View style={styles.toggleRow}>
          <View style={styles.toggleLeft}>
            <Ionicons name="ban" size={20} color="#333" style={styles.toggleIcon} />
            <View>
              <Text style={styles.toggleLabel}>Block Card</Text>
              <Text style={styles.toggleSub}>Temporarily block card</Text>
            </View>
          </View>
          <Switch
            value={blockCard}
            onValueChange={(v) => {
              if (v) Alert.alert('Block Card', 'Are you sure you want to block your card?',
                [{ text: 'Cancel' }, { text: 'Block', onPress: () => setBlockCard(true), style: 'destructive' }]);
              else setBlockCard(false);
            }}
            thumbColor="#d62828"
          />
        </View>

        {/* Card customization */}
        <Text style={[styles.toggleLabel, { marginTop: 20, marginBottom: 12 }]}>CARD BACKGROUND</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CARD_COLORS.map((c, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setCardColorIdx(i)}
              style={[styles.colorSwatch, { backgroundColor: c, borderWidth: cardColorIdx === i ? 3 : 0, borderColor: '#00a651' }]}
            >
              <Text style={{ color: '#fff', fontSize: 9 }}>{CARD_IMAGES_LABELS[i]}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 52, paddingBottom: 12,
  },
  toolbarTitle: { fontSize: 18, fontWeight: '700' },
  card: {
    borderRadius: 16, padding: 20, marginBottom: 12,
    height: 200, justifyContent: 'space-between',
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600' },
  cardNumber: { color: '#fff', fontSize: 20, letterSpacing: 4, fontWeight: '300' },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardMini: { color: 'rgba(255,255,255,0.6)', fontSize: 9 },
  cardName: { color: '#fff', fontSize: 12, fontWeight: '600' },
  visaLabel: { color: '#fff', fontSize: 22, fontWeight: '900', fontStyle: 'italic' },
  detailsBtn: {
    backgroundColor: '#333', borderRadius: 25, height: 46,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6,
    marginBottom: 16,
  },
  detailsBtnText: { color: '#fff', fontWeight: '600' },
  estimator: {
    backgroundColor: 'rgba(0,119,182,0.08)', borderRadius: 10,
    padding: 14, marginBottom: 16,
  },
  estimatorRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  estimatorTitle: { fontWeight: '600' },
  estimatorRate: { color: '#666', fontSize: 12 },
  estimatorField: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ccc',
    borderRadius: 6, overflow: 'hidden', marginBottom: 4, height: 36,
  },
  currencyTag: {
    width: 60, height: '100%', backgroundColor: 'rgba(0,119,182,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  estimatorInput: { flex: 1, paddingHorizontal: 10 },
  convertedText: { flex: 1, paddingHorizontal: 10, fontSize: 16 },
  arrowRow: { flexDirection: 'row', justifyContent: 'center', marginVertical: 4 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  toggleLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  toggleIcon: { marginRight: 12 },
  toggleLabel: { fontWeight: '600', fontSize: 13 },
  toggleSub: { color: '#888', fontSize: 11 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: '#ccc' },
  colorSwatch: {
    width: 60, height: 40, borderRadius: 8, marginRight: 8,
    justifyContent: 'center', alignItems: 'center',
  },
});
