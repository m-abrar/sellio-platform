import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { apiRequest } from '../src/api/client';

export default function ForgotPasswordView() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const requestResetLink = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      setErrorMessage('Enter the email address used for your Sellio account.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await apiRequest('/v1/auth/password/email', {
        method: 'POST',
        body: JSON.stringify({ email: cleanEmail, client: 'mobile' }),
      });
      setSentTo(cleanEmail);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not send the reset email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.content}>
          <Text style={styles.eyebrow}>ACCOUNT RECOVERY</Text>
          <Text style={styles.title}>{sentTo ? 'CHECK YOUR EMAIL.' : 'RESET YOUR PASSWORD.'}</Text>
          <Text style={styles.subtitle}>
            {sentTo
              ? `We sent a secure reset link to ${sentTo}. Open it on this phone to continue in Sellio.`
              : 'Enter your buyer email and we will send a secure link that returns you to the Sellio app.'}
          </Text>

          {errorMessage && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          {!sentTo ? (
            <>
              <Text style={styles.label}>Email address</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="#475569"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!isSubmitting}
              />
              <TouchableOpacity
                style={[styles.primaryButton, isSubmitting && styles.primaryButtonBusy]}
                onPress={requestResetLink}
                disabled={isSubmitting}
                accessibilityRole="button"
                accessibilityState={{ busy: isSubmitting, disabled: isSubmitting }}
              >
                {isSubmitting && <ActivityIndicator size="small" color="#fff" />}
                <Text style={styles.primaryButtonText}>
                  {isSubmitting ? 'SENDING RESET LINK...' : 'SEND RESET LINK'}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.primaryButton} onPress={() => setSentTo(null)} accessibilityRole="button">
              <Text style={styles.primaryButtonText}>SEND ANOTHER LINK</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.back()} accessibilityRole="button">
            <Text style={styles.secondaryButtonText}>RETURN TO SIGN IN</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070708' },
  content: { flex: 1, justifyContent: 'center', padding: 30 },
  eyebrow: { color: '#818cf8', fontSize: 9, fontWeight: '900', letterSpacing: 1.8, marginBottom: 12 },
  title: { color: '#fff', fontSize: 27, fontWeight: '900', letterSpacing: 1.1, marginBottom: 10 },
  subtitle: { color: '#64748b', fontSize: 12, fontWeight: '500', lineHeight: 19, marginBottom: 28 },
  label: { color: '#64748b', fontSize: 9, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  input: { minHeight: 52, borderRadius: 17, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.06)', backgroundColor: '#121214', paddingHorizontal: 17, color: '#fff', fontSize: 13, fontWeight: '700', marginBottom: 17 },
  errorContainer: { borderRadius: 17, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.24)', backgroundColor: 'rgba(239, 68, 68, 0.08)', padding: 14, marginBottom: 18 },
  errorText: { color: '#f87171', fontSize: 11, fontWeight: '700', lineHeight: 16, textAlign: 'center' },
  primaryButton: { minHeight: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 18, backgroundColor: '#6366f1', paddingHorizontal: 20 },
  primaryButtonBusy: { backgroundColor: '#4f46e5' },
  primaryButtonText: { color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 1.35 },
  secondaryButton: { alignItems: 'center', paddingVertical: 18 },
  secondaryButtonText: { color: '#94a3b8', fontSize: 9, fontWeight: '900', letterSpacing: 1.1 },
});
