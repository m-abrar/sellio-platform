import { useLocalSearchParams, useRouter } from 'expo-router';
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
import { useAuth } from '../src/context/AuthContext';

export default function RegisterView() {
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegistration = async () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password || !passwordConfirmation) {
      setErrorMessage('Name, email, password, and password confirmation are required.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      setErrorMessage('Enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Your password must contain at least 8 characters.');
      return;
    }
    if (password !== passwordConfirmation) {
      setErrorMessage('The password confirmation does not match.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await signUp({
        name: cleanName,
        email: cleanEmail,
        phone: phone.trim() || undefined,
        password,
        passwordConfirmation,
      });

      if (returnTo === '/favorites' || returnTo === '/activity' || returnTo === '/messages' || returnTo === '/settings') {
        router.replace(returnTo);
      } else {
        router.replace('/');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not create your account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.eyebrow}>SELLIO BUYER ACCOUNT</Text>
          <Text style={styles.title}>JOIN THE MARKETPLACE.</Text>
          <Text style={styles.subtitle}>
            Save listings, contact sellers, reserve bookings, and keep every purchase in one place.
          </Text>

          <View style={styles.form}>
            {errorMessage && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Your full name"
                placeholderTextColor="#475569"
                autoCapitalize="words"
                autoComplete="name"
                editable={!isSubmitting}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email address</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="#475569"
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                editable={!isSubmitting}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone number (optional)</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Your contact number"
                placeholderTextColor="#475569"
                autoComplete="tel"
                keyboardType="phone-pad"
                editable={!isSubmitting}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="At least 8 characters"
                placeholderTextColor="#475569"
                autoCapitalize="none"
                autoComplete="new-password"
                secureTextEntry={!showPasswords}
                editable={!isSubmitting}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm password</Text>
              <TextInput
                style={styles.input}
                value={passwordConfirmation}
                onChangeText={setPasswordConfirmation}
                placeholder="Repeat your password"
                placeholderTextColor="#475569"
                autoCapitalize="none"
                autoComplete="new-password"
                secureTextEntry={!showPasswords}
                editable={!isSubmitting}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowPasswords((visible) => !visible)}
                disabled={isSubmitting}
                accessibilityRole="button"
                accessibilityLabel={showPasswords ? 'Hide passwords' : 'Show passwords'}
              >
                <Text style={styles.passwordToggleText}>
                  {showPasswords ? 'HIDE PASSWORDS' : 'SHOW PASSWORDS'}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.terms}>
              Creating an account gives you a buyer profile. Seller tools remain available through the seller portal.
            </Text>

            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonBusy]}
              onPress={handleRegistration}
              disabled={isSubmitting}
              accessibilityRole="button"
              accessibilityState={{ busy: isSubmitting, disabled: isSubmitting }}
            >
              {isSubmitting && <ActivityIndicator size="small" color="#fff" />}
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'CREATING YOUR ACCOUNT...' : 'CREATE BUYER ACCOUNT'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signInButton}
              onPress={() => router.back()}
              disabled={isSubmitting}
              accessibilityRole="button"
            >
              <Text style={styles.signInPrompt}>ALREADY HAVE AN ACCOUNT?</Text>
              <Text style={styles.signInText}>RETURN TO SIGN IN</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070708' },
  content: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 28, paddingVertical: 44 },
  eyebrow: { color: '#818cf8', fontSize: 9, fontWeight: '900', letterSpacing: 1.8, marginBottom: 12 },
  title: { color: '#fff', fontSize: 27, fontWeight: '900', letterSpacing: 1.1, marginBottom: 10 },
  subtitle: { color: '#64748b', fontSize: 12, fontWeight: '500', lineHeight: 19, marginBottom: 30 },
  form: { gap: 17 },
  errorContainer: { borderRadius: 17, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.24)', backgroundColor: 'rgba(239, 68, 68, 0.08)', padding: 14 },
  errorText: { color: '#f87171', fontSize: 11, fontWeight: '700', lineHeight: 16, textAlign: 'center' },
  inputGroup: { gap: 8 },
  label: { color: '#64748b', fontSize: 9, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
  input: { minHeight: 51, borderRadius: 17, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.06)', backgroundColor: '#121214', paddingHorizontal: 17, paddingVertical: 13, color: '#fff', fontSize: 13, fontWeight: '700' },
  passwordToggle: { alignSelf: 'flex-end', paddingVertical: 3 },
  passwordToggleText: { color: '#818cf8', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  terms: { color: '#475569', fontSize: 10, lineHeight: 16 },
  submitButton: { minHeight: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 18, backgroundColor: '#6366f1', paddingHorizontal: 20, marginTop: 3 },
  submitButtonBusy: { backgroundColor: '#4f46e5' },
  submitButtonText: { color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 1.35 },
  signInButton: { alignItems: 'center', gap: 5, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.06)', paddingTop: 19 },
  signInPrompt: { color: '#475569', fontSize: 9, fontWeight: '900', letterSpacing: 1.1 },
  signInText: { color: '#a5b4fc', fontSize: 10, fontWeight: '900', letterSpacing: 1.1 },
});
