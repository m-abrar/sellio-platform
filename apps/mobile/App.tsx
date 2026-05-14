import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, SafeAreaView } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>SELLIO</Text>
          <TouchableOpacity style={styles.cartButton}>
            <Text style={{ fontSize: 20 }}>🛒</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>New Season</Text>
            <Text style={styles.heroSubtitle}>Explore the latest trends</Text>
            <TouchableOpacity style={styles.shopBtn}>
              <Text style={styles.shopBtnText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Featured Products</Text>
        <View style={styles.productGrid}>
          {[1, 2, 3, 4].map((i) => (
            <View key={i} style={styles.productCard}>
              <View style={styles.productImagePlaceholder}>
                <Text style={{ color: '#666' }}>IMG</Text>
              </View>
              <Text style={styles.productName}>Product {i}</Text>
              <Text style={styles.productPrice}>$49.99</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
  },
  cartButton: {
    backgroundColor: '#1a1a1a',
    padding: 10,
    borderRadius: 12,
  },
  heroCard: {
    height: 200,
    backgroundColor: '#6366f1',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 30,
  },
  heroOverlay: {
    flex: 1,
    padding: 25,
    justifyContent: 'center',
  },
  heroTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    marginBottom: 15,
  },
  shopBtn: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 99,
    alignSelf: 'flex-start',
  },
  shopBtnText: {
    fontWeight: '700',
    fontSize: 14,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '47%',
    marginBottom: 20,
  },
  productImagePlaceholder: {
    height: 160,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  productName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  productPrice: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
});
