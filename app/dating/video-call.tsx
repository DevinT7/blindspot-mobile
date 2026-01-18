import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

// 1. Mock "Stranger" Profiles (High quality portraits)
const MOCK_PARTNERS = [
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80', // Girl 1
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=80', // Guy 1
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80', // Girl 2
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80', // Guy 2
];

// 2. Mock Shared Interests (The new feature)
const MOCK_SHARED_INTERESTS = ["🐕 Dogs", "🍕 Foodie"];

const QUESTIONS = [
  "What's a controversially simple food you love?",
  "What is the worst advice you've ever taken?",
  "If you were a ghost, who would you haunt?",
  "What's the last song you listened to on repeat?"
];

export default function VideoCallScreen() {
  const router = useRouter();
  const { matchId } = useLocalSearchParams();
  
  const [timeLeft, setTimeLeft] = useState(300); 
  const [currentQuestion, setCurrentQuestion] = useState(QUESTIONS[0]);
  const [partnerImage, setPartnerImage] = useState(MOCK_PARTNERS[0]);
  
  // Floating Emoji State
  const [floatingEmojis, setFloatingEmojis] = useState<{id: number, emoji: string, anim: Animated.Value}[]>([]);
  const emojiIdCounter = useRef(0);

  useEffect(() => {
    // Randomly select a partner image on mount
    const randomImg = MOCK_PARTNERS[Math.floor(Math.random() * MOCK_PARTNERS.length)];
    setPartnerImage(randomImg);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleCallEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCallEnd = () => {
    router.replace({
      pathname: '/dating/post-call',
      params: { matchId: matchId }
    });
  };

  const nextQuestion = () => {
    const random = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
    setCurrentQuestion(random);
  };

  // Logic to Spawn Floating Emojis
  const triggerReaction = (emoji: string) => {
    const id = emojiIdCounter.current++;
    const anim = new Animated.Value(0);

    // Add new emoji to state
    setFloatingEmojis(prev => [...prev, { id, emoji, anim }]);

    // Animate it floating up
    Animated.timing(anim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start(() => {
      // Remove after animation finishes
      setFloatingEmojis(prev => prev.filter(e => e.id !== id));
    });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <View style={styles.container}>
      
      {/* --- LAYER 1: THE "VIDEO" FEED --- */}
      <View style={styles.videoContainer}>
        <Image 
          source={{ uri: partnerImage }} 
          style={styles.fullScreenImage} 
          resizeMode="cover" 
        />
        
        {/* THE BLIND FILTER */}
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
        
        {/* Dark overlay to make text readable */}
        <View style={styles.dimOverlay} />
      </View>

      {/* --- LAYER 2: FLOATING REACTIONS --- */}
      <View style={styles.reactionContainer} pointerEvents="none">
        {floatingEmojis.map(item => {
          const translateY = item.anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -400] // Float up 400 pixels
          });
          const opacity = item.anim.interpolate({
            inputRange: [0, 0.8, 1],
            outputRange: [1, 1, 0] // Fade out at end
          });
          
          return (
            <Animated.Text 
              key={item.id} 
              style={[
                styles.floatingEmoji, 
                { transform: [{ translateY }], opacity, left: Math.random() * (width - 50) } // Random horizontal start
              ]}
            >
              {item.emoji}
            </Animated.Text>
          );
        })}
      </View>

      {/* --- LAYER 3: UI OVERLAY --- */}
      <View style={styles.uiLayer}>
        
        {/* Top Section */}
        <View style={styles.header}>
          {/* Timer */}
          <View style={[styles.timerTag, timeLeft < 30 && styles.timerUrgent]}>
            <Ionicons name="time-outline" size={16} color="white" style={{marginRight: 4}}/>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          </View>

          {/* --- NEW SHARED VIBES ALERT --- */}
          <View style={styles.sharedVibesContainer}>
            <Text style={styles.sharedVibesLabel}>You both like:</Text>
            <View style={styles.tagRow}>
              {MOCK_SHARED_INTERESTS.map((tag, index) => (
                <View key={index} style={styles.matchTag}>
                  <Text style={styles.matchTagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Footer Area */}
        <View style={styles.footer}>
          
          {/* Conversation Starter Card */}
          <View style={styles.questionCard}>
            <View style={styles.questionHeader}>
              <Text style={styles.questionLabel}>ICE BREAKER</Text>
              <TouchableOpacity onPress={nextQuestion}>
                <Ionicons name="shuffle" size={20} color="#E91E63" />
              </TouchableOpacity>
            </View>
            <Text style={styles.questionText}>"{currentQuestion}"</Text>
          </View>

          {/* Reaction Bar */}
          <View style={styles.reactionBar}>
            <TouchableOpacity style={styles.emojiBtn} onPress={() => triggerReaction('❤️')}>
              <Text style={styles.emojiIcon}>❤️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.emojiBtn} onPress={() => triggerReaction('😂')}>
              <Text style={styles.emojiIcon}>😂</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.emojiBtn} onPress={() => triggerReaction('👏')}>
              <Text style={styles.emojiIcon}>👏</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.emojiBtn} onPress={() => triggerReaction('🔥')}>
              <Text style={styles.emojiIcon}>🔥</Text>
            </TouchableOpacity>
          </View>

          {/* End Call Button */}
          <TouchableOpacity style={styles.endButton} onPress={handleCallEnd}>
            <Text style={styles.endButtonText}>End Date</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  
  // Video & Background
  videoContainer: { flex: 1 },
  fullScreenImage: { width: '100%', height: '100%' },
  dimOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' }, 

  // Floating Emojis
  reactionContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end', paddingBottom: 150 },
  floatingEmoji: { position: 'absolute', fontSize: 40, bottom: 0 },

  // UI Structure
  uiLayer: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between', padding: 20, paddingTop: 60 },
  
  // Header
  header: { alignItems: 'center' },
  timerTag: { 
    flexDirection: 'row', alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    paddingHorizontal: 16, paddingVertical: 8, 
    borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' 
  },
  timerUrgent: { backgroundColor: 'rgba(233, 30, 99, 0.8)', borderColor: '#E91E63' },
  timerText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  // --- NEW STYLES FOR SHARED VIBES ---
  sharedVibesContainer: {
    alignItems: 'center',
    marginTop: 20, 
  },
  sharedVibesLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
  },
  matchTag: {
    backgroundColor: 'rgba(233, 30, 99, 0.8)', // Brand Pink
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  matchTagText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // Footer
  footer: { gap: 15 },
  
  // Question Card
  questionCard: { backgroundColor: 'rgba(255,255,255,0.15)', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  questionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  questionLabel: { color: '#E91E63', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  questionText: { color: 'white', fontSize: 18, fontWeight: '600', lineHeight: 24 },
  
  // Reaction Bar
  reactionBar: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
  emojiBtn: { backgroundColor: 'rgba(255,255,255,0.2)', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  emojiIcon: { fontSize: 24 },

  // End Button
  endButton: { backgroundColor: '#FF3B30', padding: 18, borderRadius: 30, alignItems: 'center' },
  endButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});