import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const ProgressDataContext = createContext();

export const useProgressData = () => useContext(ProgressDataContext);

export const ProgressDataProvider = ({ children }) => {
  const { user } = useAuth();
  const [data, setData] = useState({
    stats: null,
    habits: [],
    goals: [],
    journal: [],
    achievements: [],
    loading: true,
    error: null
  });

  const fetchAllData = useCallback(async (isSilent = false) => {
    if (!user) return;
    
    if (!isSilent) {
      setData(prev => ({ ...prev, loading: true }));
    }

    try {
      const [statsRes, habitsRes, goalsRes, achievementsRes, journalRes] = await Promise.all([
        api.get('/stats'),
        api.get('/habits'),
        api.get('/goals'),
        api.get('/achievements'),
        api.get('/journal')
      ]);

      setData({
        stats: statsRes.data,
        habits: Array.isArray(habitsRes.data) ? habitsRes.data : [],
        goals: Array.isArray(goalsRes.data) ? goalsRes.data : [],
        achievements: Array.isArray(achievementsRes.data) ? achievementsRes.data : [],
        journal: Array.isArray(journalRes.data) ? journalRes.data : [],
        loading: false,
        error: null,
        lastUpdated: new Date()
      });
    } catch (err) {
      console.error('Core data sync failed:', err);
      setData(prev => ({ ...prev, loading: false, error: err }));
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user, fetchAllData]);

  const value = {
    ...data,
    refresh: () => fetchAllData(false),
    refreshSilent: () => fetchAllData(true)
  };

  return (
    <ProgressDataContext.Provider value={value}>
      {children}
    </ProgressDataContext.Provider>
  );
};
