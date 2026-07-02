// src/firebase/database.js
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  runTransaction,
  arrayUnion,
} from 'firebase/firestore';
import { db } from './config';
import { getCurrentUser } from './auth';

const getCurrentUID = () => {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  return user.uid;
};

// ── User ──────────────────────────────────────────────────────
export const saveUserData = async (user) => {
  const uid = getCurrentUID();
  await setDoc(doc(db, 'users', uid), {
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    mpesaBalance: 0,
  });
};

export const fetchUserDetails = async () => {
  const uid = getCurrentUID();
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) throw new Error('User not found');
  return snap.data();
};

export const updateUserBalance = async (newBalance) => {
  const uid = getCurrentUID();
  await updateDoc(doc(db, 'users', uid), { mpesaBalance: newBalance });
};

export const addUserBalance = async (amount) => {
  const uid = getCurrentUID();
  const snap = await getDoc(doc(db, 'users', uid));
  const current = snap.data()?.mpesaBalance ?? 0;
  await updateDoc(doc(db, 'users', uid), { mpesaBalance: current + amount });
};

export const deductUserBalance = async (amount) => {
  const uid = getCurrentUID();
  const snap = await getDoc(doc(db, 'users', uid));
  const current = snap.data()?.mpesaBalance ?? 0;
  if (current < amount) throw new Error('Insufficient balance');
  await updateDoc(doc(db, 'users', uid), { mpesaBalance: current - amount });
};

// ── Transactions ──────────────────────────────────────────────
export const saveTransactionHistory = async (transaction) => {
  const uid = getCurrentUID();
  const docRef = doc(db, 'users', uid);
  const entry = {
    firstName: transaction.contact?.givenName ?? '',
    secondName: transaction.contact?.familyName ?? '',
    phoneNumber: transaction.phoneNumber ?? '',
    date: new Date().toISOString(),
    amount: transaction.amount,
  };
  await updateDoc(docRef, { transactions: arrayUnion(entry) });
};

export const fetchTransactionHistory = async () => {
  const uid = getCurrentUID();
  const snap = await getDoc(doc(db, 'users', uid));
  const raw = snap.data()?.transactions ?? [];
  return raw
    .map((t) => ({
      contact: {
        givenName: t.firstName ?? '',
        familyName: t.secondName ?? '',
        mobileNumber: t.phoneNumber ?? '',
      },
      phoneNumber: t.phoneNumber ?? '',
      date: new Date(t.date),
      amount: t.amount,
    }))
    .sort((a, b) => b.date - a.date);
};

// ── Balance by phone ──────────────────────────────────────────
export const updateUserBalanceByPhoneNumber = async (phoneNumber, addAmount) => {
  const q = query(collection(db, 'users'), where('phoneNumber', '==', phoneNumber));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const docSnap = snap.docs[0];
  const current = docSnap.data()?.mpesaBalance ?? 0;
  await updateDoc(docSnap.ref, { mpesaBalance: current + addAmount });
  return docSnap.data();
};

// ── Request State ─────────────────────────────────────────────
export const saveRequestState = async () => {
  const uid = getCurrentUID();
  await setDoc(doc(db, 'requestState', uid), { requestStatus: false });
};

export const fetchRequestState = async () => {
  const uid = getCurrentUID();
  const snap = await getDoc(doc(db, 'requestState', uid));
  return snap.data()?.requestStatus ?? false;
};

export const initiateRequest = async (phoneNumber) => {
  const q = query(collection(db, 'users'), where('phoneNumber', '==', phoneNumber));
  const snap = await getDocs(q);
  if (snap.empty) throw new Error('User not found');
  const targetUID = snap.docs[0].id;
  await updateDoc(doc(db, 'requestState', targetUID), { requestStatus: true });
};

export const clearRequestState = async () => {
  const uid = getCurrentUID();
  await updateDoc(doc(db, 'requestState', uid), { requestStatus: false });
};

export const approveRequest = async (receiverPhone, senderPhone) => {
  // Deduct from sender, credit receiver
  const senderQ = query(collection(db, 'users'), where('phoneNumber', '==', senderPhone));
  const receiverQ = query(collection(db, 'users'), where('phoneNumber', '==', receiverPhone));
  const [sSnap, rSnap] = await Promise.all([getDocs(senderQ), getDocs(receiverQ)]);
  if (sSnap.empty || rSnap.empty) throw new Error('User not found');

  const sDoc = sSnap.docs[0];
  const rDoc = rSnap.docs[0];
  const sBalance = sDoc.data().mpesaBalance ?? 0;
  const rBalance = rDoc.data().mpesaBalance ?? 0;
  if (sBalance < 500) throw new Error('Insufficient balance');

  await updateDoc(sDoc.ref, { mpesaBalance: sBalance - 500 });
  await updateDoc(rDoc.ref, { mpesaBalance: rBalance + 500 });
  await updateDoc(doc(db, 'requestState', sDoc.id), { requestStatus: false });
};
