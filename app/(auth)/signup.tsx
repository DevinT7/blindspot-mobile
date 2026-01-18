import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useAuthStore } from '../../store/authStore';

const { width } = Dimensions.get('window');

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Mock Signup Simulation
      setTimeout(async () => {
        const mockToken = 'mock-token-' + Date.now();
        const mockUserId = 'user-' + Date.now();
        
        // Auto-login after signup
        await login(mockToken, mockUserId);
        
        setLoading(false);
        router.replace('/(tabs)');
      }, 1500); 
    } catch (error) {
      setLoading(false);
      Alert.alert('Signup Failed', 'Something went wrong. Please try again.');
    }
  };

  return (
    <ImageBackground 
      // Matching abstract background for consistency
      source={{ uri: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1000&auto=format&fit=crop' }} 
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.1)', '#121212']}
        style={styles.gradientOverlay}
      >
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.content}>
            
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.iconCircle}>
                <Ionicons name="person-add" size={32} color="#E91E63" />
              </View>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.tagline}>Join the blind dating revolution.</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              
              {/* Name Input */}
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#ccc" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#aaa"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#ccc" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#aaa"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#ccc" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#aaa"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSignup}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Sign Up</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <View style={styles.loginContainer}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.back()}>
                  <Text style={styles.loginLink}>Log In</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: width,
    height: '100%',
  },
  gradientOverlay: {
    flex: 1,
    paddingHorizontal: 24,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  
  // Header
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 16,
    color: '#ddd',
    marginTop: 5,
  },

  // Form
  form: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    height: 60,
  },
  inputIcon: {
    marginLeft: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    height: '100%',
  },
  button: {
    backgroundColor: '#E91E63',
    borderRadius: 16,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  // Footer
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
  },
  footerText: {
    color: '#aaa',
    fontSize: 15,
  },
  loginLink: {
    color: '#E91E63',
    fontSize: 15,
    fontWeight: 'bold',
  },
});