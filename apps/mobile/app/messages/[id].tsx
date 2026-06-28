import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { apiRequest } from '../../src/api/client';
import { AuthenticatedScreen } from '../../src/auth/AuthenticatedScreen';
import { ErrorState, LoadingState } from '../../src/components/states/AsyncStates';
import { useAuth } from '../../src/context/AuthContext';
import { ConversationIndexData, MessageRecord } from '../../src/features/buyer/types';
import { RealtimeConnectionState, subscribeToConversationRealtime } from '../../src/realtime/echo';

export default function ConversationView() {
  const router = useRouter();
  const { id: idParam } = useLocalSearchParams<{ id: string }>();
  const conversationId = Number(idParam);
  const { user } = useAuth();
  const listRef = useRef<FlatList<MessageRecord>>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTypingSentAt = useRef(0);
  const [payload, setPayload] = useState<ConversationIndexData | null>(null);
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [page, setPage] = useState(1);
  const [hasOlder, setHasOlder] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [typingName, setTypingName] = useState<string | null>(null);
  const [connectionState, setConnectionState] = useState<RealtimeConnectionState>('connecting');

  const markRead = useCallback(async () => {
    if (!Number.isInteger(conversationId)) return;
    await apiRequest(`/dashboard/user/messages/${conversationId}/read`, {
      method: 'PATCH',
      authenticated: true,
    }).catch(() => {});
  }, [conversationId]);

  const loadConversation = useCallback(async (nextPage = 1) => {
    if (!Number.isInteger(conversationId) || conversationId < 1) {
      setError(new Error('Invalid conversation.'));
      setLoading(false);
      return;
    }
    if (nextPage > 1) setLoadingOlder(true);
    else setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<ConversationIndexData>(
        `/dashboard/user/messages/${conversationId}?per_page=30&page=${nextPage}`,
        { authenticated: true },
      );
      setPayload(response);
      setMessages((current) => nextPage === 1
        ? response.messages
        : [...response.messages, ...current.filter((message) => !response.messages.some((incoming) => incoming.id === message.id))]);
      setPage(response.message_meta?.current_page || nextPage);
      setHasOlder((response.message_meta?.current_page || nextPage) < (response.message_meta?.last_page || nextPage));
      await markRead();
    } catch (requestError) {
      setError(requestError);
    } finally {
      setLoading(false);
      setLoadingOlder(false);
    }
  }, [conversationId, markRead]);

  useEffect(() => {
    loadConversation();
  }, [loadConversation]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let active = true;
    subscribeToConversationRealtime(conversationId, {
      onMessage: (message) => {
        if (!active || message.conversation_id !== conversationId) return;
        setMessages((current) => current.some((item) => item.id === message.id) ? current : [...current, message]);
        markRead();
      },
      onRead: (read) => {
        if (!active) return;
        setMessages((current) => current.map((message) => message.id === read.id ? { ...message, read_at: read.read_at } : message));
      },
      onTyping: (typing) => {
        if (!active || typing.user_id === user?.id) return;
        setTypingName(typing.user_name);
        if (typingTimer.current) clearTimeout(typingTimer.current);
        typingTimer.current = setTimeout(() => setTypingName(null), 2200);
      },
      onConnectionState: (state) => active && setConnectionState(state),
    }).then((unsubscribe) => {
      if (active) cleanup = unsubscribe;
      else unsubscribe();
    });
    return () => {
      active = false;
      cleanup?.();
      if (typingTimer.current) clearTimeout(typingTimer.current);
    };
  }, [conversationId, markRead, user?.id]);

  const sendTyping = () => {
    const now = Date.now();
    if (now - lastTypingSentAt.current < 1200) return;
    lastTypingSentAt.current = now;
    apiRequest(`/dashboard/user/messages/${conversationId}/typing`, {
      method: 'POST',
      authenticated: true,
    }).catch(() => {});
  };

  const sendMessage = async () => {
    const cleanBody = body.trim();
    if (!cleanBody || sending || !user) return;
    const temporaryId = -Date.now();
    const optimistic: MessageRecord = {
      id: temporaryId,
      conversation_id: conversationId,
      sender_id: user.id,
      body: cleanBody,
      read_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sender: user,
    };
    setBody('');
    setSending(true);
    setMessages((current) => [...current, optimistic]);
    try {
      const response = await apiRequest<{ message: MessageRecord }>(`/dashboard/user/messages/${conversationId}`, {
        method: 'POST',
        authenticated: true,
        body: JSON.stringify({ body: cleanBody }),
      });
      setMessages((current) => current.map((message) => message.id === temporaryId ? response.message : message));
    } catch (requestError) {
      setMessages((current) => current.filter((message) => message.id !== temporaryId));
      setBody(cleanBody);
      setError(requestError);
    } finally {
      setSending(false);
    }
  };

  const active = payload?.activeConversation;
  const participant = active
    ? (active.user_id === user?.id ? active.partner : active.user)
    : undefined;

  return (
    <AuthenticatedScreen returnTo="/messages">
      <SafeAreaView style={styles.container}>
        {loading && !payload ? <LoadingState message="Loading conversation..." fullScreen /> : error && !payload ? (
          <ErrorState error={error} onRetry={() => loadConversation()} fullScreen />
        ) : (
          <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Back to inbox"><Text style={styles.backText}>{'< INBOX'}</Text></TouchableOpacity>
              <View style={styles.headerText}>
                <Text style={styles.title} numberOfLines={1}>{participant?.name || 'Conversation'}</Text>
                <Text style={styles.connection}>{typingName ? `${typingName} IS TYPING...` : connectionState.toUpperCase()}</Text>
              </View>
            </View>
            <FlatList
              ref={listRef}
              data={messages}
              keyExtractor={(item) => String(item.id)}
              contentContainerStyle={styles.messages}
              onContentSizeChange={() => page === 1 && listRef.current?.scrollToEnd({ animated: true })}
              ListHeaderComponent={hasOlder ? (
                <TouchableOpacity style={styles.olderButton} onPress={() => loadConversation(page + 1)} disabled={loadingOlder} accessibilityRole="button" accessibilityLabel="Load earlier messages">
                  {loadingOlder && <ActivityIndicator size="small" color="#818cf8" />}
                  <Text style={styles.olderText}>{loadingOlder ? 'LOADING...' : 'LOAD EARLIER MESSAGES'}</Text>
                </TouchableOpacity>
              ) : null}
              renderItem={({ item }) => {
                const mine = item.sender_id === user?.id;
                return (
                  <View style={[styles.messageRow, mine && styles.messageRowMine]}>
                    <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleOther]}>
                      <Text style={[styles.messageText, mine && styles.messageTextMine]}>{item.body}</Text>
                    </View>
                    <Text style={styles.messageMeta}>
                      {item.id < 0 ? 'SENDING' : new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {mine && item.id > 0 ? (item.read_at ? ' - READ' : ' - SENT') : ''}
                    </Text>
                  </View>
                );
              }}
            />
            {Boolean(error && payload) && <Text style={styles.inlineError}>{error instanceof Error ? error.message : 'Message failed.'}</Text>}
            <View style={styles.composer}>
              <TextInput
                style={styles.input}
                value={body}
                onChangeText={(value) => { setBody(value); if (value.trim()) sendTyping(); }}
                placeholder="Write a message"
                placeholderTextColor="#475569"
                multiline
                maxLength={2000}
              />
              <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={!body.trim() || sending} accessibilityRole="button" accessibilityLabel="Send message">
                <Text style={styles.sendText}>{sending ? '...' : 'SEND'}</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        )}
      </SafeAreaView>
    </AuthenticatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070708' },
  header: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 18, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  backButton: { paddingVertical: 10 },
  backText: { color: '#a5b4fc', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  headerText: { flex: 1 },
  title: { color: '#fff', fontSize: 15, fontWeight: '900' },
  connection: { color: '#64748b', fontSize: 7, fontWeight: '900', letterSpacing: 0.8, marginTop: 4 },
  messages: { flexGrow: 1, padding: 18, gap: 13 },
  olderButton: { alignSelf: 'center', flexDirection: 'row', gap: 8, padding: 10, marginBottom: 8 },
  olderText: { color: '#818cf8', fontSize: 8, fontWeight: '900', letterSpacing: 0.8 },
  messageRow: { maxWidth: '82%', alignSelf: 'flex-start' },
  messageRowMine: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  bubble: { paddingHorizontal: 14, paddingVertical: 11, borderRadius: 18 },
  bubbleMine: { backgroundColor: '#6366f1', borderBottomRightRadius: 5 },
  bubbleOther: { backgroundColor: '#17171a', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', borderBottomLeftRadius: 5 },
  messageText: { color: '#cbd5e1', fontSize: 12, lineHeight: 18 },
  messageTextMine: { color: '#fff' },
  messageMeta: { color: '#475569', fontSize: 7, fontWeight: '800', marginTop: 5, letterSpacing: 0.4 },
  inlineError: { color: '#f87171', fontSize: 9, fontWeight: '700', textAlign: 'center', paddingHorizontal: 18, paddingBottom: 5 },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: 9, padding: 13, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)', backgroundColor: '#0b0b0c' },
  input: { flex: 1, maxHeight: 110, minHeight: 46, paddingHorizontal: 15, paddingVertical: 12, borderRadius: 17, backgroundColor: '#17171a', color: '#fff', fontSize: 12 },
  sendButton: { minWidth: 64, height: 46, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: '#6366f1' },
  sendText: { color: '#fff', fontSize: 8, fontWeight: '900', letterSpacing: 1 },
});
