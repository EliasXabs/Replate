import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FontAwesome } from '@expo/vector-icons';

import BottomNavBar from '../components/BottomNavBar';
import { useCart } from '../context/CartContext';
import type { RootStackParamList } from '../App';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Cart'>;

const GREEN = '#2E8B57';
const BEIGE = '#fdf8ef';

export default function CartScreen({ navigation }: { navigation: NavigationProp }) {
  const { items, addOrInc, dec, total, clear } = useCart();

  const renderItem = ({ item }: any) => (
    <View style={styles.row}>
      <Image source={item.image} style={styles.img} />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{(item.price * item.qty).toFixed(2)} $</Text>
      </View>

      {/* qty controls */}
      <View style={styles.qtyCol}>
        <TouchableOpacity onPress={() => dec(item.id)}>
          <FontAwesome name="minus" size={18} color="#000" />
        </TouchableOpacity>
        <Text style={styles.qty}>{item.qty}</Text>
        <TouchableOpacity
          onPress={() =>
            addOrInc({
              id: item.id,
              name: item.name,
              restaurantId: item.restaurantId,
              restaurantName: item.restaurantName,
              price: item.price,
              image: item.image,
            })
          }
        >
          <FontAwesome name="plus" size={18} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {items.length === 0 ? (
        <Text style={{ marginTop: 40, textAlign: 'center' }}>Your cart is empty</Text>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={i => i.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          />

          {/* total + checkout */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL</Text>
            <Text style={styles.totalNum}>{total.toFixed(2)} $</Text>
          </View>

          <TouchableOpacity style={styles.checkoutBtn} onPress={() => {}}>
            <Text style={styles.checkoutText}>Go to checkout</Text>
          </TouchableOpacity>
        </>
      )}

      <BottomNavBar navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BEIGE },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef4f0',
    borderRadius: 12,
    padding: 10,
  },
  img: { width: 60, height: 60, borderRadius: 10, marginRight: 10 },
  name: { fontSize: 16, fontWeight: '600' },
  price: { fontSize: 14, marginTop: 2 },

  qtyCol: { flexDirection: 'row', alignItems: 'center' },
  qty: { marginHorizontal: 8, fontWeight: '600' },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#eef4f0',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 12,
  },
  totalLabel: { fontWeight: '700' },
  totalNum: { fontWeight: '700' },

  checkoutBtn: {
    backgroundColor: GREEN,
    borderRadius: 10,
    paddingVertical: 14,
    margin: 16,
    alignItems: 'center',
  },
  checkoutText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
