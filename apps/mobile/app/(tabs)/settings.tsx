import React from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { AuthenticatedScreen } from '../../src/auth/AuthenticatedScreen';

export default function SettingsView() {
  const { isAuthenticated, user, signOut } = useAuth();

  const userInitial = user?.name ? user.name[0].toUpperCase() : 'B';
  const displayName = user?.name || 'Buyer';
  const displayEmail = user?.email || '';

  return (
    <AuthenticatedScreen returnTo="/settings">
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.welcomeText}>WORKSPACE</Text>
        <Text style={styles.headerTitle}>SETTINGS.</Text>

        <View style={styles.profileSection}>
          <View style={[styles.avatarPlaceholder, isAuthenticated && styles.avatarActive]}>
            <Text style={[styles.avatarLetter, isAuthenticated && styles.avatarLetterActive]}>
              {userInitial}
            </Text>
          </View>
          <Text style={styles.profileName}>{displayName}</Text>
          <Text style={styles.profileEmail}>{displayEmail}</Text>

          {isAuthenticated && (
            <TouchableOpacity style={styles.profileLogoutBtn} onPress={signOut}>
              <Text style={styles.profileLogoutBtnText}>LOG OUT</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.menuGroup}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>PR</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Profile Settings</Text>
              <Text style={styles.menuDesc}>Update your name, avatar, and location.</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>PW</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Security & Passwords</Text>
              <Text style={styles.menuDesc}>Update your password and account security.</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>NT</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Notifications</Text>
              <Text style={styles.menuDesc}>Manage buyer notification preferences.</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
    </AuthenticatedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070708',
  },
  scrollContent: {
    padding: 20,
  },
  welcomeText: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 30,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#1e1e20',
    marginBottom: 30,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1b1a24',
    borderWidth: 2,
    borderColor: '#64748b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarActive: {
    borderColor: '#6366f1',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  avatarLetter: {
    color: '#64748b',
    fontSize: 28,
    fontWeight: '900',
  },
  avatarLetterActive: {
    color: '#6366f1',
  },
  profileName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  profileEmail: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 20,
  },
  profileLoginBtn: {
    backgroundColor: '#6366f1',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 999,
  },
  profileLoginBtnText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  profileLogoutBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 999,
  },
  profileLogoutBtnText: {
    color: '#ef4444',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  menuGroup: {
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121214',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    padding: 18,
    borderRadius: 24,
    gap: 16,
  },
  menuIcon: {
    fontSize: 22,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  menuDesc: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '500',
  },
});
