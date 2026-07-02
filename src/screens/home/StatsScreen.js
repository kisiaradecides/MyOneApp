// src/screens/home/StatsScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useApp } from '../../context/AppContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

export default function StatsScreen() {
  const nav = useNavigation();
  const { transactions } = useApp();

  const amounts = transactions.slice(0, 10).map((t) => t.amount || 0);
  const labels = amounts.map((_, i) => String(i + 1));

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={() => nav.goBack()}>
          <Ionicons name="close" size={26} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Spending Stats</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {amounts.length > 0 ? (
          <LineChart
            data={{ labels, datasets: [{ data: amounts }] }}
            width={width - 32}
            height={260}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              color: () => '#00a651',
              labelColor: () => '#666',
              strokeWidth: 2,
            }}
            bezier
            style={{ borderRadius: 12 }}
          />
        ) : (
          <Text style={styles.empty}>No transaction data yet</Text>
        )}

        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {transactions.slice(0, 5).map((t, i) => (
          <View key={i} style={styles.row}>
            <View style={styles.dot} />
            <Text style={styles.rowText}>
              {t.contact?.givenName} {t.contact?.familyName}
            </Text>
            <Text style={styles.rowAmount}>
              KSH. {t.amount.toLocaleString('en', { minimumFractionDigits: 2 })}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 52, paddingBottom: 12,
  },
  title: { fontWeight: '600', fontSize: 16 },
  empty: { textAlign: 'center', color: '#aaa', marginTop: 40 },
  sectionTitle: { fontWeight: '600', marginTop: 24, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00a651', marginRight: 10 },
  rowText: { flex: 1, fontSize: 14 },
  rowAmount: { fontSize: 14, fontWeight: '300' },
});
