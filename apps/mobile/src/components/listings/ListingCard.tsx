import React from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LISTING_CATEGORIES } from '../../features/listings/catalog';
import { ListingVertical } from '../../features/listings/types';

export interface MobileListingCardItem {
  id?: string;
  vertical: ListingVertical;
  title: string;
  price: string;
  location: string;
  imageUrl: string | null;
  details?: string;
}

interface ListingCardAction {
  label: string;
  onPress: () => void;
  accessibilityLabel: string;
  variant?: 'primary' | 'danger';
}

interface FavoriteToggle {
  isFavorite: boolean;
  isPending: boolean;
  onPress: () => void;
  accessibilityLabel: string;
}

interface ListingCardProps {
  item: MobileListingCardItem;
  variant?: 'grid' | 'row';
  onPress: () => void;
  favoriteToggle?: FavoriteToggle;
  footerAction?: ListingCardAction;
}

export function ListingCard({
  item,
  variant = 'grid',
  onPress,
  favoriteToggle,
  footerAction,
}: ListingCardProps) {
  const category = LISTING_CATEGORIES.find((entry) => entry.id === item.vertical);
  const isRow = variant === 'row';

  return (
    <TouchableOpacity
      style={[styles.card, isRow && styles.rowCard]}
      activeOpacity={0.82}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Open ${item.title}`}
    >
      <View style={[styles.imageFrame, isRow ? styles.rowImageFrame : styles.gridImageFrame]}>
        <Text style={[styles.imageFallback, isRow && styles.rowImageFallback]}>
          {category?.icon || '*'}
        </Text>
        {item.imageUrl && (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.image}
            resizeMode="cover"
            accessibilityLabel={`${item.title} image`}
          />
        )}
        {!isRow && (
          <View style={styles.verticalPill}>
            <Text style={styles.verticalPillText}>{category?.title || item.vertical}</Text>
          </View>
        )}
      </View>

      <View style={[styles.body, isRow && styles.rowBody]}>
        {isRow && (
          <Text style={styles.category}>{category?.title || item.vertical}</Text>
        )}
        <Text style={[styles.title, isRow && styles.rowTitle]} numberOfLines={isRow ? 2 : 1}>
          {item.title}
        </Text>
        {item.details && (
          <Text style={styles.details} numberOfLines={2}>{item.details}</Text>
        )}
        <Text style={styles.location} numberOfLines={1}>{item.location}</Text>
        <View style={styles.footer}>
          <Text style={[styles.price, isRow && styles.rowPrice]} numberOfLines={1}>
            {item.price}
          </Text>
          {footerAction && (
            <TouchableOpacity
              style={[
                styles.footerAction,
                footerAction.variant === 'danger' && styles.footerDangerAction,
              ]}
              onPress={footerAction.onPress}
              accessibilityRole="button"
              accessibilityLabel={footerAction.accessibilityLabel}
            >
              <Text
                style={[
                  styles.footerActionText,
                  footerAction.variant === 'danger' && styles.footerDangerActionText,
                ]}
              >
                {footerAction.label}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {favoriteToggle && (
        <TouchableOpacity
          style={[
            styles.favoriteButton,
            favoriteToggle.isFavorite && styles.favoriteButtonActive,
          ]}
          onPress={favoriteToggle.onPress}
          disabled={favoriteToggle.isPending}
          accessibilityRole="button"
          accessibilityLabel={favoriteToggle.accessibilityLabel}
        >
          {favoriteToggle.isPending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.favoriteButtonText}>
              {favoriteToggle.isFavorite ? '-' : '+'}
            </Text>
          )}
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#121214',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    overflow: 'hidden',
  },
  rowCard: {
    flexDirection: 'row',
  },
  imageFrame: {
    backgroundColor: '#0b0b0c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridImageFrame: {
    height: 178,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  rowImageFrame: {
    width: 116,
    minHeight: 132,
  },
  imageFallback: {
    fontSize: 36,
    opacity: 0.45,
  },
  rowImageFallback: {
    fontSize: 32,
    opacity: 0.5,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  verticalPill: {
    position: 'absolute',
    left: 12,
    top: 12,
    backgroundColor: 'rgba(7, 7, 8, 0.78)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  verticalPillText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  body: {
    padding: 16,
  },
  rowBody: {
    flex: 1,
    justifyContent: 'center',
  },
  category: {
    marginBottom: 5,
    color: '#818cf8',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 5,
  },
  rowTitle: {
    fontSize: 15,
    marginBottom: 7,
  },
  details: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 16,
    marginBottom: 10,
  },
  location: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  price: {
    flex: 1,
    color: '#818cf8',
    fontSize: 16,
    fontWeight: '900',
  },
  rowPrice: {
    color: '#a5b4fc',
    fontSize: 14,
  },
  footerAction: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.3)',
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  footerDangerAction: {
    borderColor: 'rgba(239, 68, 68, 0.3)',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
  },
  footerActionText: {
    color: '#a5b4fc',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  footerDangerActionText: {
    color: '#f87171',
  },
  favoriteButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 38,
    height: 38,
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    backgroundColor: 'rgba(7, 7, 8, 0.82)',
  },
  favoriteButtonActive: {
    borderColor: 'rgba(129, 140, 248, 0.6)',
    backgroundColor: 'rgba(99, 102, 241, 0.9)',
  },
  favoriteButtonText: {
    color: '#fff',
    fontSize: 22,
    lineHeight: 24,
  },
});
