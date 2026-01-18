import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Mock login simulation
      setTimeout(async () => {
        const mockToken = 'mock-token-' + Date.now();
        const mockUserId = 'user-' + Date.now();
        await login(mockToken, mockUserId);
        setLoading(false);
        router.replace('/(tabs)');
      }, 1500); 
    } catch (error) {
      setLoading(false);
      Alert.alert('Login Failed', 'Invalid credentials');
    }
  };

  return (
    <ImageBackground 
      // UPDATED BACKGROUND: Abstract dark aesthetic (No people)
      source={{ uri: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1000&auto=format&fit=crop' }} 
      style={styles.backgroundImage}
    >
      <LinearGradient
        // Slightly darker gradient for better text readability
        colors={['rgba(0,0,0,0.1)', '#121212']}
        style={styles.gradientOverlay}
      >
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.content}>
            
            {/* Header Section */}
            <View style={styles.header}>
              <View style={styles.iconCircle}>
                <Ionicons name="eye-off" size={40} color="#E91E63" />
              </View>
              <Text style={styles.title}>BlindSpot</Text>
              <Text style={styles.tagline}>Spark First. Sight Second.</Text>
            </View>

            {/* Form Section */}
            <View style={styles.form}>
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

              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Log In</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <View style={styles.dividerContainer}>
                <View style={styles.line} />
                <Text style={styles.orText}>OR</Text>
                <View style={styles.line} />
              </View>

              <View style={styles.socialContainer}>
                <TouchableOpacity style={styles.socialBtn}>
                  <Ionicons name="logo-google" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialBtn}>
                  <Ionicons name="logo-apple" size={24} color="white" />
                </TouchableOpacity>
              </View>

              <View style={styles.signupContainer}>
                <Text style={styles.footerText}>New here? </Text>
                <Link href="/(auth)/signup" asChild>
                  <TouchableOpacity>
                    <Text style={styles.signupLink}>Create Account</Text>
                  </TouchableOpacity>
                </Link>
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
    marginBottom: 50,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Subtler glass effect
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: '#ddd',
    marginTop: 5,
    letterSpacing: 0.5,
  },

  // Form
  form: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Glassmorphism
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
  forgotPassword: {
    alignSelf: 'flex-end',
    color: '#ccc',
    marginBottom: 24,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#E91E63', // Brand Pink
    borderRadius: 16,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginTop: 10,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  orText: {
    color: '#888',
    marginHorizontal: 10,
    fontSize: 12,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 40,
  },
  socialBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    color: '#aaa',
    fontSize: 15,
  },
  signupLink: {
    color: '#E91E63',
    fontSize: 15,
    fontWeight: 'bold',
  },
});