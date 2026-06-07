import { apiRequest, buyerUrl } from './apiClient';
import { storefrontListingUrl } from '../config/api';

function toMessage(message: any) {
  return {
    id: message.id,
    conversation_id: message.conversation_id,
    sender_id: message.sender_id,
    receiver_id: message.receiver_id,
    content: message.content || message.body,
    created_at: message.created_at,
  };
}

export const fetchMessages = async (conversationId?: number | string) => {
  const payload = await apiRequest<any>(
    buyerUrl(conversationId ? `/messages/${conversationId}` : '/messages'),
    { authenticated: true },
  );

  return (payload?.messages || []).map((message: any) => ({
    ...toMessage(message),
  }));
};

export const fetchConversations = async () => {
  const payload = await apiRequest<any>(buyerUrl('/messages'), { authenticated: true });
  const currentUserId = payload?.user?.id;

  return (payload?.conversations || []).map((conversation: any) => {
    const participant =
      conversation.partner_id === currentUserId
        ? conversation.user || {}
        : conversation.partner || conversation.user || {};

    const inquiriable = conversation.inquiriable;
    let inquiriableData = null;

    if (inquiriable) {
      const rawType = String(inquiriable.type_label ?? conversation.inquiriable_type ?? 'Listing');
      let typeLabel = 'Listing';
      let vertical = 'products';

      if (rawType.includes('Property')) {
        typeLabel = 'Property';
        vertical = 'properties';
      } else if (rawType.includes('Auto') || rawType.includes('Vehicle')) {
        typeLabel = 'Auto';
        vertical = 'autos';
      } else if (rawType.includes('Event')) {
        typeLabel = 'Event';
        vertical = 'events';
      } else if (rawType.includes('Service')) {
        typeLabel = 'Service';
        vertical = 'services';
      } else if (rawType.includes('Job')) {
        typeLabel = 'JobListing';
        vertical = 'joblistings';
      } else if (rawType.includes('Classified')) {
        typeLabel = 'Classified';
        vertical = 'classifieds';
      } else if (rawType.includes('Product')) {
        typeLabel = 'Product';
        vertical = 'products';
      }

      let price = '—';
      if (inquiriable.pricing?.price_formatted) {
        price = inquiriable.pricing.price_formatted;
      } else if (inquiriable.pricing?.formatted) {
        price = inquiriable.pricing.formatted;
      } else if (inquiriable.base_price) {
        price = `$${Number(inquiriable.base_price).toLocaleString()}`;
      } else if (inquiriable.salary_formatted) {
        price = inquiriable.salary_formatted;
      } else if (inquiriable.price_formatted) {
        price = inquiriable.price_formatted;
      }

      let image = null;
      const media = inquiriable.media ?? [];
      if (inquiriable.featured_image) {
        image = inquiriable.featured_image;
      } else if (Array.isArray(media) && media.length > 0) {
        image = media[0]?.original_url ?? media[0]?.url ?? null;
      }

      inquiriableData = {
        id: Number(inquiriable.id ?? 0),
        title: typeof inquiriable.title === 'string' ? inquiriable.title : (typeof inquiriable.name === 'string' ? inquiriable.name : 'Untitled Listing'),
        slug: typeof inquiriable.slug === 'string' ? inquiriable.slug : '',
        type: typeLabel,
        price,
        image,
        details: inquiriable.short_description ?? inquiriable.description ?? '',
        viewUrl: storefrontListingUrl(inquiriable.slug || inquiriable.id, vertical),
      };
    }

    return {
      id: conversation.id,
      name: participant.name || `Conversation #${conversation.id}`,
      avatar: participant.avatar_url || participant.avatar,
      lastMessage: conversation.last_message?.body || conversation.lastMessage?.body || conversation.last_message?.content || conversation.lastMessage?.content || '',
      time: conversation.updated_at,
      unread: conversation.unread_count || 0,
      inquiriable: inquiriableData,
    };
  });
};

export const sendMessage = async (content: string, receiverId: number) => {
  const payload = await apiRequest<any>(buyerUrl(`/messages/${receiverId}`), {
    method: 'POST',
    authenticated: true,
    body: JSON.stringify({ body: content }),
  });

  const message = payload?.message || payload;

  return message?.id ? toMessage(message) : {
    id: Date.now(),
    conversation_id: receiverId,
    sender_id: undefined,
    receiver_id: undefined,
    content: message?.body || content,
    created_at: message?.created_at || new Date().toISOString(),
  };
};
