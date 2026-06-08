import React from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { useRouter } from 'expo-router';

export default function FavoritesView() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.welcomeText}>COLLECTION</Text>
        <Text style={styles.headerTitle}>FAVORITES.</Text>

        {!isAuthenticated ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>⭐</Text>
            <Text style={styles.emptyTitle}>Registry is Protected</Text>
            <Text style={styles.emptySubtitle}>Log in with your authenticated buyer or partner account to persist and view bookmarked blueprints.</Text>
            <TouchableOpacity 
              style={styles.discoverBtn}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.discoverBtnText}>SIGN IN TO REGISTRY</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>⭐</Text>
            <Text style={styles.emptyTitle}>No Bookmarks Saved</Text>
            <Text style={styles.emptySubtitle}>You haven't bookmarked any premium blueprints yet. Head over to the catalog to begin collecting assets.</Text>
            <TouchableOpacity 
              style={styles.discoverBtn}
              onPress={() => router.push('/')}
            >
              <Text style={styles.discoverBtnText}>EXPLORE DISCOVERY</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
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
    marginBottom: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
    backgroundColor: '#121214',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 20,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  emptySubtitle: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  discoverBtn: {
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
  },
  discoverBtnText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
});
