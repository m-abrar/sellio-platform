import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { apiRequest } from '../../src/api/client';
import { ErrorState, LoadingState } from '../../src/components/states/AsyncStates';
import { useAuth } from '../../src/context/AuthContext';
import { FavoriteRecord, FavoriteStatusResponse } from '../../src/features/buyer/types';
import { toListingDetail } from '../../src/features/listings/adapters';
import { LISTING_CATEGORIES } from '../../src/features/listings/catalog';
import { ListingApiRecord, ListingDetailItem, ListingVertical } from '../../src/features/listings/types';

function isListingVertical(value: string | undefined): value is ListingVertical {
  return LISTING_CATEGORIES.some((category) => category.id === value);
}

export default function ListingDetailsView() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const params = useLocalSearchParams<{ slug?: string; vertical?: string }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const verticalParam = Array.isArray(params.vertical) ? params.vertical[0] : params.vertical;
  const vertical = isListingVertical(verticalParam) ? verticalParam : null;
  const [item, setItem] = useState<ListingDetailItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [favoriteStatus, setFavoriteStatus] = useState<'checking' | 'idle' | 'saving' | 'saved' | 'removing'>('idle');
  const [favoriteId, setFavoriteId] = useState<number | null>(null);
  const [favoriteError, setFavoriteError] = useState<string | null>(null);
  const [imageFailed, setImageFailed] = useState(false);
  const [imageRetryKey, setImageRetryKey] = useState(0);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquiryOffer, setInquiryOffer] = useState('');
  const [selectedServicePackageId, setSelectedServicePackageId] = useState('');
  const [serviceTargetDate, setServiceTargetDate] = useState('');
  const [serviceScopeSize, setServiceScopeSize] = useState('');
  const [jobPortfolioUrl, setJobPortfolioUrl] = useState('');
  const [selectedEventOccurrenceId, setSelectedEventOccurrenceId] = useState('');
  const [selectedEventTicketId, setSelectedEventTicketId] = useState('');
  const [eventTicketQuantity, setEventTicketQuantity] = useState('1');
  const [inquiryError, setInquiryError] = useState<string | null>(null);
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);
  const [isPerformingPrimaryAction, setIsPerformingPrimaryAction] = useState(false);

  const fetchDetails = useCallback(async () => {
    const category = LISTING_CATEGORIES.find((entry) => entry.id === vertical);

    if (!slug || !vertical || !category) {
      setItem(null);
      setError(new Error('This listing link is incomplete. Return to the marketplace and open it again.'));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const record = await apiRequest<ListingApiRecord>(
        `${category.endpoint}/${encodeURIComponent(slug)}`,
      );
      setItem(toListingDetail(record, vertical));
    } catch (requestError) {
      setItem(null);
      setError(requestError);
    } finally {
      setLoading(false);
    }
  }, [slug, vertical]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  useEffect(() => {
    setImageFailed(false);
    setImageRetryKey(0);
  }, [item?.imageUrl]);

  useEffect(() => {
    if (!user) return;

    setInquiryName((current) => current || user.name || '');
    setInquiryEmail((current) => current || user.email || '');
    setInquiryPhone((current) => current || user.phone || '');
  }, [user]);

  useEffect(() => {
    if (item?.vertical !== 'services' || selectedServicePackageId) return;
    setSelectedServicePackageId(item.servicePackages[0]?.id || '');
  }, [item, selectedServicePackageId]);

  useEffect(() => {
    if (item?.vertical !== 'events') return;

    const occurrence = item.eventOccurrences.find((entry) => entry.id === selectedEventOccurrenceId)
      || item.eventOccurrences[0];
    if (!occurrence) return;

    if (occurrence.id !== selectedEventOccurrenceId) {
      setSelectedEventOccurrenceId(occurrence.id);
    }

    if (!occurrence.tickets.some((ticket) => ticket.id === selectedEventTicketId)) {
      setSelectedEventTicketId(occurrence.tickets[0]?.id || '');
    }
  }, [item, selectedEventOccurrenceId, selectedEventTicketId]);

  useEffect(() => {
    let active = true;

    async function checkFavoriteStatus() {
      setFavoriteError(null);

      if (!isAuthenticated || !item) {
        setFavoriteId(null);
        setFavoriteStatus('idle');
        return;
      }

      const listingId = Number(item.id);

      if (!Number.isInteger(listingId) || listingId < 1) {
        setFavoriteId(null);
        setFavoriteStatus('idle');
        return;
      }

      setFavoriteStatus('checking');

      try {
        const status = await apiRequest<FavoriteStatusResponse>(
          `/dashboard/user/favorites/status?vertical=${encodeURIComponent(item.vertical)}&listing_id=${listingId}`,
          { authenticated: true },
        );

        if (!active) return;

        setFavoriteId(status.favorite_id);
        setFavoriteStatus(status.is_favorite ? 'saved' : 'idle');
      } catch (requestError) {
        if (!active) return;

        setFavoriteId(null);
        setFavoriteStatus('idle');
        setFavoriteError(
          requestError instanceof Error
            ? requestError.message
            : 'Could not check this favorite. Please try again.',
        );
      }
    }

    checkFavoriteStatus();

    return () => {
      active = false;
    };
  }, [isAuthenticated, item]);

  const toggleFavorite = useCallback(async () => {
    if (!item || favoriteStatus === 'checking' || favoriteStatus === 'saving' || favoriteStatus === 'removing') return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const listingId = Number(item.id);

    if (!Number.isInteger(listingId) || listingId < 1) {
      setFavoriteError('This listing cannot be saved right now.');
      return;
    }

    setFavoriteError(null);

    if (favoriteStatus === 'saved' && favoriteId) {
      setFavoriteStatus('removing');

      try {
        await apiRequest(`/dashboard/user/favorites/${favoriteId}`, {
          method: 'DELETE',
          authenticated: true,
        });
        setFavoriteId(null);
        setFavoriteStatus('idle');
      } catch (requestError) {
        setFavoriteStatus('saved');
        setFavoriteError(
          requestError instanceof Error
            ? requestError.message
            : 'Could not remove this favorite. Please try again.',
        );
      }

      return;
    }

    setFavoriteStatus('saving');

    try {
      const favorite = await apiRequest<FavoriteRecord>('/dashboard/user/favorites', {
        method: 'POST',
        authenticated: true,
        body: JSON.stringify({
          vertical: item.vertical,
          listing_id: listingId,
        }),
      });
      setFavoriteId(favorite.id);
      setFavoriteStatus('saved');
    } catch (requestError) {
      setFavoriteStatus('idle');
      setFavoriteError(
        requestError instanceof Error
          ? requestError.message
          : 'Could not save this listing. Please try again.',
      );
    }
  }, [favoriteId, favoriteStatus, isAuthenticated, item, router]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingState message="Loading listing..." fullScreen />
      </SafeAreaView>
    );
  }

  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorState
          error={error}
          title="LISTING UNAVAILABLE"
          fallbackMessage="Unable to load this listing."
          onRetry={fetchDetails}
          secondaryAction={{ label: 'BACK TO MARKETPLACE', onPress: () => router.back() }}
          fullScreen
        />
      </SafeAreaView>
    );
  }

  const category = LISTING_CATEGORIES.find((entry) => entry.id === item.vertical);
  const canShowImage = Boolean(item.imageUrl) && !imageFailed;
  const selectedEventOccurrence = item.eventOccurrences.find(
    (occurrence) => occurrence.id === selectedEventOccurrenceId,
  ) || item.eventOccurrences[0];
  const handlePrimaryAction = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (item.vertical === 'products') {
      setIsPerformingPrimaryAction(true);

      try {
        const cart = await apiRequest<{ item_count: number }>(
          `/v1/cart/add/${encodeURIComponent(item.id)}`,
          {
            method: 'POST',
            authenticated: true,
            body: JSON.stringify({ quantity: 1 }),
          },
        );
        Alert.alert(
          'Added to cart',
          `${item.title} is in your cart. Your cart now has ${cart.item_count} item${cart.item_count === 1 ? '' : 's'}.`,
        );
      } catch (requestError) {
        Alert.alert(
          'Could not add item',
          requestError instanceof Error ? requestError.message : 'Please try again.',
        );
      } finally {
        setIsPerformingPrimaryAction(false);
      }

      return;
    }

    if (item.vertical === 'services' && item.servicePackages.length === 0) {
      Alert.alert('Quote unavailable', 'This provider has not published an active service package yet.');
      return;
    }

    if (item.vertical === 'properties' && item.isRentalProperty) {
      Alert.alert('Coming soon', item.primaryActionDescription);
      return;
    }

    if (item.vertical === 'events' && item.eventOccurrences.length === 0) {
      Alert.alert('Tickets unavailable', 'There are no upcoming ticket options for this event.');
      return;
    }

    if (
      item.vertical === 'autos'
      || item.vertical === 'classifieds'
      || item.vertical === 'services'
      || item.vertical === 'jobs'
      || item.vertical === 'properties'
      || item.vertical === 'events'
    ) {
      setInquiryError(null);
      setShowInquiryForm(true);
      return;
    }

    Alert.alert('Coming soon', item.primaryActionDescription);
  };

  const submitListingInquiry = async () => {
    if (!item || !['autos', 'classifieds', 'services', 'jobs', 'properties', 'events'].includes(item.vertical) || isSubmittingInquiry) return;

    const fullName = inquiryName.trim();
    const email = inquiryEmail.trim();
    const isServiceQuote = item.vertical === 'services';
    const isJobApplication = item.vertical === 'jobs';
    const isPropertyInquiry = item.vertical === 'properties';
    const isEventBooking = item.vertical === 'events';

    if (!isServiceQuote && !isJobApplication && !isEventBooking && (!fullName || !email)) {
      setInquiryError('Your name and email address are required.');
      return;
    }

    if (isServiceQuote && (!selectedServicePackageId || !serviceTargetDate.trim() || !serviceScopeSize.trim())) {
      setInquiryError('Choose a package and enter the target date and project size.');
      return;
    }

    if (isJobApplication && !inquiryMessage.trim()) {
      setInquiryError('Write a cover letter before submitting your application.');
      return;
    }

    const quantity = Number(eventTicketQuantity);
    if (isEventBooking && (!selectedEventOccurrenceId || !selectedEventTicketId || !Number.isInteger(quantity) || quantity < 1 || quantity > 10)) {
      setInquiryError('Choose an event date and ticket, then enter a quantity from 1 to 10.');
      return;
    }

    setIsSubmittingInquiry(true);
    setInquiryError(null);

    try {
      const isVehicle = item.vertical === 'autos';
      const endpoint = isEventBooking
        ? `/v1/events/${encodeURIComponent(item.id)}/bookings`
        : isJobApplication
        ? `/v1/jobs/${encodeURIComponent(item.slug)}/applications`
        : isServiceQuote
        ? `/v1/services/${encodeURIComponent(item.id)}/quotes`
        : isPropertyInquiry
          ? `/v1/properties/${encodeURIComponent(item.id)}/inquiries`
        : isVehicle
          ? `/v1/vehicles/${encodeURIComponent(item.id)}/inquiries`
          : `/v1/classifieds/${encodeURIComponent(item.slug)}/inquiries`;
      const body = isEventBooking
        ? {
            event_occurrence_id: Number(selectedEventOccurrenceId),
            event_ticket_type_id: Number(selectedEventTicketId),
            quantity,
          }
        : isJobApplication
        ? {
            cover_letter: inquiryMessage.trim(),
            portfolio_url: jobPortfolioUrl.trim() || null,
          }
        : isServiceQuote
        ? {
            service_package_id: Number(selectedServicePackageId),
            target_date: serviceTargetDate.trim(),
            scope_size: Number(serviceScopeSize),
            notes: inquiryMessage.trim() || null,
          }
        : {
            full_name: fullName,
            email,
            phone: inquiryPhone.trim() || null,
            message: inquiryMessage.trim() || null,
            ...(isVehicle
              ? { preferred_time: 'Anytime' }
              : item.vertical === 'classifieds'
                ? { offer_price: inquiryOffer.trim() || null }
                : {}),
          };

      const submission = await apiRequest<{ status?: string; total_price?: number | string }>(endpoint, {
        method: 'POST',
        authenticated: true,
        body: JSON.stringify(body),
      });

      setShowInquiryForm(false);
      setInquiryMessage('');
      setInquiryOffer('');
      setJobPortfolioUrl('');
      setEventTicketQuantity('1');

      if (isEventBooking) {
        const confirmed = submission.status === 'confirmed';
        Alert.alert(
          confirmed ? 'Tickets confirmed' : 'Booking created',
          confirmed
            ? 'Your tickets are confirmed and available in Buyer Activity.'
            : 'Your tickets are reserved. Payment handoff will be connected in a later transaction slice.',
        );
        return;
      }

      Alert.alert(
        isJobApplication ? 'Application submitted' : 'Inquiry sent',
        `${isJobApplication
          ? 'The employer'
          : isServiceQuote
            ? 'The provider'
            : isVehicle
              ? 'The dealer'
              : isPropertyInquiry
                ? 'The listing agent'
              : 'The seller'} has received your ${isJobApplication ? 'application' : 'inquiry'}. You can track it in Buyer Activity.`,
      );
    } catch (requestError) {
      setInquiryError(
        requestError instanceof Error
          ? requestError.message
          : 'Could not send your inquiry. Please try again.',
      );
    } finally {
      setIsSubmittingInquiry(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>{'< BACK'}</Text>
          </TouchableOpacity>
          <Text style={styles.navTitle}>{category?.title || item.vertical}</Text>
        </View>

        <View style={styles.galleryPlaceholder}>
          <Text style={styles.galleryIcon}>{category?.icon || '*'}</Text>
          {canShowImage && item.imageUrl && (
            <Image
              key={`${item.imageUrl}-${imageRetryKey}`}
              source={{ uri: item.imageUrl }}
              style={styles.galleryImage}
              resizeMode="cover"
              accessibilityLabel={`${item.title} image`}
              onError={() => setImageFailed(true)}
            />
          )}
          {item.imageUrl && imageFailed && (
            <TouchableOpacity
              style={styles.imageRetryButton}
              onPress={() => {
                setImageFailed(false);
                setImageRetryKey((current) => current + 1);
              }}
              accessibilityRole="button"
              accessibilityLabel={`Retry loading ${item.title} image`}
            >
              <Text style={styles.imageRetryText}>RETRY IMAGE</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.detailsGroup}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemSpec}>{item.details}</Text>
          <View style={styles.priceSection}>
            <Text style={styles.priceText}>{item.price}</Text>
            <Text style={styles.locationText}>{item.location}</Text>
          </View>
          <Text style={styles.sectionHeader}>DESCRIPTION</Text>
          <Text style={styles.itemDesc}>{item.description}</Text>
          {item.facts.length > 0 && (
            <>
              <Text style={styles.sectionHeader}>DETAILS</Text>
              <View style={styles.factsGrid}>
                {item.facts.map((detail) => (
                  <View key={`${detail.label}-${detail.value}`} style={styles.factCard}>
                    <Text style={styles.factLabel}>{detail.label}</Text>
                    <Text style={styles.factValue}>{detail.value}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
          <TouchableOpacity
            style={[styles.favoriteBtn, favoriteStatus === 'saved' && styles.favoriteBtnSaved]}
            onPress={toggleFavorite}
            disabled={favoriteStatus === 'checking' || favoriteStatus === 'saving' || favoriteStatus === 'removing'}
            accessibilityRole="button"
            accessibilityLabel={favoriteStatus === 'saved' ? 'Remove from favorites' : 'Save to favorites'}
          >
            {favoriteStatus === 'checking' || favoriteStatus === 'saving' || favoriteStatus === 'removing' ? (
              <ActivityIndicator size="small" color="#a5b4fc" />
            ) : (
              <Text style={[styles.favoriteBtnText, favoriteStatus === 'saved' && styles.favoriteBtnTextSaved]}>
                {favoriteStatus === 'saved'
                  ? 'REMOVE FROM FAVORITES'
                  : isAuthenticated
                    ? 'SAVE TO FAVORITES'
                    : 'SIGN IN TO SAVE'}
              </Text>
            )}
          </TouchableOpacity>
          {favoriteError && <Text style={styles.favoriteError}>{favoriteError}</Text>}
          {showInquiryForm && ['autos', 'classifieds', 'services', 'jobs', 'properties', 'events'].includes(item.vertical) && (
            <View style={styles.inquiryForm}>
              <View style={styles.inquiryHeadingRow}>
                <View style={styles.inquiryHeadingCopy}>
                  <Text style={styles.sectionHeader}>
                    {item.vertical === 'autos'
                      ? 'VEHICLE INQUIRY'
                      : item.vertical === 'events'
                        ? 'EVENT BOOKING'
                      : item.vertical === 'services'
                        ? 'SERVICE QUOTE'
                      : item.vertical === 'jobs'
                          ? 'JOB APPLICATION'
                          : item.vertical === 'properties'
                            ? 'PROPERTY INQUIRY'
                        : 'SELLER INQUIRY'}
                  </Text>
                  <Text style={styles.inquiryHelp}>
                    {item.vertical === 'jobs'
                      ? 'Introduce yourself to the employer and share relevant work.'
                      : item.vertical === 'events'
                        ? 'Choose an event date, ticket type, and quantity.'
                      : item.vertical === 'properties'
                        ? 'Send your details directly to the listing agent.'
                      : item.vertical === 'services'
                      ? 'Tell the provider what you need and when you need it.'
                      : `Send your details directly to the ${item.vertical === 'autos' ? 'dealer' : 'seller'}.`}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setShowInquiryForm(false)}
                  disabled={isSubmittingInquiry}
                  accessibilityRole="button"
                  accessibilityLabel="Close inquiry form"
                >
                  <Text style={styles.inquiryClose}>CLOSE</Text>
                </TouchableOpacity>
              </View>
              {item.vertical !== 'services' && item.vertical !== 'jobs' && item.vertical !== 'events' && (
                <>
                  <TextInput
                    style={styles.inquiryInput}
                    value={inquiryName}
                    onChangeText={setInquiryName}
                    placeholder="Full name"
                    placeholderTextColor="#475569"
                    autoCapitalize="words"
                    editable={!isSubmittingInquiry}
                  />
                  <TextInput
                    style={styles.inquiryInput}
                    value={inquiryEmail}
                    onChangeText={setInquiryEmail}
                    placeholder="Email address"
                    placeholderTextColor="#475569"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!isSubmittingInquiry}
                  />
                  <TextInput
                    style={styles.inquiryInput}
                    value={inquiryPhone}
                    onChangeText={setInquiryPhone}
                    placeholder="Phone number (optional)"
                    placeholderTextColor="#475569"
                    keyboardType="phone-pad"
                    editable={!isSubmittingInquiry}
                  />
                </>
              )}
              {item.vertical === 'services' && (
                <>
                  <Text style={styles.inquiryFieldLabel}>CHOOSE A PACKAGE</Text>
                  {item.servicePackages.map((servicePackage) => (
                    <TouchableOpacity
                      key={servicePackage.id}
                      style={[
                        styles.packageOption,
                        selectedServicePackageId === servicePackage.id && styles.packageOptionSelected,
                      ]}
                      onPress={() => setSelectedServicePackageId(servicePackage.id)}
                      disabled={isSubmittingInquiry}
                    >
                      <View style={styles.packageOptionCopy}>
                        <Text style={styles.packageOptionTitle}>{servicePackage.title}</Text>
                        {servicePackage.description && (
                          <Text style={styles.packageOptionDescription}>{servicePackage.description}</Text>
                        )}
                      </View>
                      <Text style={styles.packageOptionPrice}>{servicePackage.price}</Text>
                    </TouchableOpacity>
                  ))}
                  <TextInput
                    style={styles.inquiryInput}
                    value={serviceTargetDate}
                    onChangeText={setServiceTargetDate}
                    placeholder="Target date (YYYY-MM-DD)"
                    placeholderTextColor="#475569"
                    autoCapitalize="none"
                    maxLength={10}
                    editable={!isSubmittingInquiry}
                  />
                  <TextInput
                    style={styles.inquiryInput}
                    value={serviceScopeSize}
                    onChangeText={setServiceScopeSize}
                    placeholder="Project size or quantity"
                    placeholderTextColor="#475569"
                    keyboardType="numeric"
                    editable={!isSubmittingInquiry}
                  />
                </>
              )}
              {item.vertical === 'jobs' && (
                <TextInput
                  style={styles.inquiryInput}
                  value={jobPortfolioUrl}
                  onChangeText={setJobPortfolioUrl}
                  placeholder="Portfolio URL (optional)"
                  placeholderTextColor="#475569"
                  keyboardType="url"
                  autoCapitalize="none"
                  maxLength={255}
                  editable={!isSubmittingInquiry}
                />
              )}
              {item.vertical === 'events' && (
                <>
                  <Text style={styles.inquiryFieldLabel}>CHOOSE AN EVENT DATE</Text>
                  {item.eventOccurrences.map((occurrence) => (
                    <TouchableOpacity
                      key={occurrence.id}
                      style={[
                        styles.packageOption,
                        selectedEventOccurrenceId === occurrence.id && styles.packageOptionSelected,
                      ]}
                      onPress={() => setSelectedEventOccurrenceId(occurrence.id)}
                      disabled={isSubmittingInquiry}
                    >
                      <View style={styles.packageOptionCopy}>
                        <Text style={styles.packageOptionTitle}>{occurrence.label}</Text>
                        {occurrence.venue && (
                          <Text style={styles.packageOptionDescription}>{occurrence.venue}</Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                  <Text style={styles.inquiryFieldLabel}>CHOOSE A TICKET</Text>
                  {selectedEventOccurrence?.tickets.map((ticket) => (
                    <TouchableOpacity
                      key={ticket.id}
                      style={[
                        styles.packageOption,
                        selectedEventTicketId === ticket.id && styles.packageOptionSelected,
                      ]}
                      onPress={() => setSelectedEventTicketId(ticket.id)}
                      disabled={isSubmittingInquiry}
                    >
                      <View style={styles.packageOptionCopy}>
                        <Text style={styles.packageOptionTitle}>{ticket.title}</Text>
                        <Text style={styles.packageOptionDescription}>
                          {ticket.availableQuantity} available
                        </Text>
                      </View>
                      <Text style={styles.packageOptionPrice}>{ticket.price}</Text>
                    </TouchableOpacity>
                  ))}
                  <TextInput
                    style={styles.inquiryInput}
                    value={eventTicketQuantity}
                    onChangeText={setEventTicketQuantity}
                    placeholder="Ticket quantity (1-10)"
                    placeholderTextColor="#475569"
                    keyboardType="number-pad"
                    maxLength={2}
                    editable={!isSubmittingInquiry}
                  />
                </>
              )}
              {item.vertical !== 'events' && (
                <TextInput
                  style={[styles.inquiryInput, styles.inquiryMessageInput]}
                  value={inquiryMessage}
                  onChangeText={setInquiryMessage}
                  placeholder={item.vertical === 'jobs'
                    ? 'Write your cover letter'
                    : item.vertical === 'services'
                      ? 'Describe your requirements (optional)'
                      : 'What would you like to ask? (optional)'}
                  placeholderTextColor="#475569"
                  multiline
                  maxLength={item.vertical === 'jobs' ? 5000 : item.vertical === 'services' ? 1000 : 500}
                  textAlignVertical="top"
                  editable={!isSubmittingInquiry}
                />
              )}
              {item.vertical === 'classifieds' && (
                <TextInput
                  style={styles.inquiryInput}
                  value={inquiryOffer}
                  onChangeText={setInquiryOffer}
                  placeholder="Your offer (optional)"
                  placeholderTextColor="#475569"
                  keyboardType="decimal-pad"
                  maxLength={100}
                  editable={!isSubmittingInquiry}
                />
              )}
              {inquiryError && <Text style={styles.inquiryError}>{inquiryError}</Text>}
              <TouchableOpacity
                style={[styles.inquirySubmit, isSubmittingInquiry && styles.inquirySubmitBusy]}
                onPress={submitListingInquiry}
                disabled={isSubmittingInquiry}
                accessibilityRole="button"
                accessibilityState={{ busy: isSubmittingInquiry, disabled: isSubmittingInquiry }}
              >
                {isSubmittingInquiry && <ActivityIndicator size="small" color="#fff" />}
                <Text style={styles.actionBtnText}>
                  {isSubmittingInquiry
                    ? item.vertical === 'jobs'
                      ? 'SUBMITTING...'
                      : item.vertical === 'events' ? 'RESERVING...' : 'SENDING INQUIRY...'
                    : item.vertical === 'jobs'
                      ? 'SUBMIT APPLICATION'
                      : item.vertical === 'events' ? 'RESERVE TICKETS' : 'SEND INQUIRY'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity
            style={[styles.actionBtn, isPerformingPrimaryAction && styles.actionBtnBusy]}
            onPress={handlePrimaryAction}
            disabled={isPerformingPrimaryAction}
            accessibilityRole="button"
            accessibilityState={{ busy: isPerformingPrimaryAction, disabled: isPerformingPrimaryAction }}
          >
            {isPerformingPrimaryAction && <ActivityIndicator size="small" color="#fff" />}
            <Text style={styles.actionBtnText}>
              {isPerformingPrimaryAction
                ? 'ADDING TO CART...'
                : isAuthenticated ? item.primaryActionLabel : `SIGN IN TO ${item.primaryActionLabel}`}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070708' },
  scrollContent: { paddingBottom: 40 },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#1e1e20' },
  backBtn: { backgroundColor: 'rgba(255, 255, 255, 0.04)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999 },
  backText: { color: '#fff', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  navTitle: { color: '#64748b', fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1.5 },
  galleryPlaceholder: { height: 240, backgroundColor: '#0b0b0c', justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.04)' },
  galleryIcon: { color: '#818cf8', fontSize: 64 },
  galleryImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  imageRetryButton: { position: 'absolute', bottom: 18, alignSelf: 'center', borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.16)', backgroundColor: 'rgba(7, 7, 8, 0.82)', paddingHorizontal: 14, paddingVertical: 8 },
  imageRetryText: { color: '#c7d2fe', fontSize: 8, fontWeight: '900', letterSpacing: 0.8 },
  detailsGroup: { padding: 24 },
  itemTitle: { color: '#fff', fontSize: 24, fontWeight: '900', marginBottom: 6 },
  itemSpec: { color: '#64748b', fontSize: 12, fontWeight: '600', marginBottom: 20 },
  priceSection: { backgroundColor: '#121214', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.04)', padding: 20, borderRadius: 24, marginBottom: 30, gap: 8 },
  priceText: { color: '#818cf8', fontSize: 20, fontWeight: '900' },
  locationText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  sectionHeader: { color: '#64748b', fontSize: 10, fontWeight: '900', letterSpacing: 1.5, marginBottom: 10 },
  itemDesc: { color: '#94a3b8', fontSize: 13, fontWeight: '500', lineHeight: 20, marginBottom: 30 },
  factsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 34 },
  factCard: { width: '48%', minHeight: 74, justifyContent: 'center', borderRadius: 18, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.06)', backgroundColor: '#121214', paddingHorizontal: 14, paddingVertical: 12 },
  factLabel: { color: '#64748b', fontSize: 8, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 5 },
  factValue: { color: '#e2e8f0', fontSize: 12, fontWeight: '800', lineHeight: 17 },
  favoriteBtn: { minHeight: 52, marginBottom: 12, alignItems: 'center', justifyContent: 'center', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(129, 140, 248, 0.35)', backgroundColor: 'rgba(99, 102, 241, 0.08)', paddingHorizontal: 20 },
  favoriteBtnSaved: { borderColor: 'rgba(239, 68, 68, 0.35)', backgroundColor: 'rgba(239, 68, 68, 0.08)' },
  favoriteBtnText: { color: '#a5b4fc', fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  favoriteBtnTextSaved: { color: '#f87171' },
  favoriteError: { marginTop: -2, marginBottom: 14, color: '#f87171', fontSize: 11, lineHeight: 16, textAlign: 'center' },
  inquiryForm: { gap: 12, marginBottom: 16, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(129, 140, 248, 0.22)', backgroundColor: '#101012', padding: 18 },
  inquiryHeadingRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 2 },
  inquiryHeadingCopy: { flex: 1 },
  inquiryHelp: { color: '#64748b', fontSize: 11, lineHeight: 16 },
  inquiryFieldLabel: { color: '#64748b', fontSize: 9, fontWeight: '900', letterSpacing: 1, marginTop: 2 },
  inquiryClose: { color: '#a5b4fc', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  inquiryInput: { minHeight: 50, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.07)', backgroundColor: '#17171a', paddingHorizontal: 16, paddingVertical: 13, color: '#fff', fontSize: 13, fontWeight: '600' },
  inquiryMessageInput: { minHeight: 108 },
  packageOption: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.07)', backgroundColor: '#17171a', padding: 14 },
  packageOptionSelected: { borderColor: '#818cf8', backgroundColor: 'rgba(99, 102, 241, 0.12)' },
  packageOptionCopy: { flex: 1 },
  packageOptionTitle: { color: '#fff', fontSize: 12, fontWeight: '900' },
  packageOptionDescription: { color: '#64748b', fontSize: 10, lineHeight: 14, marginTop: 3 },
  packageOptionPrice: { color: '#a5b4fc', fontSize: 11, fontWeight: '900' },
  inquiryError: { color: '#f87171', fontSize: 11, lineHeight: 16 },
  inquirySubmit: { minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 18, backgroundColor: '#6366f1', paddingHorizontal: 20 },
  inquirySubmitBusy: { backgroundColor: '#4f46e5' },
  actionBtn: { minHeight: 52, flexDirection: 'row', justifyContent: 'center', gap: 10, backgroundColor: '#6366f1', paddingVertical: 18, paddingHorizontal: 24, borderRadius: 20, alignItems: 'center' },
  actionBtnBusy: { backgroundColor: '#4f46e5' },
  actionBtnText: { color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
});
