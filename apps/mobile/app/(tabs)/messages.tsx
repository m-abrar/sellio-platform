import React from 'react';
import { StyleSheet, Text, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthenticatedScreen } from '../../src/auth/AuthenticatedScreen';
import { EmptyState } from '../../src/components/states/AsyncStates';

export default function MessagesView() {
  const router = useRouter();

  return (
    <AuthenticatedScreen returnTo="/messages">
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.welcomeText}>COMMUNICATION</Text>
        <Text style={styles.headerTitle}>INBOX.</Text>

        <EmptyState
          icon="IN"
          title="NO MESSAGES FOUND"
          message="You don't have any conversations yet. Contact a seller from a listing to start one."
          action={{ label: 'EXPLORE MARKETPLACE', onPress: () => router.push('/') }}
        />
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
    marginBottom: 40,
  },
});
