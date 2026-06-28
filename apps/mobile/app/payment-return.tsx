import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { apiRequest } from '../src/api/client';
import { AuthenticatedScreen } from '../src/auth/AuthenticatedScreen';
import { LoadingState } from '../src/components/states/AsyncStates';

interface OrderStatus {
  order_number: string;
  status: string;
  payment_status: string;
}

export default function PaymentReturnView() {
  const router = useRouter();
  const params = useLocalSearchParams<{ status?: string; order?: string }>();
  const order = Array.isArray(params.order) ? params.order[0] : params.order;
  const returnedStatus = Array.isArray(params.status) ? params.status[0] : params.status;
  const [verified, setVerified] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(Boolean(order));
  const [message, setMessage] = useState('Verifying the payment result...');

  useEffect(() => {
    if (!order) {
      setLoading(false);
      setMessage('No order reference was included in this payment return.');
      return;
    }
    apiRequest<OrderStatus>(`/v1/orders/${encodeURIComponent(order)}`, { authenticated: true })
      .then((result) => {
        setVerified(result);
        setMessage(result.payment_status === 'paid'
          ? 'Payment is verified and your order is being processed.'
          : `Your order is ${result.status} and payment is ${result.payment_status}.`);
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : 'Could not verify this payment return.'))
      .finally(() => setLoading(false));
  }, [order]);

  return (
    <AuthenticatedScreen returnTo="/activity">
      <SafeAreaView style={styles.container}>
        {loading ? <LoadingState message="Verifying payment..." fullScreen /> : (
          <View style={styles.card}>
            <Text style={styles.eyebrow}>PAYMENT RETURN</Text>
            <Text style={styles.title}>{verified?.payment_status === 'paid' ? 'PAYMENT VERIFIED.' : 'ORDER STATUS.'}</Text>
            <Text style={styles.message}>{message}</Text>
            <Text style={styles.reference}>ORDER {verified?.order_number || order || 'UNAVAILABLE'}</Text>
            {returnedStatus && <Text style={styles.returned}>GATEWAY RETURN: {returnedStatus.toUpperCase()}</Text>}
            <TouchableOpacity style={styles.button} onPress={() => router.replace('/activity')}>
              <Text style={styles.buttonText}>OPEN BUYER ACTIVITY</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </AuthenticatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 22, backgroundColor: '#070708' },
  card: { padding: 24, borderRadius: 26, borderWidth: 1, borderColor: 'rgba(129,140,248,0.25)', backgroundColor: '#121214' },
  eyebrow: { color: '#818cf8', fontSize: 8, fontWeight: '900', letterSpacing: 1.4, marginBottom: 6 },
  title: { color: '#fff', fontSize: 24, fontWeight: '900', letterSpacing: 1, marginBottom: 14 },
  message: { color: '#cbd5e1', fontSize: 12, lineHeight: 19, marginBottom: 18 },
  reference: { color: '#94a3b8', fontSize: 9, fontWeight: '900', letterSpacing: 1, marginBottom: 5 },
  returned: { color: '#475569', fontSize: 8, fontWeight: '800', letterSpacing: 0.7, marginBottom: 22 },
  button: { minHeight: 52, alignItems: 'center', justifyContent: 'center', borderRadius: 17, backgroundColor: '#6366f1' },
  buttonText: { color: '#fff', fontSize: 9, fontWeight: '900', letterSpacing: 1.1 },
});
