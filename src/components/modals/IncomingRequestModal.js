// src/components/modals/IncomingRequestModal.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

export default function IncomingRequestModal({ visible, name, amount, onApprove, onDecline }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onDecline}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>INCOMING REQUEST</Text>
          <Text style={styles.body}>
            <Text style={styles.nameText}>{name.toUpperCase()} </Text>
            is requesting{' '}
            <Text style={{ fontWeight: '600' }}>KSH. {amount.toFixed(2)}</Text>
            {' '}from you. To accept tap{' '}
            <Text style={styles.approve}>APPROVE</Text>.
            To cancel tap{' '}
            <Text style={styles.decline}>DECLINE</Text>.
          </Text>

          <TouchableOpacity style={styles.approveBtn} onPress={onApprove}>
            <Text style={styles.btnText}>APPROVE</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.declineBtn} onPress={onDecline}>
            <Text style={styles.btnText}>DECLINE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, alignItems: 'center',
  },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  body: { textAlign: 'center', lineHeight: 22, marginBottom: 20, fontSize: 14 },
  nameText: { color: '#0077b6', fontWeight: '600' },
  approve: { color: '#00a651', fontWeight: '600' },
  decline: { color: '#d62828', fontWeight: '600' },
  approveBtn: {
    backgroundColor: '#00a651', borderRadius: 25,
    paddingHorizontal: 60, paddingVertical: 12, marginBottom: 10,
  },
  declineBtn: {
    backgroundColor: '#d62828', borderRadius: 25,
    paddingHorizontal: 60, paddingVertical: 12,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
