"use client"

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export function useBoats() {
  const [boats, setBoats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBoats() {
      try {
        const data = await apiClient.get('/boats');
        setBoats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBoats();
  }, []);

  const createBoat = async (boatData: any) => {
    const newBoat = await apiClient.post('/boats', boatData);
    setBoats([...boats, newBoat]);
    return newBoat;
  };

  const updateBoat = async (id: number, boatData: any) => {
    const updatedBoat = await apiClient.put(`/boats/${id}`, boatData);
    setBoats(boats.map((boat: any) => (boat.id === id ? updatedBoat : boat)));
    return updatedBoat;
  };

  const deleteBoat = async (id: number) => {
    await apiClient.delete(`/boats/${id}`);
    setBoats(boats.filter((boat: any) => boat.id !== id));
  };

  return { boats, loading, error, createBoat, updateBoat, deleteBoat };
}

export function useTourists() {
  const [tourists, setTourists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTourists() {
      try {
        const data = await apiClient.get('/tourists');
        setTourists(data.data || data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTourists();
  }, []);

  const createTourist = async (touristData: any) => {
    const newTourist = await apiClient.post('/tourists', touristData);
    setTourists([...tourists, newTourist]);
    return newTourist;
  };

  const updateTourist = async (id: number, touristData: any) => {
    const updatedTourist = await apiClient.put(`/tourists/${id}`, touristData);
    setTourists(tourists.map((tourist: any) => (tourist.id === id ? updatedTourist : tourist)));
    return updatedTourist;
  };

  const deleteTourist = async (id: number) => {
    await apiClient.delete(`/tourists/${id}`);
    setTourists(tourists.filter((tourist: any) => tourist.id !== id));
  };

  return { tourists, loading, error, createTourist, updateTourist, deleteTourist };
}

export function useTrips(month?: string, year?: string) {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrips() {
      try {
        // Build query parameters
        const params = new URLSearchParams();
        if (month && month !== 'all') {
          params.append('month', month);
        }
        if (year) {
          params.append('year', year);
        }
        
        const queryString = params.toString();
        const endpoint = queryString ? `/trips?${queryString}` : '/trips';
        
        const data = await apiClient.get(endpoint);
        setTrips(data.data || data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTrips();
  }, [month, year]);

  const createTrip = async (tripData: any) => {
    const newTrip = await apiClient.post('/trips', tripData);
    setTrips([...trips, newTrip]);
    return newTrip;
  };

  const updateTrip = async (id: number, tripData: any) => {
    const updatedTrip = await apiClient.put(`/trips/${id}`, tripData);
    setTrips(trips.map((trip: any) => (trip.id === id ? updatedTrip : trip)));
    return updatedTrip;
  };

  const deleteTrip = async (id: number) => {
    await apiClient.delete(`/trips/${id}`);
    setTrips(trips.filter((trip: any) => trip.id !== id));
  };

  return { trips, loading, error, createTrip, updateTrip, deleteTrip };
}

export function useDashboardStats(month?: string, year?: string) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Build query parameters
        const params = new URLSearchParams();
        if (month && month !== 'all') {
          params.append('month', month);
        }
        if (year) {
          params.append('year', year);
        }
        
        const queryString = params.toString();
        const endpoint = queryString ? `/analytics/dashboard?${queryString}` : '/analytics/dashboard';
        
        const data = await apiClient.get(endpoint);
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [month, year]);

  return { stats, loading, error };
}
