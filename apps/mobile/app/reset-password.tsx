import { useLocalSearchParams, useRouter } from 'expo-router';
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

export default function ResetPasswordView() {
  const router = useRouter();
  const params = useLocalSearchParams<{ token?: string; email?: string }>();
  const token = Array.isArray(params.token) ? params.token[0] : params.token;
  const email = Array.isArray(params.email) ? params.email[0] : params.email;
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const resetPassword = async () => {
    if (!token || !email) {
      setErrorMessage('This reset link is incomplete. Request a new link from the sign-in screen.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Your new password must contain at least 8 characters.');
      return;
    }
    if (password !== passwordConfirmation) {
      setErrorMessage('The password confirmation does not match.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await apiRequest('/v1/auth/password/reset', {
        method: 'POST',
        body: JSON.stringify({ token, email, password, password_confirmation: passwordConfirmation }),
      });
      setIsComplete(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not reset your password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.content}>
          <Text style={styles.eyebrow}>SECURE ACCOUNT RECOVERY</Text>
          <Text style={styles.title}>{isComplete ? 'PASSWORD UPDATED.' : 'CHOOSE A NEW PASSWORD.'}</Text>
          <Text style={styles.subtitle}>
            {isComplete
              ? 'Your password has been changed. You can now sign in with the new password.'
              : email ? `Resetting the password for ${email}.` : 'This reset link is missing account information.'}
          </Text>

          {errorMessage && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          {!isComplete ? (
            <>
              <Text style={styles.label}>New password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="At least 8 characters"
                placeholderTextColor="#475569"
                secureTextEntry={!showPasswords}
                autoCapitalize="none"
                autoComplete="new-password"
                editable={!isSubmitting}
              />
              <Text style={styles.label}>Confirm new password</Text>
              <TextInput
                style={styles.input}
                value={passwordConfirmation}
                onChangeText={setPasswordConfirmation}
                placeholder="Repeat your new password"
                placeholderTextColor="#475569"
                secureTextEntry={!showPasswords}
                autoCapitalize="none"
                autoComplete="new-password"
                editable={!isSubmitting}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowPasswords((visible) => !visible)}
                disabled={isSubmitting}
                accessibilityRole="button"
              >
                <Text style={styles.passwordToggleText}>{showPasswords ? 'HIDE PASSWORDS' : 'SHOW PASSWORDS'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.primaryButton, isSubmitting && styles.primaryButtonBusy]}
                onPress={resetPassword}
                disabled={isSubmitting}
                accessibilityRole="button"
                accessibilityState={{ busy: isSubmitting, disabled: isSubmitting }}
              >
                {isSubmitting && <ActivityIndicator size="small" color="#fff" />}
                <Text style={styles.primaryButtonText}>
                  {isSubmitting ? 'UPDATING PASSWORD...' : 'UPDATE PASSWORD'}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace('/login')} accessibilityRole="button">
              <Text style={styles.primaryButtonText}>CONTINUE TO SIGN IN</Text>
            </TouchableOpacity>
          )}
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
  input: { minHeight: 52, borderRadius: 17, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.06)', backgroundColor: '#121214', paddingHorizontal: 17, color: '#fff', fontSize: 13, fontWeight: '700', marginBottom: 16 },
  passwordToggle: { alignSelf: 'flex-end', paddingVertical: 2, marginBottom: 17 },
  passwordToggleText: { color: '#818cf8', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  errorContainer: { borderRadius: 17, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.24)', backgroundColor: 'rgba(239, 68, 68, 0.08)', padding: 14, marginBottom: 18 },
  errorText: { color: '#f87171', fontSize: 11, fontWeight: '700', lineHeight: 16, textAlign: 'center' },
  primaryButton: { minHeight: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 18, backgroundColor: '#6366f1', paddingHorizontal: 20 },
  primaryButtonBusy: { backgroundColor: '#4f46e5' },
  primaryButtonText: { color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 1.35 },
});
