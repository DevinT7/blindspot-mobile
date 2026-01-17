// app/(tabs)/index.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const COLORS = {
  primary: '#007AFF',
  danger: '#FF3B30',
  warning: '#FF9500',
  background: '#F2F2F7',
  text: '#000000',
  textSecondary: '#8E8E93',
};

export default function HomeScreen() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalCalls: 12,
    totalMatches: 5,
    avgRating: 4.3,
  });

  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    startPulseAnimation();
  }, []);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleStartDating = () => {
    router.push('/dating/waiting');
  };

  const handleMatchesPress = () => {
    // Navigate to the Matches tab/screen
    router.push('/(tabs)/matches');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hey there 👋</Text>
          <Text style={styles.subtitle}>Ready to meet someone new?</Text>
        </View>

        {/* Stats Cards - NOW INTERACTIVE */}
        <View style={styles.statsContainer}>
          
         {/* 1. Dates Card - Updated to Link to History */}
          <TouchableOpacity 
            style={styles.statCard} 
            onPress={() => router.push('/history')}
          >
            <Ionicons name="videocam" size={32} color={COLORS.primary} />
            <Text style={styles.statNumber}>{stats.totalCalls}</Text>
            <Text style={styles.statLabel}>History</Text>
          </TouchableOpacity>

          {/* 2. Matches Card (Navigates to Matches Screen) */}
          <TouchableOpacity 
            style={styles.statCard}
            onPress={handleMatchesPress}
          >
            <Ionicons name="heart" size={32} color={COLORS.danger} />
            <Text style={styles.statNumber}>{stats.totalMatches}</Text>
            <Text style={styles.statLabel}>Matches</Text>
          </TouchableOpacity>

          {/* 3. Rating Card */}
          <TouchableOpacity 
            style={styles.statCard}
            onPress={() => Alert.alert('Your Rating', 'This score is calculated based on feedback from your last 5 dates.')}
          >
            <Ionicons name="star" size={32} color={COLORS.warning} />
            <Text style={styles.statNumber}>{stats.avgRating.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </TouchableOpacity>

        </View>

        {/* Main CTA Button */}
        <View style={styles.ctaContainer}>
          <Animated.View
            style={[
              styles.pulseCircle,
              { transform: [{ scale: pulseAnim }] },
            ]}
          />
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartDating}
            activeOpacity={0.8}
          >
            <Ionicons name="videocam" size={40} color="#fff" />
            <Text style={styles.startButtonText}>Start Dating</Text>
          </TouchableOpacity>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Ionicons name="eye-off-outline" size={24} color={COLORS.primary} />
            <Text style={styles.infoText}>
              Talk without seeing each other
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="timer-outline" size={24} color={COLORS.primary} />
            <Text style={styles.infoText}>
              5 minutes to make a connection
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="checkmark-circle-outline" size={24} color={COLORS.primary} />
            <Text style={styles.infoText}>
              Mutual yes = profiles revealed
            </Text>
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>💡 Pro Tip</Text>
          <Text style={styles.tipText}>
            Be yourself and ask questions. Good conversations lead to matches!
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    // Added shadow for touchable feel
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  ctaContainer: {
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  pulseCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.primary,
    opacity: 0.1,
  },
  startButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 12,
    flex: 1,
  },
  tipCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});