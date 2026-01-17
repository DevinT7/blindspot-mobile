import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PostCallScreen() {
  const router = useRouter();
  const [viewState, setViewState] = useState<'voting' | 'waiting' | 'result'>('voting');
  const [result, setResult] = useState<'match' | 'miss'>('miss');

  const handleVote = (voteYes: boolean) => {
    if (!voteYes) {
      // If you say no, it's immediately over
      setResult('miss');
      setViewState('result');
      return;
    }

    // If you say YES, we pretend to wait for the other person
    setViewState('waiting');

    setTimeout(() => {
      // Randomly decide if they liked you back (50/50 chance)
      const isMatch = Math.random() > 0.5;
      setResult(isMatch ? 'match' : 'miss');
      setViewState('result');
    }, 2500); // 2.5 second fake suspense delay
  };

  const handleExit = () => {
    // Go back to the main tabs (Dashboard)
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      {/* PHASE 1: VOTING */}
      {viewState === 'voting' && (
        <View style={styles.content}>
          <Text style={styles.header}>Time's Up!</Text>
          <Text style={styles.subHeader}>Do you want to reveal profiles?</Text>
          
          <View style={styles.row}>
            <TouchableOpacity style={[styles.btn, styles.btnReject]} onPress={() => handleVote(false)}>
              <Text style={styles.btnText}>No</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.btn, styles.btnAccept]} onPress={() => handleVote(true)}>
              <Text style={styles.btnText}>Yes (Reveal)</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* PHASE 2: WAITING FOR PARTNER */}
      {viewState === 'waiting' && (
        <View style={styles.content}>
          <ActivityIndicator size="large" color="#E91E63" />
          <Text style={styles.waitingText}>Waiting for their decision...</Text>
        </View>
      )}

      {/* PHASE 3: RESULT */}
      {viewState === 'result' && (
        <View style={styles.content}>
          {result === 'match' ? (
            <>
              <Text style={styles.matchTitle}>IT'S A MATCH!</Text>
              <Text style={styles.matchDesc}>Profile Unlocked. You can now chat.</Text>
              <TouchableOpacity style={styles.actionBtn} onPress={handleExit}>
                <Text style={styles.actionBtnText}>Go to Chat 💬</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.missTitle}>Not a Match</Text>
              <Text style={styles.missDesc}>They passed or the feeling wasn't mutual.</Text>
              <TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#333'}]} onPress={handleExit}>
                <Text style={styles.actionBtnText}>Back to Deck 🏠</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', padding: 20 },
  content: { alignItems: 'center', gap: 20 },
  
  header: { fontSize: 32, fontWeight: 'bold', color: 'white' },
  subHeader: { fontSize: 16, color: '#aaa', marginBottom: 20 },
  
  row: { flexDirection: 'row', gap: 20, width: '100%' },
  btn: { flex: 1, padding: 20, borderRadius: 15, alignItems: 'center' },
  btnReject: { backgroundColor: '#333' },
  btnAccept: { backgroundColor: '#E91E63' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  waitingText: { color: 'white', marginTop: 20, fontSize: 18 },

  matchTitle: { color: '#4CAF50', fontSize: 36, fontWeight: 'bold', letterSpacing: 1 },
  matchDesc: { color: '#ccc', fontSize: 16 },
  
  missTitle: { color: '#F44336', fontSize: 30, fontWeight: 'bold' },
  missDesc: { color: '#888', fontSize: 16 },

  actionBtn: { marginTop: 30, backgroundColor: 'white', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30 },
  actionBtnText: { color: 'black', fontWeight: 'bold', fontSize: 16 }
});