import { ModuleType } from '../types';
import { API_BASE_URL } from '../config/api';

const API_ORIGIN = (() => {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return '';
  }
})();

const FALLBACK_IMAGE = `${API_ORIGIN}/images/fallbacks/default-card.jpg`;

function text(value: any, fallback = '') {
  return value === null || value === undefined || value === '' ? fallback : String(value);
}

function number(value: any, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function firstDefined(...values: any[]) {
  return values.find((value) => value !== null && value !== undefined && value !== '');
}

function absolutizeAssetUrl(value: any) {
  if (!value || typeof value !== 'string') return value;
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  if (value.startsWith('//')) return `${globalThis.location?.protocol || 'https:'}${value}`;

  const normalized = value.startsWith('/') ? value : `/${value}`;
  return API_ORIGIN ? `${API_ORIGIN}${normalized}` : normalized;
}

function mediaItemUrl(media: any) {
  if (!media) return null;
  if (typeof media === 'string') return media;

  return firstDefined(
    media.url,
    media.original_url,
    media.preview_url,
    media.thumbnail,
    media.thumb_url,
    media.conversions?.card,
    media.conversions?.thumb,
  );
}

function galleryUrl(gallery: any) {
  if (!gallery) return null;
  const items = Array.isArray(gallery) ? gallery : gallery.data;
  if (!Array.isArray(items)) return mediaItemUrl(gallery);
  return mediaItemUrl(items[0]);
}

function spatieMediaUrl(media: any) {
  const items = Array.isArray(media) ? media : media?.data;
  if (!Array.isArray(items)) return null;

  const primary =
    items.find((item) =>
      ['featured_image', 'main_image', 'main_photo', 'image', 'cover', 'images'].includes(item?.collection_name),
    ) || items[0];

  return mediaItemUrl(primary);
}

function categoryTitle(resource: any) {
  return text(
    firstDefined(
      resource?.taxonomy?.category?.title,
      resource?.taxonomy?.category,
      resource?.specs?.category,
      resource?.professional?.category?.title,
      resource?.category?.title,
      resource?.category,
    ),
    'General',
  );
}

function imageUrl(module: ModuleType, resource: any) {
  const selected = firstDefined(
    resource?.primary_image_url,
    resource?.thumbnail_url,
    resource?.image_url,
    resource?.cover_url,
    firstDefined(
      resource?.image,
      resource?.featured_image,
      resource?.thumbnail_image,
      resource?.thumbnail,
      resource?.media?.featured_image,
      resource?.media?.main_photo,
      resource?.media?.poster,
      resource?.media?.preview,
      resource?.media?.image_url,
      resource?.media?.cover_url,
      resource?.media?.thumbnail_url,
      resource?.company?.logo,
      resource?.employer?.avatar,
      resource?.vendor?.avatar,
      resource?.owner?.avatar,
      galleryUrl(resource?.media?.gallery),
      galleryUrl(resource?.gallery),
      galleryUrl(resource?.images),
      spatieMediaUrl(resource?.media),
    ),
  );

  return absolutizeAssetUrl(selected || `${FALLBACK_IMAGE}?module=${module}&item=${resource?.id || resource?.slug || 'item'}`);
}

function price(module: ModuleType, resource: any) {
  if (module === 'events') return number(resource?.ticketing?.sale_price || resource?.ticketing?.base_price);
  if (module === 'jobs') return number(resource?.compensation?.max || resource?.compensation?.min);
  return number(
    firstDefined(
      resource?.price,
      resource?.pricing?.current_price,
      resource?.pricing?.active_price,
      resource?.pricing?.sale_price,
      resource?.pricing?.base_price,
      resource?.pricing?.min,
      resource?.pricing?.max,
    ),
  );
}

function locationLabel(resource: any) {
  return text(
    firstDefined(
      resource?.location?.display,
      resource?.location?.title,
      resource?.location?.city && resource?.location?.country
        ? `${resource.location.city}, ${resource.location.country}`
        : null,
      resource?.location?.city,
      resource?.location,
    ),
  );
}

export function toBuyerItem(module: ModuleType, resource: any) {
  return {
    id: text(resource?.slug || resource?.id),
    rawId: resource?.id,
    slug: resource?.slug,
    module,
    title: text(resource?.title, 'Untitled listing'),
    description: text(resource?.short_description || resource?.description, 'No description provided.'),
    price: price(module, resource),
    image: imageUrl(module, resource),
    category: categoryTitle(resource),
    metadata: {
      location: locationLabel(resource),
      date: resource?.schedule?.start_at || resource?.status?.deadline || resource?.created_at,
      rating: firstDefined(resource?.status?.rating, resource?.provider?.rating, resource?.rating),
      beds: resource?.specs?.bedrooms,
      baths: resource?.specs?.bathrooms,
      brand: resource?.taxonomy?.brand?.title || resource?.professional?.brand?.title,
      type:
        resource?.taxonomy?.type?.title ||
        resource?.employment?.type ||
        resource?.item_specs?.condition_label,
      provider:
        resource?.provider?.name ||
        resource?.vendor?.name ||
        resource?.owner?.name ||
        resource?.seller?.name ||
        resource?.organizer?.name ||
        resource?.employer?.name,
    },
    source: resource,
  };
}

function inferModuleFromType(type: string): ModuleType {
  if (type.includes('Property')) return 'properties';
  if (type.includes('Auto')) return 'autos';
  if (type.includes('Event')) return 'events';
  if (type.includes('Service')) return 'services';
  if (type.includes('Job')) return 'jobs';
  if (type.includes('Classified')) return 'classifieds';
  return 'products';
}

export function toFavoriteItem(resource: any) {
  const favoritable = resource?.favoritable || resource?.source || resource;
  const module = inferModuleFromType(text(resource?.favoritable_type || favoritable?.type));
  const item = toBuyerItem(module, favoritable);

  return {
    ...item,
    favoriteId: resource?.id,
  };
}

export function toUserProfile(resource: any) {
  return {
    id: resource?.id,
    name: text(resource?.name, 'Buyer'),
    email: text(resource?.email),
    avatar: text(resource?.avatar || resource?.avatar_url),
    phone: resource?.phone,
    location: resource?.location || '',
    member_since: resource?.created_at ? new Date(resource.created_at).toLocaleDateString() : '',
    settings: resource?.settings || {},
    wallet_balance: number(resource?.wallet_balance, 0),
    roles: resource?.roles || [],
  };
}

export function toReview(resource: any) {
  const reviewable = resource?.reviewable || {};
  const module = inferModuleFromType(text(resource?.reviewable_type));
  const item = toBuyerItem(module, reviewable);

  return {
    id: resource?.id,
    userName: resource?.user?.name || 'You',
    userAvatar: resource?.user?.avatar_url || resource?.user?.avatar || '',
    rating: number(resource?.rating, 0),
    comment: text(resource?.comment),
    itemTitle: item.title,
    itemImage: item.image,
    itemModule: module,
    created_at: resource?.created_at,
  };
}

export function toActivity(resource: any, index = 0, fallbackModule = 'products') {
  const item =
    resource?.item ||
    resource?.property ||
    resource?.event ||
    resource?.service ||
    resource?.job ||
    resource?.job_listing ||
    resource?.auto ||
    resource?.classifiedAd ||
    resource?.classifiedad ||
    resource?.classified ||
    resource?.listing ||
    {};
  const module = text(
    resource?.module ||
    item?.module ||
    (resource?.type ? inferModuleFromType(text(resource.type)) : ''),
    fallbackModule
  );

  const status = text(resource?.status, 'pending').toLowerCase();
  const normalizedStatus = ['pending', 'confirmed', 'completed', 'cancelled'].includes(status)
    ? (status as 'pending' | 'confirmed' | 'completed' | 'cancelled')
    : 'pending';

  const reviewableId = firstDefined(
    item?.id,
    resource?.property_id,
    resource?.event_id,
    resource?.service_id,
    resource?.auto_id,
    resource?.classified_id,
    resource?.reviewable_id,
  );

  return {
    id: resource?.id || index,
    item_id: text(item?.slug || item?.id || resource?.item_id || resource?.listing_id || resource?.id),
    reviewable_id: reviewableId ?? null,
    itemTitle: text(resource?.itemTitle || resource?.item_title || item?.title || resource?.title, 'Activity'),
    module,
    status: normalizedStatus,
    booking_date:
      resource?.booking_date ||
      resource?.check_in_date ||
      resource?.scheduled_at ||
      resource?.preferred_date ||
      resource?.requested_date ||
      resource?.occurrence?.start_date_time ||
      resource?.occurrence?.start_date ||
      resource?.date ||
      resource?.created_at,
    created_at: resource?.created_at || resource?.updated_at || new Date().toISOString(),
    review_id: resource?.review_id || null,
  };
}
