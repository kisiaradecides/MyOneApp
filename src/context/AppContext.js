// src/context/AppContext.js
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import {
  fetchUserDetails,
  fetchTransactionHistory,
  fetchRequestState,
  saveRequestState,
} from '../firebase/database';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // biometric gate
  const [mpesaBalance, setMpesaBalance] = useState(0);
  const [username, setUsername] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [requestState, setRequestState] = useState(false);
  const [mshwariBalance, setMshwariBalance] = useState(0);
  const [loanBalance, setLoanBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const pollRef = useRef(null);

  // Load persisted balances
  useEffect(() => {
    (async () => {
      const ms = await AsyncStorage.getItem('mshwariBalance');
      const lb = await AsyncStorage.getItem('loanBalance');
      if (ms) setMshwariBalance(parseFloat(ms));
      if (lb) setLoanBalance(parseFloat(lb));
    })();
  }, []);

  // Firebase auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserLoggedIn(true);
        await refreshUserData();
        startPolling();
      } else {
        setUserLoggedIn(false);
        setIsAuthenticated(false);
        stopPolling();
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const refreshUserData = async () => {
    try {
      const user = await fetchUserDetails();
      setMpesaBalance(user.mpesaBalance ?? 0);
      setUsername(user.firstName ?? '');
      setUserPhone(user.phoneNumber ?? '');
      const txns = await fetchTransactionHistory();
      setTransactions(txns);
    } catch (e) {
      console.log('refreshUserData error:', e.message);
    }
  };

  const startPolling = () => {
    stopPolling();
    pollRef.current = setInterval(async () => {
      try {
        const status = await fetchRequestState();
        setRequestState(status);
        // Also refresh balance
        const user = await fetchUserDetails();
        setMpesaBalance(user.mpesaBalance ?? 0);
      } catch (_) {}
    }, 3000);
  };

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const saveMshwariBalance = async (val) => {
    setMshwariBalance(val);
    await AsyncStorage.setItem('mshwariBalance', String(val));
  };

  const saveLoanBalance = async (val) => {
    setLoanBalance(val);
    await AsyncStorage.setItem('loanBalance', String(val));
  };

  return (
    <AppContext.Provider
      value={{
        userLoggedIn, setUserLoggedIn,
        isAuthenticated, setIsAuthenticated,
        mpesaBalance, setMpesaBalance,
        username, userPhone,
        transactions, setTransactions,
        requestState, setRequestState,
        mshwariBalance, saveMshwariBalance,
        loanBalance, saveLoanBalance,
        refreshUserData,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
