import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FontAwesome, Entypo } from '@expo/vector-icons';

import BottomNavBar from '../components/BottomNavBar';
import { useCart } from '../context/CartContext';
import type { RootStackParamList } from '../App';

type NavigationProp = StackNavigationProp<RootStackParamList, 'FoodDetail'>;
type RouteProp      = { params: { id: string } };

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image: any;
}

/* dummy fetch — replace later */
async function fetchDish(id: string): Promise<Dish> {
  await new Promise(r => setTimeout(r, 200));
  return {
    id,
    name: 'Burger Deluxe',
    description:
      'Prime beef, cheddar, lettuce, tomato, homemade bun. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    price: 6.6,
    image: require('../assets/burger.jpg'),
  };
}

const GREEN = '#2E8B57';
const BEIGE = '#fdf8ef';

export default function FoodDetailScreen({
  navigation,
  route,
}: {
  navigation: NavigationProp;
  route: RouteProp;
}) {
  const { addOrInc, dec, items } = useCart();        /* 🛒 */
  const { id } = route.params;
  const [dish, setDish] = useState<Dish | null>(null);

  useEffect(() => {
    fetchDish(id).then(setDish);
  }, [id]);

  if (!dish) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={{ marginTop: 40, textAlign: 'center' }}>Loading…</Text>
      </SafeAreaView>
    );
  }

  const qty = items.find(i => i.id === dish.id)?.qty ?? 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 80 }}>
        {/* top user/search row */}
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => navigation.navigate('Account')}>
            <FontAwesome name="user-circle-o" size={28} color={GREEN} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <FontAwesome name="search" size={26} color={GREEN} />
          </TouchableOpacity>
        </View>

        {/* back arrow & price pill */}
        <View style={styles.overlayRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.roundBtn}>
            <Entypo name="chevron-left" size={26} color="#fff" />
          </TouchableOpacity>

          <View style={styles.pricePill}>
            <Text style={styles.priceText}>{dish.price.toFixed(2)}$</Text>
          </View>
        </View>

        {/* hero image */}
        <Image source={dish.image} style={styles.heroImg} />

        {/* title & description */}
        <Text style={styles.name}>{dish.name}</Text>
        <Text style={styles.desc}>{dish.description}</Text>

        {/* qty controls */}
        <View style={styles.qtyRow}>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => dec(dish.id)}>
            <FontAwesome name="minus" size={18} color="#fff" />
          </TouchableOpacity>

          <View style={styles.qtyBadge}>
            <Text style={styles.qtyNum}>{qty}</Text>
          </View>

          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() =>
              addOrInc({
                id: dish.id,
                name: dish.name,
                restaurantId: 'rest‑1',          // supply real ids later
                restaurantName: 'Pasta Villa',
                price: dish.price,
                image: dish.image,
              })
            }
          >
            <FontAwesome name="plus" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNavBar navigation={navigation} />
    </SafeAreaView>
  );
}

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BEIGE },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 4,
    marginBottom: 12,
  },

  overlayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    marginBottom: 12,
  },
  roundBtn: {
    backgroundColor: GREEN,
    borderRadius: 22,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pricePill: {
    backgroundColor: GREEN,
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingVertical: 6,
    justifyContent: 'center',
  },
  priceText: { color: '#fff', fontWeight: '700' },

  heroImg: {
    width: '85%',
    height: 300,
    borderRadius: 16,
    alignSelf: 'center',
    backgroundColor: '#ccc',
  },

  name: { fontSize: 24, fontWeight: '700', marginTop: 12, marginHorizontal: 16 },
  desc: { fontSize: 14, color: '#444', marginHorizontal: 16, marginTop: 6 },

  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  qtyBtn: {
    backgroundColor: GREEN,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBadge: {
    marginHorizontal: 18,
    borderRadius: 18,
    backgroundColor: '#9fed9f',
    paddingHorizontal: 18,
    paddingVertical: 6,
    alignItems: 'center',
  },
  qtyNum: { fontSize: 16, fontWeight: '700' },
});
