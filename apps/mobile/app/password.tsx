import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { apiRequest } from '../src/api/client';
import { AuthenticatedScreen } from '../src/auth/AuthenticatedScreen';
import { validatePasswordChange } from '../src/validation/auth';

export default function PasswordView() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const updatePassword = async () => {
    const validationError = validatePasswordChange(currentPassword, password, passwordConfirmation);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsSaving(true);
    setFormError(null);
    setSuccessMessage(null);

    try {
      await apiRequest('/v1/auth/profile/password', {
        method: 'PUT',
        authenticated: true,
        body: JSON.stringify({
          current_password: currentPassword,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });
      setCurrentPassword('');
      setPassword('');
      setPasswordConfirmation('');
      setShowPasswords(false);
      setSuccessMessage('Your password has been updated.');
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Could not update your password.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AuthenticatedScreen returnTo="/settings">
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()} accessibilityRole="button">
              <Text style={styles.backButtonText}>{'< SETTINGS'}</Text>
            </TouchableOpacity>

            <Text style={styles.eyebrow}>ACCOUNT SECURITY</Text>
            <Text style={styles.title}>PASSWORD.</Text>
            <Text style={styles.intro}>
              Confirm your current password, then choose a new password with at least 8 characters.
            </Text>

            {formError && <Text style={styles.errorText}>{formError}</Text>}
            {successMessage && <Text style={styles.successText}>{successMessage}</Text>}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current password</Text>
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter your current password"
                placeholderTextColor="#475569"
                secureTextEntry={!showPasswords}
                autoCapitalize="none"
                autoComplete="current-password"
                editable={!isSaving}
              />
            </View>

            <View style={styles.inputGroup}>
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
                editable={!isSaving}
              />
            </View>

            <View style={styles.inputGroup}>
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
                editable={!isSaving}
                onSubmitEditing={updatePassword}
              />
            </View>

            <TouchableOpacity
              style={styles.passwordToggle}
              onPress={() => setShowPasswords((visible) => !visible)}
              disabled={isSaving}
              accessibilityRole="button"
              accessibilityLabel={showPasswords ? 'Hide passwords' : 'Show passwords'}
            >
              <Text style={styles.passwordToggleText}>{showPasswords ? 'HIDE PASSWORDS' : 'SHOW PASSWORDS'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, isSaving && styles.saveButtonBusy]}
              onPress={updatePassword}
              disabled={isSaving}
              accessibilityRole="button"
              accessibilityState={{ busy: isSaving, disabled: isSaving }}
            >
              {isSaving && <ActivityIndicator size="small" color="#fff" />}
              <Text style={styles.saveButtonText}>{isSaving ? 'UPDATING PASSWORD...' : 'UPDATE PASSWORD'}</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AuthenticatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070708' },
  content: { flexGrow: 1, paddingHorizontal: 22, paddingTop: 18, paddingBottom: 48 },
  backButton: { alignSelf: 'flex-start', borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.09)', paddingHorizontal: 13, paddingVertical: 8, marginBottom: 24 },
  backButtonText: { color: '#cbd5e1', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  eyebrow: { color: '#64748b', fontSize: 9, fontWeight: '900', letterSpacing: 1.8, marginBottom: 6 },
  title: { color: '#fff', fontSize: 28, fontWeight: '900', letterSpacing: 1.3, marginBottom: 10 },
  intro: { color: '#64748b', fontSize: 11, lineHeight: 17, marginBottom: 26, maxWidth: 360 },
  errorText: { color: '#f87171', fontSize: 11, fontWeight: '700', lineHeight: 16, textAlign: 'center', marginBottom: 16 },
  successText: { color: '#34d399', fontSize: 11, fontWeight: '700', lineHeight: 16, textAlign: 'center', marginBottom: 16 },
  inputGroup: { gap: 8, marginBottom: 16 },
  label: { color: '#64748b', fontSize: 9, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
  input: { minHeight: 51, borderRadius: 17, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.06)', backgroundColor: '#121214', paddingHorizontal: 17, color: '#fff', fontSize: 13, fontWeight: '700' },
  passwordToggle: { alignSelf: 'flex-end', paddingVertical: 3, marginBottom: 22 },
  passwordToggleText: { color: '#818cf8', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  saveButton: { minHeight: 55, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 18, backgroundColor: '#6366f1', paddingHorizontal: 20 },
  saveButtonBusy: { backgroundColor: '#4f46e5' },
  saveButtonText: { color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 1.4 },
});
