// src/components/modals/BuyAirtimeModal.js
import React, { useState } from 'react';
import { Modal } from 'react-native';
import AmountScreen from '../transaction/AmountScreen';
import ConfirmScreen from '../transaction/ConfirmScreen';
import SuccessScreen from '../transaction/SuccessScreen';
import { useApp } from '../../context/AppContext';

export default function BuyAirtimeModal({ visible, onClose, onDone }) {
  const { userPhone } = useApp();
  const [step, setStep] = useState('amount');
  const [amount, setAmount] = useState(0);

  const contact = { givenName: 'My Number', familyName: '', mobileNumber: userPhone };

  const reset = () => { setStep('amount'); setAmount(0); };

  if (!visible) return null;

  if (step === 'amount') return (
    <AmountScreen
      contact={contact}
      sendOrRequest="send"
      onBack={() => { reset(); onClose(); }}
      onContinue={(amt) => { setAmount(amt); setStep('confirm'); }}
    />
  );
  if (step === 'confirm') return (
    <ConfirmScreen
      contact={contact}
      amount={amount}
      transactionType="airtime"
      onBack={() => setStep('amount')}
      onSuccess={() => setStep('success')}
    />
  );
  if (step === 'success') return (
    <SuccessScreen
      contact={contact}
      amount={amount}
      transactionType="airtime"
      onDone={() => { reset(); onDone(); }}
    />
  );

  return null;
}
