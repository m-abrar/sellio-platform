import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { apiRequest } from '../../src/api/client';
import { AuthenticatedScreen } from '../../src/auth/AuthenticatedScreen';
import { EmptyState, ErrorState, LoadingState } from '../../src/components/states/AsyncStates';
import { useAuth } from '../../src/context/AuthContext';
import { ConversationIndexData, ConversationRecord } from '../../src/features/buyer/types';

function otherParticipant(conversation: ConversationRecord, buyerId?: number) {
  return conversation.user_id === buyerId ? conversation.partner : conversation.user;
}

function lastMessage(conversation: ConversationRecord) {
  return conversation.last_message || conversation.lastMessage || null;
}

function timeLabel(value?: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function MessagesView() {
  const router = useRouter();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const loadConversations = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const payload = await apiRequest<ConversationIndexData>('/dashboard/user/messages', { authenticated: true });
      setConversations(Array.isArray(payload.conversations) ? payload.conversations : []);
    } catch (requestError) {
      setError(requestError);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => {
    loadConversations();
  }, [loadConversations]));

  return (
    <AuthenticatedScreen returnTo="/messages">
      <SafeAreaView style={styles.container}>
        <FlatList
          data={conversations}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.content}
          refreshControl={(
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadConversations(true)}
              tintColor="#818cf8"
              colors={['#6366f1']}
            />
          )}
          ListHeaderComponent={(
            <View style={styles.header}>
              <Text style={styles.eyebrow}>COMMUNICATION</Text>
              <Text style={styles.title}>INBOX.</Text>
            </View>
          )}
          ListEmptyComponent={loading ? (
            <LoadingState message="Loading conversations..." />
          ) : error ? (
            <ErrorState error={error} onRetry={() => loadConversations()} />
          ) : (
            <EmptyState
              icon="IN"
              title="NO MESSAGES FOUND"
              message="Contact a seller from a listing to begin a conversation."
              action={{ label: 'EXPLORE MARKETPLACE', onPress: () => router.push('/') }}
            />
          )}
          renderItem={({ item }) => {
            const participant = otherParticipant(item, user?.id);
            const latest = lastMessage(item);
            const unread = Number(item.unread_count || 0);
            return (
              <TouchableOpacity
                style={styles.conversationCard}
                onPress={() => router.push({ pathname: '/messages/[id]', params: { id: String(item.id) } })}
                accessibilityRole="button"
                accessibilityLabel={`Open conversation with ${participant?.name || 'seller'}`}
              >
                <View style={styles.avatar}>
                  {participant?.avatar_url ? (
                    <Image source={{ uri: participant.avatar_url }} style={styles.avatarImage} />
                  ) : (
                    <Text style={styles.avatarText}>{(participant?.name || 'S')[0].toUpperCase()}</Text>
                  )}
                </View>
                <View style={styles.conversationBody}>
                  <View style={styles.headingRow}>
                    <Text style={styles.participantName} numberOfLines={1}>{participant?.name || 'Seller'}</Text>
                    <Text style={styles.time}>{timeLabel(latest?.created_at || item.updated_at)}</Text>
                  </View>
                  <Text style={[styles.preview, unread > 0 && styles.previewUnread]} numberOfLines={2}>
                    {latest?.body || 'No messages yet. Say hello.'}
                  </Text>
                </View>
                {unread > 0 && <Text style={styles.unreadBadge}>{unread > 99 ? '99+' : unread}</Text>}
              </TouchableOpacity>
            );
          }}
        />
      </SafeAreaView>
    </AuthenticatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070708' },
  content: { flexGrow: 1, padding: 20, paddingBottom: 40, gap: 12 },
  header: { marginTop: 10, marginBottom: 20 },
  eyebrow: { color: '#64748b', fontSize: 9, fontWeight: '900', letterSpacing: 2 },
  title: { color: '#fff', fontSize: 26, fontWeight: '900', letterSpacing: 1.5 },
  conversationCard: { minHeight: 92, flexDirection: 'row', alignItems: 'center', gap: 13, padding: 15, borderRadius: 22, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', backgroundColor: '#121214' },
  avatar: { width: 54, height: 54, borderRadius: 27, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(99,102,241,0.14)', borderWidth: 1, borderColor: 'rgba(129,140,248,0.3)' },
  avatarImage: { width: '100%', height: '100%' },
  avatarText: { color: '#a5b4fc', fontSize: 20, fontWeight: '900' },
  conversationBody: { flex: 1, minWidth: 0 },
  headingRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginBottom: 6 },
  participantName: { flex: 1, color: '#fff', fontSize: 13, fontWeight: '900' },
  time: { color: '#475569', fontSize: 8, fontWeight: '800' },
  preview: { color: '#64748b', fontSize: 10, lineHeight: 15 },
  previewUnread: { color: '#cbd5e1', fontWeight: '800' },
  unreadBadge: { minWidth: 25, paddingHorizontal: 7, paddingVertical: 5, borderRadius: 999, overflow: 'hidden', backgroundColor: '#6366f1', color: '#fff', fontSize: 8, fontWeight: '900', textAlign: 'center' },
});
