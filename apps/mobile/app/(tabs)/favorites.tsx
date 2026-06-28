import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { apiRequest } from '../../src/api/client';
import { AuthenticatedScreen } from '../../src/auth/AuthenticatedScreen';
import { ListingCard } from '../../src/components/listings/ListingCard';
import { EmptyState, ErrorState, LoadingState } from '../../src/components/states/AsyncStates';
import { useAuth } from '../../src/context/AuthContext';
import { toFavoriteListingCard } from '../../src/features/buyer/adapters';
import { FavoriteListingCard, FavoriteRecord } from '../../src/features/buyer/types';

export default function FavoritesView() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteListingCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const loadFavorites = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    setError(null);

    try {
      const records = await apiRequest<FavoriteRecord[]>('/dashboard/user/favorites', {
        authenticated: true,
      });
      setFavorites(records.map(toFavoriteListingCard).filter((item): item is FavoriteListingCard => Boolean(item)));
    } catch (requestError) {
      setError(requestError);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        loadFavorites();
        return;
      }

      setFavorites([]);
      setError(null);
      setLoading(true);
    }, [isAuthenticated, loadFavorites]),
  );

  const confirmRemove = useCallback((item: FavoriteListingCard) => {
    const snapshot = favorites;

    Alert.alert(
      'Remove favorite?',
      `${item.title} will be removed from your saved listings.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            setFavorites(snapshot.filter((favorite) => favorite.favoriteId !== item.favoriteId));

            try {
              await apiRequest(`/dashboard/user/favorites/${item.favoriteId}`, {
                method: 'DELETE',
                authenticated: true,
              });
            } catch (requestError) {
              setFavorites(snapshot);
              Alert.alert(
                'Could not remove favorite',
                requestError instanceof Error
                  ? requestError.message
                  : 'The favorite was restored. Please try again.',
              );
            }
          },
        },
      ],
    );
  }, [favorites]);

  return (
    <AuthenticatedScreen returnTo="/favorites">
      <SafeAreaView style={styles.container}>
        <FlatList
          data={favorites}
          keyExtractor={(item) => String(item.favoriteId)}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadFavorites(true)}
              tintColor="#818cf8"
              colors={['#6366f1']}
            />
          }
          ListHeaderComponent={(
            <View style={styles.header}>
              <Text style={styles.eyebrow}>COLLECTION</Text>
              <Text style={styles.title}>FAVORITES.</Text>
            </View>
          )}
          ListEmptyComponent={
            loading ? (
              <LoadingState message="Loading your favorites..." />
            ) : error ? (
              <ErrorState error={error} onRetry={loadFavorites} />
            ) : (
              <EmptyState
                icon="*"
                title="NO FAVORITES SAVED"
                message="Listings you favorite will appear here."
                action={{ label: 'EXPLORE MARKETPLACE', onPress: () => router.push('/') }}
              />
            )
          }
          renderItem={({ item }) => {
            return (
              <ListingCard
                item={item}
                variant="row"
                onPress={() => router.push({
                  pathname: '/listing/[slug]',
                  params: { slug: item.slug, vertical: item.vertical },
                })}
                footerAction={{
                  label: 'REMOVE',
                  onPress: () => confirmRemove(item),
                  accessibilityLabel: `Remove ${item.title} from favorites`,
                  variant: 'danger',
                }}
              />
            );
          }}
        />
      </SafeAreaView>
    </AuthenticatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070708' },
  content: { padding: 20, paddingBottom: 40, gap: 16, flexGrow: 1 },
  header: { marginTop: 10, marginBottom: 22 },
  eyebrow: { color: '#64748b', fontSize: 9, fontWeight: '900', letterSpacing: 2 },
  title: { color: '#fff', fontSize: 26, fontWeight: '900', letterSpacing: 1.5 },
});
