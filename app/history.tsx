import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Mock Data: History of past calls
const HISTORY_DATA = [
  { 
    id: '1', 
    date: 'Yesterday, 8:30 PM', 
    duration: '5:00', 
    result: 'MATCH', 
    partnerName: 'Sarah', 
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80'
  },
  { 
    id: '2', 
    date: 'Oct 24, 6:15 PM', 
    duration: '5:00', 
    result: 'MISS', 
    partnerName: 'Anonymous', 
    rating: 3,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&q=80' // Blur this in UI if miss
  },
  { 
    id: '3', 
    date: 'Oct 22, 9:00 PM', 
    duration: '2:14', 
    result: 'ENDED', // Ended early
    partnerName: 'Anonymous', 
    rating: 2,
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&q=80'
  },
  { 
    id: '4', 
    date: 'Oct 20, 7:45 PM', 
    duration: '5:00', 
    result: 'MATCH', 
    partnerName: 'Miguel', 
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80'
  },
];

export default function HistoryScreen() {
  const router = useRouter();

  const renderItem = ({ item }: { item: any }) => {
    const isMatch = item.result === 'MATCH';
    
    return (
      <View style={styles.card}>
        {/* Date Header */}
        <View style={styles.cardHeader}>
          <Text style={styles.dateText}>{item.date}</Text>
          <View style={[styles.badge, isMatch ? styles.badgeMatch : styles.badgeMiss]}>
            <Text style={[styles.badgeText, isMatch ? styles.textMatch : styles.textMiss]}>
              {item.result}
            </Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          {/* Avatar (Blurred if not a match) */}
          <View style={styles.avatarContainer}>
             <Image 
               source={{ uri: item.avatar }} 
               style={[styles.avatar, !isMatch && { opacity: 0.3 }]} 
               blurRadius={isMatch ? 0 : 10} 
             />
             {!isMatch && (
               <View style={styles.questionOverlay}>
                 <Ionicons name="help" size={24} color="#555" />
               </View>
             )}
          </View>

          {/* Details */}
          <View style={styles.info}>
            <Text style={styles.name}>{isMatch ? item.partnerName : 'Unknown Profile'}</Text>
            <View style={styles.statsRow}>
              <Ionicons name="time-outline" size={14} color="#666" />
              <Text style={styles.statText}>{item.duration} min</Text>
              
              <View style={styles.dot} />
              
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.statText}>{item.rating}.0</Text>
            </View>
          </View>

          {/* Action Button */}
          {isMatch && (
            <TouchableOpacity 
              style={styles.chatBtn} 
              onPress={() => router.push('/(tabs)/matches')}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={22} color="#007AFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
           <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Call History</Text>
      </View>

      <FlatList
        data={HISTORY_DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  headerContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingTop: 60, 
    paddingHorizontal: 20, 
    paddingBottom: 20, 
    backgroundColor: '#fff' 
  },
  backBtn: { marginRight: 15 },
  screenTitle: { fontSize: 24, fontWeight: 'bold' },
  
  listContent: { padding: 20 },
  
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
  },
  dateText: { color: '#8E8E93', fontSize: 13, fontWeight: '600' },
  
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeMatch: { backgroundColor: '#E8F5E9' },
  badgeMiss: { backgroundColor: '#F5F5F5' },
  badgeText: { fontSize: 10, fontWeight: 'bold' },
  textMatch: { color: '#4CAF50' },
  textMiss: { color: '#9E9E9E' },

  cardBody: { flexDirection: 'row', alignItems: 'center' },
  avatarContainer: { position: 'relative', marginRight: 15 },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#eee' },
  questionOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statText: { fontSize: 12, color: '#666', marginLeft: 4, marginRight: 8 },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#ccc', marginRight: 8 },

  chatBtn: { padding: 8, backgroundColor: '#F0F8FF', borderRadius: 20 },
});