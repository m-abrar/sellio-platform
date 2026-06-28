import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { apiRequest, apiResourceRequest } from '../src/api/client';
import { AuthenticatedScreen } from '../src/auth/AuthenticatedScreen';
import { EmptyState, ErrorState, LoadingState } from '../src/components/states/AsyncStates';
import { ListingVertical } from '../src/features/listings/types';

interface ReviewableSummary {
  id: number;
  title?: string | null;
  name?: string | null;
  slug?: string | null;
  primary_image_url?: string | null;
  thumbnail_url?: string | null;
  featured_image?: string | null;
}

interface BuyerReviewRecord {
  id: number;
  reviewable_id: number;
  reviewable_type: string;
  rating: number;
  comment: string;
  partner_reply?: string | null;
  status: string;
  asset_image?: string | null;
  created_at: string;
  reviewable?: ReviewableSummary | null;
}

interface ReviewPaginationMeta {
  current_page?: number;
  last_page?: number;
}

function reviewVertical(type: string): ListingVertical {
  const normalized = type.toLowerCase();
  if (normalized.includes('property')) return 'properties';
  if (normalized.includes('auto')) return 'autos';
  if (normalized.includes('event')) return 'events';
  if (normalized.includes('job')) return 'jobs';
  if (normalized.includes('service')) return 'services';
  if (normalized.includes('classified')) return 'classifieds';
  return 'products';
}

function reviewTitle(review: BuyerReviewRecord) {
  return review.reviewable?.title?.trim()
    || review.reviewable?.name?.trim()
    || `${reviewVertical(review.reviewable_type).slice(0, -1)} #${review.reviewable_id}`;
}

function reviewImage(review: BuyerReviewRecord) {
  return review.asset_image
    || review.reviewable?.primary_image_url
    || review.reviewable?.thumbnail_url
    || review.reviewable?.featured_image
    || null;
}

function reviewDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function ReviewsView() {
  const router = useRouter();
  const [reviews, setReviews] = useState<BuyerReviewRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [editingReview, setEditingReview] = useState<BuyerReviewRecord | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');
  const [editError, setEditError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadReviews = useCallback(async (nextPage = 1, mode: 'load' | 'refresh' | 'more' = 'load') => {
    if (mode === 'refresh') setRefreshing(true);
    else if (mode === 'more') setLoadingMore(true);
    else setLoading(true);
    setError(null);

    try {
      const response = await apiResourceRequest<BuyerReviewRecord[]>(
        `/dashboard/user/reviews?page=${nextPage}`,
        { authenticated: true },
      );
      const incoming = Array.isArray(response.data) ? response.data : [];
      const meta = (response.meta || {}) as ReviewPaginationMeta;
      const currentPage = Number(meta.current_page || nextPage);
      const lastPage = Number(meta.last_page || currentPage);

      setReviews((current) => nextPage === 1
        ? incoming
        : [...current, ...incoming.filter((item) => !current.some((existing) => existing.id === item.id))]);
      setPage(currentPage);
      setHasMore(currentPage < lastPage);
    } catch (requestError) {
      setError(requestError);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadReviews();
    }, [loadReviews]),
  );

  const openEditor = useCallback((review: BuyerReviewRecord) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment);
    setEditError(null);
  }, []);

  const saveReview = async () => {
    if (!editingReview || isSaving) return;
    const comment = editComment.trim();
    if (comment.length < 10) {
      setEditError('Your review must contain at least 10 characters.');
      return;
    }

    setIsSaving(true);
    setEditError(null);
    try {
      await apiRequest(`/dashboard/user/reviews/${editingReview.id}`, {
        method: 'PUT',
        authenticated: true,
        body: JSON.stringify({ rating: editRating, comment }),
      });
      setReviews((current) => current.map((review) => review.id === editingReview.id
        ? { ...review, rating: editRating, comment }
        : review));
      setEditingReview(null);
    } catch (requestError) {
      setEditError(requestError instanceof Error ? requestError.message : 'Could not update your review.');
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = useCallback((review: BuyerReviewRecord) => {
    Alert.alert(
      'Delete review?',
      `Your review of ${reviewTitle(review)} will be permanently deleted.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiRequest(`/dashboard/user/reviews/${review.id}`, {
                method: 'DELETE',
                authenticated: true,
              });
              setReviews((current) => current.filter((item) => item.id !== review.id));
            } catch (requestError) {
              Alert.alert(
                'Could not delete review',
                requestError instanceof Error ? requestError.message : 'Please try again.',
              );
            }
          },
        },
      ],
    );
  }, []);

  return (
    <AuthenticatedScreen returnTo="/activity">
      <SafeAreaView style={styles.container}>
        <FlatList
          data={reviews}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={(
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadReviews(1, 'refresh')}
              tintColor="#818cf8"
              colors={['#6366f1']}
            />
          )}
          onEndReached={() => {
            if (hasMore && !loadingMore) loadReviews(page + 1, 'more');
          }}
          onEndReachedThreshold={0.35}
          ListHeaderComponent={(
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={() => router.back()} accessibilityRole="button">
                <Text style={styles.backButtonText}>{'< ACTIVITY'}</Text>
              </TouchableOpacity>
              <Text style={styles.eyebrow}>BUYER WORKSPACE</Text>
              <Text style={styles.title}>MY REVIEWS.</Text>
              <Text style={styles.subtitle}>Feedback you have shared about marketplace experiences.</Text>
            </View>
          )}
          ListEmptyComponent={loading ? (
            <LoadingState message="Loading your reviews..." />
          ) : error ? (
            <ErrorState error={error} onRetry={() => loadReviews()} />
          ) : (
            <EmptyState icon="*" title="NO REVIEWS YET" message="Reviews from completed buyer experiences will appear here." />
          )}
          ListFooterComponent={loadingMore ? <ActivityIndicator color="#818cf8" style={styles.footerLoader} /> : null}
          renderItem={({ item }) => {
            const imageUrl = reviewImage(item);
            const slug = item.reviewable?.slug?.trim();
            const vertical = reviewVertical(item.reviewable_type);
            return (
              <View style={styles.reviewCard}>
                <View style={styles.imageFrame}>
                  <Text style={styles.imageFallback}>{item.rating}/5</Text>
                  {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} accessibilityLabel={`${reviewTitle(item)} image`} />}
                </View>
                <View style={styles.reviewBody}>
                  <View style={styles.headingRow}>
                    <Text style={styles.moduleLabel}>{vertical.toUpperCase()}</Text>
                    <Text style={styles.status}>{item.status.toUpperCase()}</Text>
                  </View>
                  <Text style={styles.reviewTitle}>{reviewTitle(item)}</Text>
                  <Text style={styles.rating}>RATING {item.rating} / 5</Text>
                  <Text style={styles.comment}>{item.comment}</Text>
                  {item.partner_reply && (
                    <View style={styles.replyBox}>
                      <Text style={styles.replyLabel}>SELLER REPLY</Text>
                      <Text style={styles.replyText}>{item.partner_reply}</Text>
                    </View>
                  )}
                  <Text style={styles.dateText}>POSTED {reviewDate(item.created_at).toUpperCase()}</Text>
                  <View style={styles.actions}>
                    <TouchableOpacity style={styles.secondaryButton} onPress={() => openEditor(item)}>
                      <Text style={styles.secondaryButtonText}>EDIT</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item)}>
                      <Text style={styles.deleteButtonText}>DELETE</Text>
                    </TouchableOpacity>
                    {slug && (
                      <TouchableOpacity
                        style={styles.listingButton}
                        onPress={() => router.push({ pathname: '/listing/[slug]', params: { slug, vertical } })}
                      >
                        <Text style={styles.listingButtonText}>VIEW LISTING</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            );
          }}
        />

        <Modal visible={Boolean(editingReview)} transparent animationType="slide" onRequestClose={() => !isSaving && setEditingReview(null)}>
          <KeyboardAvoidingView style={styles.modalBackdrop} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.modalCard}>
              <Text style={styles.modalEyebrow}>UPDATE FEEDBACK</Text>
              <Text style={styles.modalTitle}>{editingReview ? reviewTitle(editingReview) : 'Review'}</Text>
              <Text style={styles.inputLabel}>RATING</Text>
              <View style={styles.ratingOptions}>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <TouchableOpacity
                    key={rating}
                    style={[styles.ratingOption, editRating === rating && styles.ratingOptionSelected]}
                    onPress={() => setEditRating(rating)}
                    disabled={isSaving}
                  >
                    <Text style={[styles.ratingOptionText, editRating === rating && styles.ratingOptionTextSelected]}>{rating}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.inputLabel}>YOUR REVIEW</Text>
              <TextInput
                style={styles.commentInput}
                value={editComment}
                onChangeText={setEditComment}
                multiline
                maxLength={1000}
                editable={!isSaving}
                textAlignVertical="top"
              />
              {editError && <Text style={styles.editError}>{editError}</Text>}
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setEditingReview(null)} disabled={isSaving}>
                  <Text style={styles.cancelButtonText}>CANCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={saveReview} disabled={isSaving}>
                  {isSaving && <ActivityIndicator size="small" color="#fff" />}
                  <Text style={styles.saveButtonText}>{isSaving ? 'SAVING...' : 'SAVE REVIEW'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </SafeAreaView>
    </AuthenticatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070708' },
  content: { flexGrow: 1, padding: 20, paddingBottom: 44, gap: 16 },
  header: { marginTop: 8, marginBottom: 10 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 8, paddingRight: 12, marginBottom: 18 },
  backButtonText: { color: '#a5b4fc', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  eyebrow: { color: '#64748b', fontSize: 9, fontWeight: '900', letterSpacing: 2, marginBottom: 5 },
  title: { color: '#fff', fontSize: 26, fontWeight: '900', letterSpacing: 1.4 },
  subtitle: { color: '#94a3b8', fontSize: 11, lineHeight: 17, marginTop: 7 },
  reviewCard: { overflow: 'hidden', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.06)', backgroundColor: '#121214' },
  imageFrame: { height: 150, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0b0b0c' },
  imageFallback: { color: '#818cf8', fontSize: 22, fontWeight: '900' },
  image: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  reviewBody: { padding: 18 },
  headingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 8 },
  moduleLabel: { color: '#818cf8', fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  status: { color: '#34d399', fontSize: 8, fontWeight: '900', letterSpacing: 0.8 },
  reviewTitle: { color: '#fff', fontSize: 17, fontWeight: '900', marginBottom: 6 },
  rating: { color: '#fbbf24', fontSize: 9, fontWeight: '900', letterSpacing: 0.8, marginBottom: 13 },
  comment: { color: '#cbd5e1', fontSize: 12, lineHeight: 19 },
  replyBox: { marginTop: 14, padding: 14, borderRadius: 16, backgroundColor: '#0b0b0c' },
  replyLabel: { color: '#64748b', fontSize: 7, fontWeight: '900', letterSpacing: 0.9, marginBottom: 6 },
  replyText: { color: '#94a3b8', fontSize: 11, lineHeight: 17 },
  dateText: { color: '#475569', fontSize: 8, fontWeight: '800', letterSpacing: 0.6, marginTop: 15 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 15 },
  secondaryButton: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 13, borderWidth: 1, borderColor: 'rgba(129, 140, 248, 0.28)' },
  secondaryButtonText: { color: '#a5b4fc', fontSize: 8, fontWeight: '900', letterSpacing: 0.8 },
  deleteButton: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 13, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.25)' },
  deleteButtonText: { color: '#f87171', fontSize: 8, fontWeight: '900', letterSpacing: 0.8 },
  listingButton: { marginLeft: 'auto', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 13, backgroundColor: '#6366f1' },
  listingButtonText: { color: '#fff', fontSize: 8, fontWeight: '900', letterSpacing: 0.8 },
  footerLoader: { paddingVertical: 20 },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.72)' },
  modalCard: { padding: 22, paddingBottom: 32, borderTopLeftRadius: 28, borderTopRightRadius: 28, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)', backgroundColor: '#121214' },
  modalEyebrow: { color: '#818cf8', fontSize: 8, fontWeight: '900', letterSpacing: 1.2, marginBottom: 6 },
  modalTitle: { color: '#fff', fontSize: 20, fontWeight: '900', marginBottom: 20 },
  inputLabel: { color: '#64748b', fontSize: 8, fontWeight: '900', letterSpacing: 1, marginBottom: 8 },
  ratingOptions: { flexDirection: 'row', gap: 9, marginBottom: 18 },
  ratingOption: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)', backgroundColor: '#0b0b0c' },
  ratingOptionSelected: { borderColor: '#818cf8', backgroundColor: 'rgba(99, 102, 241, 0.16)' },
  ratingOptionText: { color: '#64748b', fontSize: 13, fontWeight: '900' },
  ratingOptionTextSelected: { color: '#c7d2fe' },
  commentInput: { minHeight: 130, padding: 15, borderRadius: 17, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)', backgroundColor: '#0b0b0c', color: '#fff', fontSize: 12, lineHeight: 18 },
  editError: { color: '#f87171', fontSize: 10, fontWeight: '700', marginTop: 10 },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 20 },
  cancelButton: { flex: 1, minHeight: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.09)' },
  cancelButtonText: { color: '#94a3b8', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  saveButton: { flex: 2, minHeight: 50, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: '#6366f1' },
  saveButtonText: { color: '#fff', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
});
