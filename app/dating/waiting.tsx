import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function WaitingScreen() {
  const router = useRouter();
  const [status, setStatus] = useState('Connecting to server...');

  useEffect(() => {
    // Phase 1: Simulate connection
    const connectTimer = setTimeout(() => {
      setStatus('Searching for a match...');
    }, 1500);

    // Phase 2: Simulate "Found Match"
    const matchTimer = setTimeout(() => {
      setStatus('Match found! Redirecting...');
      
      // Redirect to Video Call after a brief pause
      setTimeout(() => {
        router.replace({
          pathname: '/dating/video-call',
          params: { 
            matchId: 'mock_match_123', 
            partnerName: 'Stranger' 
          }
        });
      }, 1000);
    }, 4500);

    return () => {
      clearTimeout(connectTimer);
      clearTimeout(matchTimer);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.pulseRing}>
        <ActivityIndicator size="large" color="#E91E63" />
      </View>
      
      <Text style={styles.title}>BlindSpot</Text>
      <Text style={styles.statusText}>{status}</Text>
      
      <Text style={styles.tip}>
        Tip: Be yourself. The blur only lifts if you both click YES.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center', padding: 20 },
  pulseRing: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 40,
    borderWidth: 1, borderColor: 'rgba(233, 30, 99, 0.3)'
  },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  statusText: { fontSize: 18, color: '#E91E63', marginBottom: 50, fontWeight: '600' },
  tip: { color: '#666', textAlign: 'center', fontSize: 14, maxWidth: 250 }
});