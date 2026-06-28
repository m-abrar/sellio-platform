import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
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
import { apiRequest, apiResourceRequest } from '../src/api/client';
import { AuthenticatedScreen } from '../src/auth/AuthenticatedScreen';
import { ErrorState, LoadingState } from '../src/components/states/AsyncStates';
import { useAuth } from '../src/context/AuthContext';
import { AuthUser } from '../src/features/auth/types';
import { LocationApiRecord } from '../src/features/listings/types';

interface BuyerProfileResponse {
  user: AuthUser;
}

interface AvatarUploadResponse {
  success: boolean;
  url: string;
}

function locationLabel(location: LocationApiRecord) {
  return [location.title, location.state, location.country]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value))
    .join(' - ');
}

export default function ProfileView() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(user?.location_id || null);
  const [locations, setLocations] = useState<LocationApiRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<unknown>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setLoadError(null);

    try {
      const [profile, locationResponse] = await Promise.all([
        apiRequest<BuyerProfileResponse>('/dashboard/user/profile', { authenticated: true }),
        apiResourceRequest<LocationApiRecord[]>('/v1/locations'),
      ]);
      const currentUser = profile.user;
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      setSelectedLocationId(currentUser.location_id || null);
      setLocations(Array.isArray(locationResponse.data) ? locationResponse.data : []);
    } catch (error) {
      setLoadError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const saveProfile = async () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanName || !/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      setFormError('Enter your name and a valid email address.');
      return;
    }

    setIsSaving(true);
    setFormError(null);
    setSuccessMessage(null);

    try {
      const updatedUser = await apiRequest<AuthUser>('/dashboard/user/profile', {
        method: 'PUT',
        authenticated: true,
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          phone: phone.trim() || null,
          location_id: selectedLocationId,
        }),
      });
      await updateUser(updatedUser);
      setSuccessMessage('Your buyer profile has been updated.');
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Could not update your profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const chooseAvatar = async () => {
    if (!user || isUploading) return;

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setFormError('Photo access is required to choose a profile image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.82,
    });
    if (result.canceled) return;

    const asset = result.assets[0];
    const formData = new FormData();
    formData.append('image', {
      uri: asset.uri,
      name: asset.fileName || `buyer-avatar-${user.id}.jpg`,
      type: asset.mimeType || 'image/jpeg',
    } as unknown as Blob);
    formData.append('model', 'user');
    formData.append('id', String(user.id));
    formData.append('name', 'avatar');

    setIsUploading(true);
    setFormError(null);
    setSuccessMessage(null);

    try {
      const upload = await apiRequest<AvatarUploadResponse>('/dashboard/user/upload-image', {
        method: 'POST',
        authenticated: true,
        body: formData,
      });
      await updateUser({ avatar_url: upload.url, avatar: upload.url });
      setSuccessMessage('Your profile photo has been updated.');
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Could not upload your profile photo.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AuthenticatedScreen returnTo="/settings">
      <SafeAreaView style={styles.container}>
        {loading ? (
          <LoadingState message="Loading your profile..." fullScreen />
        ) : loadError ? (
          <ErrorState
            error={loadError}
            title="PROFILE UNAVAILABLE"
            fallbackMessage="Could not load your buyer profile."
            onRetry={loadProfile}
            fullScreen
          />
        ) : (
          <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
              <TouchableOpacity style={styles.backButton} onPress={() => router.back()} accessibilityRole="button">
                <Text style={styles.backButtonText}>{'< SETTINGS'}</Text>
              </TouchableOpacity>
              <Text style={styles.eyebrow}>BUYER ACCOUNT</Text>
              <Text style={styles.title}>PROFILE.</Text>

              <View style={styles.avatarSection}>
                <View style={styles.avatarFrame}>
                  {user?.avatar_url ? (
                    <Image source={{ uri: user.avatar_url }} style={styles.avatarImage} accessibilityLabel={`${user.name} avatar`} />
                  ) : (
                    <Text style={styles.avatarInitial}>{(user?.name || 'B')[0].toUpperCase()}</Text>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.avatarButton}
                  onPress={chooseAvatar}
                  disabled={isUploading}
                  accessibilityRole="button"
                  accessibilityState={{ busy: isUploading, disabled: isUploading }}
                >
                  {isUploading && <ActivityIndicator size="small" color="#c7d2fe" />}
                  <Text style={styles.avatarButtonText}>{isUploading ? 'UPLOADING...' : 'CHOOSE PROFILE PHOTO'}</Text>
                </TouchableOpacity>
                <Text style={styles.avatarHelp}>JPG, PNG, GIF, or WebP up to 5 MB.</Text>
              </View>

              {formError && <Text style={styles.errorText}>{formError}</Text>}
              {successMessage && <Text style={styles.successText}>{successMessage}</Text>}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full name</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} autoCapitalize="words" editable={!isSaving} />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email address</Text>
                <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" editable={!isSaving} />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone number</Text>
                <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" editable={!isSaving} />
              </View>

              <Text style={styles.sectionLabel}>HOME LOCATION</Text>
              <Text style={styles.locationHelp}>Your location helps Sellio prioritize nearby marketplace results.</Text>
              <View style={styles.locationList}>
                <TouchableOpacity
                  style={[styles.locationOption, selectedLocationId === null && styles.locationOptionSelected]}
                  onPress={() => setSelectedLocationId(null)}
                  disabled={isSaving}
                >
                  <Text style={[styles.locationOptionText, selectedLocationId === null && styles.locationOptionTextSelected]}>No location preference</Text>
                </TouchableOpacity>
                {locations.map((location) => (
                  <TouchableOpacity
                    key={location.id}
                    style={[styles.locationOption, selectedLocationId === location.id && styles.locationOptionSelected]}
                    onPress={() => setSelectedLocationId(location.id)}
                    disabled={isSaving}
                  >
                    <Text style={[styles.locationOptionText, selectedLocationId === location.id && styles.locationOptionTextSelected]}>
                      {locationLabel(location)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.saveButton, isSaving && styles.saveButtonBusy]}
                onPress={saveProfile}
                disabled={isSaving}
                accessibilityRole="button"
                accessibilityState={{ busy: isSaving, disabled: isSaving }}
              >
                {isSaving && <ActivityIndicator size="small" color="#fff" />}
                <Text style={styles.saveButtonText}>{isSaving ? 'SAVING PROFILE...' : 'SAVE PROFILE'}</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </SafeAreaView>
    </AuthenticatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070708' },
  content: { paddingHorizontal: 22, paddingTop: 18, paddingBottom: 48 },
  backButton: { alignSelf: 'flex-start', borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.09)', paddingHorizontal: 13, paddingVertical: 8, marginBottom: 24 },
  backButtonText: { color: '#cbd5e1', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  eyebrow: { color: '#64748b', fontSize: 9, fontWeight: '900', letterSpacing: 1.8, marginBottom: 6 },
  title: { color: '#fff', fontSize: 28, fontWeight: '900', letterSpacing: 1.3, marginBottom: 24 },
  avatarSection: { alignItems: 'center', marginBottom: 26 },
  avatarFrame: { width: 94, height: 94, borderRadius: 47, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: 2, borderColor: '#6366f1', backgroundColor: 'rgba(99, 102, 241, 0.1)', marginBottom: 13 },
  avatarImage: { width: '100%', height: '100%' },
  avatarInitial: { color: '#a5b4fc', fontSize: 34, fontWeight: '900' },
  avatarButton: { minHeight: 42, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(129, 140, 248, 0.35)', backgroundColor: 'rgba(99, 102, 241, 0.08)', paddingHorizontal: 16 },
  avatarButtonText: { color: '#c7d2fe', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  avatarHelp: { color: '#475569', fontSize: 9, marginTop: 8 },
  errorText: { color: '#f87171', fontSize: 11, fontWeight: '700', lineHeight: 16, textAlign: 'center', marginBottom: 16 },
  successText: { color: '#34d399', fontSize: 11, fontWeight: '700', lineHeight: 16, textAlign: 'center', marginBottom: 16 },
  inputGroup: { gap: 8, marginBottom: 16 },
  label: { color: '#64748b', fontSize: 9, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
  input: { minHeight: 51, borderRadius: 17, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.06)', backgroundColor: '#121214', paddingHorizontal: 17, color: '#fff', fontSize: 13, fontWeight: '700' },
  sectionLabel: { color: '#64748b', fontSize: 9, fontWeight: '900', letterSpacing: 1.4, marginTop: 7, marginBottom: 7 },
  locationHelp: { color: '#475569', fontSize: 10, lineHeight: 15, marginBottom: 12 },
  locationList: { gap: 8, marginBottom: 22 },
  locationOption: { minHeight: 45, justifyContent: 'center', borderRadius: 15, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.06)', backgroundColor: '#121214', paddingHorizontal: 15 },
  locationOptionSelected: { borderColor: '#818cf8', backgroundColor: 'rgba(99, 102, 241, 0.12)' },
  locationOptionText: { color: '#94a3b8', fontSize: 11, fontWeight: '700' },
  locationOptionTextSelected: { color: '#e0e7ff' },
  saveButton: { minHeight: 55, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 18, backgroundColor: '#6366f1', paddingHorizontal: 20 },
  saveButtonBusy: { backgroundColor: '#4f46e5' },
  saveButtonText: { color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 1.4 },
});
