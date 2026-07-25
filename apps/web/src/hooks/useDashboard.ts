import { useState, useEffect } from 'react';

// Simple hook for dashboard functionality
interface DashboardData {
  workflows: any[];
  audit: any[];
  analytics: Record<string, any>;
  workflow: Record<string, any>;
  workflowTypes: any[];
}

export const useDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setDashboardData({
        workflows: [],
        audit: [],
        analytics: {},
        workflow: {},
        workflowTypes: []
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return {
    dashboardData,
    loading,
    error,
    workflows: [],
    audit: [],
    analytics: {},
    workflow: {},
    workflowTypes: []
  };
};

// Simple localStorage hook
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setStoredValue = (newValue: T) => {
    try {
      setValue(newValue);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(newValue));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [value, setStoredValue] as const;
}