import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    FlatList,
    Image,
    KeyboardAvoidingView, Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput, TouchableOpacity,
    View
} from 'react-native';

// Mock responses for the "Simulation"
const BOT_RESPONSES = [
  "That is actually hilarious 😂",
  "Wait, really? I had no idea!",
  "I was thinking the exact same thing.",
  "So, what are you up to this weekend?",
  "Tell me more about that!",
  "Haha you're funny.",
  "Honestly, I was so nervous at the start of the call 😅"
];

export default function ChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { partnerName, avatar } = params;

  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Initial Message History
  const [messages, setMessages] = useState([
    { id: '1', text: "Hey! That was fun. Glad we matched!", sender: 'them', time: 'Just now' }
  ]);

  const flatListRef = useRef<FlatList>(null);

  const sendMessage = () => {
    if (messageText.trim().length === 0) return;

    // 1. Add User Message
    const newUserMsg = { 
      id: Date.now().toString(), 
      text: messageText, 
      sender: 'me', 
      time: 'Now' 
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setMessageText('');

    // 2. Simulate "Typing..." delay
    setIsTyping(true);
    setTimeout(() => {
      // 3. Add Bot Reply
      const randomResponse = BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)];
      const newBotMsg = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'them',
        time: 'Now'
      };
      
      setMessages(prev => [...prev, newBotMsg]);
      setIsTyping(false);
    }, 2000); // 2 second delay
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages, isTyping]);

  const renderItem = ({ item }: { item: any }) => {
    const isMe = item.sender === 'me';
    return (
      <View style={[styles.bubbleWrapper, isMe ? styles.wrapperMe : styles.wrapperThem]}>
        {!isMe && (
          <Image source={{ uri: (avatar as string) || 'https://i.pravatar.cc/150' }} style={styles.bubbleAvatar} />
        )}
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
          <Text style={[styles.bubbleText, isMe ? styles.textMe : styles.textThem]}>{item.text}</Text>
        </View>
      </View>
    );
  };

  // --- NEW FUNCTION: GO HOME ---
  const handleGoHome = () => {
    // replace() clears the stack so you can't "back" into the chat easily
    router.replace('/(tabs)'); 
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        {/* Standard Back Button (Goes to previous screen) */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Image source={{ uri: (avatar as string) || 'https://i.pravatar.cc/150' }} style={styles.headerAvatar} />
          <View>
            <Text style={styles.headerName}>{partnerName || 'Match'}</Text>
            <Text style={styles.headerStatus}>Online</Text>
          </View>
        </View>

        {/* --- NEW HOME BUTTON --- */}
        <TouchableOpacity onPress={handleGoHome} style={styles.homeBtn}>
          <Ionicons name="home" size={24} color="#E91E63" />
        </TouchableOpacity>
      </View>

      {/* CHAT LIST */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
          isTyping ? (
            <View style={styles.typingIndicator}>
              <Text style={styles.typingText}>{partnerName} is typing...</Text>
            </View> 
          ) : null
        }
      />

      {/* INPUT BAR */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachBtn}>
            <Ionicons name="add" size={24} color="#E91E63" />
          </TouchableOpacity>
          
          <TextInput
            style={styles.input}
            value={messageText}
            onChangeText={setMessageText}
            placeholder="Type a message..."
            placeholderTextColor="#999"
          />
          
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  
  // Header Styles
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee', 
    paddingTop: Platform.OS === 'android' ? 40 : 10 
  },
  backBtn: { marginRight: 15 },
  homeBtn: { marginLeft: 10 }, // Style for the new button
  headerInfo: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  headerAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  headerName: { fontSize: 16, fontWeight: 'bold' },
  headerStatus: { fontSize: 12, color: '#4CAF50' },

  // List
  listContent: { padding: 15, paddingBottom: 20 },
  
  // Bubbles
  bubbleWrapper: { flexDirection: 'row', marginBottom: 15, alignItems: 'flex-end' },
  wrapperMe: { justifyContent: 'flex-end' },
  wrapperThem: { justifyContent: 'flex-start' },
  
  bubbleAvatar: { width: 30, height: 30, borderRadius: 15, marginRight: 8 },
  
  bubble: { maxWidth: '75%', padding: 12, borderRadius: 20 },
  bubbleMe: { backgroundColor: '#E91E63', borderBottomRightRadius: 4 },
  bubbleThem: { backgroundColor: '#f0f0f0', borderBottomLeftRadius: 4 },
  
  bubbleText: { fontSize: 16 },
  textMe: { color: '#fff' },
  textThem: { color: '#000' },

  // Footer
  typingIndicator: { marginLeft: 50, marginBottom: 10 },
  typingText: { color: '#999', fontStyle: 'italic', fontSize: 12 },

  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderTopColor: '#eee', backgroundColor: '#fff' },
  attachBtn: { padding: 10 },
  input: { flex: 1, backgroundColor: '#f5f5f5', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10, fontSize: 16 },
  sendBtn: { backgroundColor: '#E91E63', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
});