import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Mock Data: People you've already matched with
const MATCHES = [
  { id: '1', name: 'Michael', message: 'That food question was tricky! 😂', time: '2m ago', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
  { id: '2', name: 'Sally', message: 'I like your vibe!', time: '1h ago', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
  { id: '3', name: 'Sam', message: 'Hey! Nice meeting you.', time: '1d ago', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e' },
];

export default function MatchesScreen() {
  const router = useRouter();

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.chatRow} 
      onPress={() => router.push({
        pathname: '/dating/chat',
        params: { 
          partnerName: item.name, 
          avatar: item.avatar 
        }
      })}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={styles.message} numberOfLines={1}>{item.message}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Matches</Text>
      <View style={styles.listContainer}>
        <FlatList
          data={MATCHES}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No matches yet. Go on a date!</Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 60, paddingHorizontal: 20 },
  header: { fontSize: 30, fontWeight: 'bold', marginBottom: 20 },
  listContainer: { flex: 1 },
  chatRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, backgroundColor: '#f9f9f9', padding: 15, borderRadius: 16 },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  chatContent: { flex: 1 },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  name: { fontSize: 18, fontWeight: 'bold' },
  time: { color: '#aaa', fontSize: 12 },
  message: { color: '#666', fontSize: 14 },
  emptyState: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#aaa', fontSize: 16 }
});