import { useFocusEffect, useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { apiRequest } from '../src/api/client';
import { AuthenticatedScreen } from '../src/auth/AuthenticatedScreen';
import { EmptyState, ErrorState, LoadingState } from '../src/components/states/AsyncStates';

WebBrowser.maybeCompleteAuthSession();

interface CartItem {
  id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  product?: { id: number; title: string; slug: string; image?: string | null } | null;
}

interface CartPayload {
  id: number;
  items: CartItem[];
  total: number;
  item_count: number;
  currency_symbol: string;
}

export default function CartView() {
  const router = useRouter();
  const [cart, setCart] = useState<CartPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [pendingItemId, setPendingItemId] = useState<number | null>(null);
  const [openingCheckout, setOpeningCheckout] = useState(false);

  const loadCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCart(await apiRequest<CartPayload>('/v1/cart', { authenticated: true }));
    } catch (requestError) {
      setError(requestError);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { loadCart(); }, [loadCart]));

  const mutateItem = async (item: CartItem, quantity: number) => {
    setPendingItemId(item.id);
    try {
      setCart(await apiRequest<CartPayload>(`/v1/cart/${item.id}`, {
        method: quantity > 0 ? 'PATCH' : 'DELETE',
        authenticated: true,
        body: quantity > 0 ? JSON.stringify({ quantity }) : undefined,
      }));
    } catch (requestError) {
      Alert.alert('Could not update cart', requestError instanceof Error ? requestError.message : 'Please try again.');
    } finally {
      setPendingItemId(null);
    }
  };

  const openCheckout = async () => {
    setOpeningCheckout(true);
    try {
      const handoff = await apiRequest<{ url: string }>('/v1/checkout/handoff', {
        method: 'POST',
        authenticated: true,
      });
      const returnUrl = Linking.createURL('/payment-return');
      const result = await WebBrowser.openAuthSessionAsync(handoff.url, returnUrl);
      if (result.type === 'success' && result.url) {
        const parsed = Linking.parse(result.url);
        const status = String(parsed.queryParams?.status || 'unknown');
        const order = String(parsed.queryParams?.order || '');
        Alert.alert(
          status === 'successful' ? 'Payment complete' : 'Order pending',
          order ? `Order ${order} is ${status}.` : `Checkout returned with status: ${status}.`,
        );
        await loadCart();
      } else if (result.type === 'cancel' || result.type === 'dismiss') {
        Alert.alert('Checkout closed', 'No payment status changed in the mobile app. You can reopen checkout when ready.');
      }
    } catch (requestError) {
      Alert.alert('Could not open checkout', requestError instanceof Error ? requestError.message : 'Please try again.');
    } finally {
      setOpeningCheckout(false);
    }
  };

  return (
    <AuthenticatedScreen returnTo="/activity">
      <SafeAreaView style={styles.container}>
        <FlatList
          data={cart?.items || []}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.content}
          ListHeaderComponent={(
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Back"><Text style={styles.backText}>{'< BACK'}</Text></TouchableOpacity>
              <Text style={styles.eyebrow}>PRODUCT CHECKOUT</Text>
              <Text style={styles.title}>YOUR CART.</Text>
            </View>
          )}
          ListEmptyComponent={loading ? <LoadingState message="Loading your cart..." /> : error ? (
            <ErrorState error={error} onRetry={loadCart} />
          ) : <EmptyState icon="CT" title="YOUR CART IS EMPTY" message="Add products from the marketplace to begin checkout." action={{ label: 'BROWSE PRODUCTS', onPress: () => router.push('/') }} />}
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
              <View style={styles.imageFrame}>
                {item.product?.image ? <Image source={{ uri: item.product.image }} style={styles.image} /> : <Text style={styles.imageFallback}>PR</Text>}
              </View>
              <View style={styles.itemBody}>
                <Text style={styles.itemTitle}>{item.product?.title || 'Product'}</Text>
                <Text style={styles.itemPrice}>{cart?.currency_symbol || '$'}{item.total_price.toFixed(2)}</Text>
                <View style={styles.quantityRow}>
                  <TouchableOpacity style={styles.quantityButton} onPress={() => mutateItem(item, item.quantity - 1)} disabled={pendingItemId === item.id} accessibilityRole="button" accessibilityLabel={`Decrease ${item.product?.title || 'product'} quantity`}><Text style={styles.quantityText}>-</Text></TouchableOpacity>
                  <Text style={styles.quantityValue}>{item.quantity}</Text>
                  <TouchableOpacity style={styles.quantityButton} onPress={() => mutateItem(item, item.quantity + 1)} disabled={pendingItemId === item.id} accessibilityRole="button" accessibilityLabel={`Increase ${item.product?.title || 'product'} quantity`}><Text style={styles.quantityText}>+</Text></TouchableOpacity>
                  <TouchableOpacity onPress={() => mutateItem(item, 0)} disabled={pendingItemId === item.id} accessibilityRole="button" accessibilityLabel={`Remove ${item.product?.title || 'product'} from cart`}><Text style={styles.removeText}>REMOVE</Text></TouchableOpacity>
                </View>
              </View>
              {pendingItemId === item.id && <ActivityIndicator color="#818cf8" />}
            </View>
          )}
          ListFooterComponent={cart && cart.items.length > 0 ? (
            <View style={styles.summary}>
              <View style={styles.totalRow}><Text style={styles.totalLabel}>TOTAL</Text><Text style={styles.total}>{cart.currency_symbol}{cart.total.toFixed(2)}</Text></View>
              <Text style={styles.checkoutHelp}>Stripe and PayPal checkout opens in Sellio's secure browser flow and returns here after payment.</Text>
              <TouchableOpacity style={styles.checkoutButton} onPress={openCheckout} disabled={openingCheckout} accessibilityRole="button" accessibilityLabel="Open secure checkout">
                {openingCheckout && <ActivityIndicator size="small" color="#fff" />}
                <Text style={styles.checkoutText}>{openingCheckout ? 'OPENING CHECKOUT...' : 'SECURE CHECKOUT'}</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        />
      </SafeAreaView>
    </AuthenticatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070708' },
  content: { flexGrow: 1, padding: 20, paddingBottom: 44, gap: 12 },
  header: { marginBottom: 14 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 8, paddingRight: 12, marginBottom: 18 },
  backText: { color: '#a5b4fc', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  eyebrow: { color: '#64748b', fontSize: 9, fontWeight: '900', letterSpacing: 2 },
  title: { color: '#fff', fontSize: 26, fontWeight: '900', letterSpacing: 1.4 },
  itemCard: { minHeight: 112, flexDirection: 'row', alignItems: 'center', gap: 13, padding: 14, borderRadius: 22, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', backgroundColor: '#121214' },
  imageFrame: { width: 76, height: 82, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', borderRadius: 17, backgroundColor: '#0b0b0c' },
  image: { width: '100%', height: '100%' },
  imageFallback: { color: '#818cf8', fontSize: 14, fontWeight: '900' },
  itemBody: { flex: 1 },
  itemTitle: { color: '#fff', fontSize: 12, fontWeight: '900', marginBottom: 5 },
  itemPrice: { color: '#a5b4fc', fontSize: 12, fontWeight: '900', marginBottom: 12 },
  quantityRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  quantityButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: '#1b1b1e' },
  quantityText: { color: '#fff', fontSize: 16, fontWeight: '900' },
  quantityValue: { minWidth: 20, color: '#fff', fontSize: 11, fontWeight: '900', textAlign: 'center' },
  removeText: { color: '#f87171', fontSize: 7, fontWeight: '900', letterSpacing: 0.7, marginLeft: 5 },
  summary: { marginTop: 16, padding: 20, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(129,140,248,0.2)', backgroundColor: '#111018' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  totalLabel: { color: '#64748b', fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  total: { color: '#fff', fontSize: 20, fontWeight: '900' },
  checkoutHelp: { color: '#64748b', fontSize: 9, lineHeight: 14, marginBottom: 16 },
  checkoutButton: { minHeight: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, borderRadius: 18, backgroundColor: '#6366f1' },
  checkoutText: { color: '#fff', fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
});
