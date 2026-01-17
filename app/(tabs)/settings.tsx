import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function SettingsScreen() {
  const router = useRouter();

  // --- STATE MANAGEMENT ---
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  
  // Profile Data
  const [profile, setProfile] = useState({
    name: 'Alex',
    age: '24',
    avatar: 'https://i.pravatar.cc/150?u=myprofile', // Default placeholder
  });

  // Settings Data
  const [settings, setSettings] = useState({
    distance: 10,       // miles
    ageRange: '21 - 28',
    voiceOnly: false,
    notifications: true,
  });

  // --- ACTIONS ---

  // 1. Pick Image from Gallery
  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need access to your photos to update your profile!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfile({ ...profile, avatar: result.assets[0].uri });
    }
  };

  // 2. Cycle Logic for Distance (Mock interaction)
  const cycleDistance = () => {
    const options = [5, 10, 25, 50, 100];
    const currentIndex = options.indexOf(settings.distance);
    const nextIndex = (currentIndex + 1) % options.length;
    setSettings({ ...settings, distance: options[nextIndex] });
  };

  // 3. Cycle Logic for Age (Mock interaction)
  const cycleAgeRange = () => {
    const options = ['18 - 24', '21 - 28', '25 - 35', '30 - 45', '40+'];
    const currentIndex = options.indexOf(settings.ageRange);
    const nextIndex = (currentIndex + 1) % options.length;
    setSettings({ ...settings, ageRange: options[nextIndex] });
  };

  const handleSaveProfile = () => {
    setEditModalVisible(false);
    // Here you would typically make an API call to save to backend
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Log Out", style: "destructive", onPress: () => router.replace('/') } // Go back to Login
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Settings</Text>

        {/* --- PROFILE CARD --- */}
        <View style={styles.profileCard}>
          <Image source={{ uri: profile.avatar }} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{profile.name}, {profile.age}</Text>
            <TouchableOpacity onPress={() => setEditModalVisible(true)}>
              <Text style={styles.editLink}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- DISCOVERY SECTION --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Discovery</Text>
          
          <TouchableOpacity style={styles.row} onPress={cycleDistance}>
            <Text style={styles.label}>Distance Preference</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.value}>Within {settings.distance} miles</Text>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.row} onPress={cycleAgeRange}>
            <Text style={styles.label}>Age Range</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.value}>{settings.ageRange}</Text>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </View>
          </TouchableOpacity>

          <View style={styles.row}>
            <Text style={styles.label}>Voice-Only Mode</Text>
            <Switch 
              value={settings.voiceOnly} 
              onValueChange={(val) => setSettings({...settings, voiceOnly: val})}
              trackColor={{ false: '#767577', true: '#E91E63' }}
            />
          </View>
        </View>

        {/* --- APP SETTINGS SECTION --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Push Notifications</Text>
            <Switch 
              value={settings.notifications} 
              onValueChange={(val) => setSettings({...settings, notifications: val})}
              trackColor={{ false: '#767577', true: '#E91E63' }}
            />
          </View>
        </View>

        {/* --- LOGOUT --- */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>BlindSpot v1.0.2</Text>
      </ScrollView>

      {/* --- EDIT PROFILE MODAL --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            {/* Edit Avatar */}
            <TouchableOpacity style={styles.avatarEditWrapper} onPress={pickImage}>
              <Image source={{ uri: profile.avatar }} style={styles.modalAvatar} />
              <View style={styles.cameraIcon}>
                <Ionicons name="camera" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text style={styles.avatarHint}>Tap to change photo</Text>

            {/* Edit Fields */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput 
                style={styles.input} 
                value={profile.name} 
                onChangeText={(text) => setProfile({...profile, name: text})}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Age</Text>
              <TextInput 
                style={styles.input} 
                value={profile.age} 
                keyboardType="numeric"
                onChangeText={(text) => setProfile({...profile, age: text})}
              />
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}>
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 40 },
  header: { fontSize: 34, fontWeight: 'bold', marginBottom: 20, color: '#000' },
  
  // Profile Card
  profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', padding: 20, borderRadius: 20, marginBottom: 30 },
  avatar: { width: 70, height: 70, borderRadius: 35, marginRight: 15 },
  profileInfo: { justifyContent: 'center' },
  name: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  editLink: { color: '#E91E63', fontWeight: '600', marginTop: 4, fontSize: 14 },

  // Sections
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingVertical: 5 },
  label: { fontSize: 16, color: '#333' },
  valueContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  value: { fontSize: 16, color: '#999' },

  // Logout
  logoutBtn: { backgroundColor: '#FFF0F3', padding: 16, borderRadius: 16, alignItems: 'center', marginTop: 10 },
  logoutText: { color: '#E91E63', fontWeight: 'bold', fontSize: 16 },
  version: { textAlign: 'center', color: '#ccc', marginTop: 30 },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 25, minHeight: '60%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  
  avatarEditWrapper: { alignSelf: 'center', marginBottom: 10, position: 'relative' },
  modalAvatar: { width: 100, height: 100, borderRadius: 50 },
  cameraIcon: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#E91E63', padding: 8, borderRadius: 20, borderWidth: 3, borderColor: '#fff' },
  avatarHint: { textAlign: 'center', color: '#999', marginBottom: 20, fontSize: 12 },

  inputGroup: { marginBottom: 20 },
  inputLabel: { color: '#666', marginBottom: 8, fontSize: 14, fontWeight: '600' },
  input: { backgroundColor: '#f5f5f5', padding: 15, borderRadius: 12, fontSize: 16, color: '#000' },

  saveBtn: { backgroundColor: '#E91E63', padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});