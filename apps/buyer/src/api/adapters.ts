import { ModuleType } from '../types';

const FALLBACK_IMAGE = 'https://picsum.photos/seed/sellio-listing/800/600';

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
  return (
    firstDefined(
      resource?.image,
      resource?.featured_image,
      resource?.thumbnail_image,
      resource?.media?.featured_image,
      resource?.media?.main_photo,
      resource?.media?.poster,
      resource?.media?.preview,
      resource?.company?.logo,
      resource?.gallery?.[0]?.url,
    ) || `${FALLBACK_IMAGE}-${module}-${resource?.id || resource?.slug || 'item'}`
  );
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

export function toActivity(resource: any, index = 0) {
  const item = resource?.item || resource?.property || resource?.event || resource?.service || resource?.job || resource?.classified || resource?.listing || {};
  const module = text(resource?.module || item?.module || inferModuleFromType(text(resource?.type)), 'products');

  const status = text(resource?.status, 'pending').toLowerCase();
  const normalizedStatus = ['pending', 'confirmed', 'completed', 'cancelled'].includes(status)
    ? (status as 'pending' | 'confirmed' | 'completed' | 'cancelled')
    : 'pending';

  return {
    id: resource?.id || index,
    item_id: text(item?.slug || item?.id || resource?.item_id || resource?.listing_id || resource?.id),
    itemTitle: text(resource?.itemTitle || resource?.item_title || item?.title || resource?.title, 'Activity'),
    module,
    status: normalizedStatus,
    booking_date: resource?.booking_date || resource?.date || resource?.created_at,
    created_at: resource?.created_at || resource?.updated_at || new Date().toISOString(),
    review_id: resource?.review_id || null,
  };
}
