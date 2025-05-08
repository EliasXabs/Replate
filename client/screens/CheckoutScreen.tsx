/* -------------------------------------------------------------------------- */
/*  CheckoutScreen.tsx                                                        */
/* -------------------------------------------------------------------------- */
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  Platform,
} from 'react-native';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavBar from '../components/BottomNavBar';

import { useCart, CartItem } from '../context/CartContext';
import type { RootStackParamList } from '../App';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Checkout'>;

/* -------------------------------------------------------------------------- */
/*  Colours & Sizes                                                           */
/* -------------------------------------------------------------------------- */
const GREEN = '#2E8B57';
const BG_COLOR = '#fdf8ef';
const CARD_BG = '#e9f7f2';

/* -------------------------------------------------------------------------- */
export default function CheckoutScreen({ navigation }: { navigation: NavigationProp }) {
  const { items, clearCart } = useCart();

  /* ------------------------------------------------------------------ */
  /*  Place-order helper                                                */
  /* ------------------------------------------------------------------ */
  async function placeOrder(orderItems: CartItem[], nav: NavigationProp) {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        alert('Please log in');
        return;
      }

      const businessId = Number(orderItems[0].restaurantId);
      const payload = {
        businessId,
        items: orderItems.map((i) => ({
          menuItemId: Number(i.id),
          quantity: i.qty,
        })),
      };

      const res = await fetch('http://localhost:5000/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Order failed');
        return;
      }

      clearCart(); // 🧹 empty cart
      nav.replace('OrderStatus', { id: data.id.toString() });
    } catch (err) {
      console.error('Place-order error:', err);
      alert('Network or server error');
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Address picker state                                              */
  /* ------------------------------------------------------------------ */
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [displayAddress, setDisplayAddress] = useState(
    'Tap “Change” to set address'
  );

  /* ask permission (native only) */
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        await Location.requestForegroundPermissionsAsync().catch(() => {});
      }
    })();
  }, []);

  const handleAddressSelect = () => {
    setDisplayAddress('Custom address picked');
    setAddressModalVisible(false);
  };

  /* ------------------------------------------------------------------ */
  /*  Pricing                                                           */
  /* ------------------------------------------------------------------ */
  const subtotal = items.reduce((t, it) => t + it.price * it.qty, 0);
  const delivery = 3;
  const total = subtotal + delivery;

  /* ------------------------------------------------------------------ */
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* header */}
        <View style={styles.header}>
          <FontAwesome name="user-circle-o" size={32} color={GREEN} />
          <FontAwesome name="search" size={24} color={GREEN} />
        </View>

        {/* cart items */}
        {items.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <Image source={item.image} style={styles.itemImage} />
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.restaurantName}</Text>
              <Text style={styles.dishName}>{item.name}</Text>
              {item.description && <Text style={styles.dishDesc}>{item.description}</Text>}
              <Text style={styles.dishPrice}>{(item.price * item.qty).toFixed(2)} $</Text>
            </View>
          </View>
        ))}

        {/* subtotal */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryText}>TOTAL</Text>
          <Text style={styles.summaryText}>{subtotal.toFixed(2)} $</Text>
        </View>

        {/* address & payment */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionHeader}>Address</Text>
          <View style={styles.row}>
            <MaterialIcons name="home" size={24} color="#000" />
            <Text style={styles.addressText}>{displayAddress}</Text>
            <TouchableOpacity onPress={() => setAddressModalVisible(true)}>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.sectionHeader, { marginTop: 16 }]}>Payment Method</Text>
          <View style={styles.row}>
            <MaterialIcons name="check-box" size={24} color="#000" />
            <Text style={styles.addressText}>Cash on delivery</Text>
          </View>
        </View>

        {/* delivery + total */}
        <View style={styles.deliveryCard}>
          <Text style={styles.summaryText}>Delivery {delivery.toFixed(2)} $</Text>
          <Text style={[styles.summaryText, { fontWeight: '700' }]}>TOTAL</Text>
          <Text style={[styles.summaryText, { fontWeight: '700' }]}>{total.toFixed(2)} $</Text>
        </View>

        {/* place order */}
        <TouchableOpacity
          style={styles.orderBtn}
          onPress={() => placeOrder(items, navigation)}
        >
          <Text style={styles.orderBtnText}>Place Order</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* address modal (placeholder) */}
      <Modal
        transparent
        animationType="slide"
        visible={addressModalVisible}
        onRequestClose={() => setAddressModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pick Address</Text>
              <TouchableOpacity onPress={() => setAddressModalVisible(false)}>
                <Ionicons name="close" size={28} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.mapPlaceholder}>
              <Text>Map comes here (native) / Not available on Web</Text>
            </View>

            <TouchableOpacity style={styles.selectBtn} onPress={handleAddressSelect}>
              <Text style={styles.selectBtnText}>Confirm Address</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <BottomNavBar navigation={navigation} />
    </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */
/*  Styles                                                                    */
/* -------------------------------------------------------------------------- */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BG_COLOR },
  container: { flex: 1, paddingHorizontal: 16 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },

  /* cart item */
  itemCard: {
    flexDirection: 'row',
    backgroundColor: CARD_BG,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  itemImage: { width: 80, height: 80, borderRadius: 40, marginRight: 12 },
  itemName: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  dishName: { fontSize: 16, fontWeight: '600' },
  dishDesc: { fontSize: 14, color: '#555' },
  dishPrice: { fontSize: 16, fontWeight: 'bold', marginTop: 8 },

  summaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  summaryText: { fontSize: 16 },

  detailsCard: {
    backgroundColor: CARD_BG,
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
  },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center' },
  addressText: { fontSize: 16, marginLeft: 8, flex: 1 },
  changeText: { color: 'blue' },

  deliveryCard: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#ddd',
    marginVertical: 8,
  },

  orderBtn: {
    backgroundColor: GREEN,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  orderBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  /* modal */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    paddingBottom: 32,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  mapPlaceholder: {
    height: 220,
    borderRadius: 12,
    backgroundColor: '#dadada',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  selectBtn: {
    backgroundColor: GREEN,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  selectBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
