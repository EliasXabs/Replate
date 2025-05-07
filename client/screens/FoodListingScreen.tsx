/* -------------------------------------------------------------------------- */
/*  FoodListingScreen.tsx                                                     */
/* -------------------------------------------------------------------------- */
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FontAwesome, Entypo } from '@expo/vector-icons';

import BottomNavBar from '../components/BottomNavBar';
import { useCart }  from '../context/CartContext';
import type { RootStackParamList } from '../App';

/* ---------- nav helpers ---------- */
type NavigationProp = StackNavigationProp<RootStackParamList, 'FoodListing'>;
type RouteProp      = { params: { id: string } };

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image: any;
}

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  eta: string;
  categories: string[];
  dishes: Dish[];
}

/* ---------- constants ---------- */
const GREEN   = '#2E8B57';
const BEIGE   = '#fdf8ef';
const CHIP_BG = '#c4f1c4';
const IMAGE_SIZE = 80;

/* -------------------------------------------------------------------------- */
export default function FoodListingScreen({
  navigation,
  route,
}: {
  navigation: NavigationProp;
  route: RouteProp;
}) {
  const { addOrInc, dec, items } = useCart();           // 🛒 shared cart
  const { id } = route.params;
  const [data, setData]     = useState<Restaurant | null>(null);
  const [activeCat, setCat] = useState<string>('All');

  /* stub fetch ----------------------------------------------------------- */
  useEffect(() => {
    (async () => {
      await new Promise(r => setTimeout(r, 200));
      setData({
        id,
        name: 'Pasta Villa',
        cuisine: 'Italian',
        eta: '30‑40 min',
        categories: ['All', 'Starters', 'Salads', 'Desserts'],
        dishes: [
          {
            id: 'dish1',
            name: 'Spaghetti Bolognese',
            description: 'Tomato sauce, ground beef',
            price: 12.2,
            image: require('../assets/pasta.jpg'),
          },
          {
            id: 'dish2',
            name: 'Bruschetta Trio',
            description: 'Tomato, basil, garlic',
            price: 6.5,
            image: require('../assets/pasta.jpg'),
          },
        ],
      });
    })();
  }, [id]);

  if (!data) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={{ marginTop: 40, textAlign: 'center' }}>Loading…</Text>
      </SafeAreaView>
    );
  }

  const dishes =
    activeCat === 'All'
      ? data.dishes
      : data.dishes.filter(d =>
          d.name.toLowerCase().includes(activeCat.toLowerCase()),
        );

  /* ---------- render dish row ---------- */
  const renderDish = ({ item }: { item: Dish }) => {
    const qty = items.find(i => i.id === item.id)?.qty ?? 0;

    return (
      <View style={styles.dishCard}>
        {/* tappable area */}
        <TouchableOpacity
          style={{ flexDirection: 'row', flex: 1 }}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('FoodDetail', { id: item.id })}
        >
          <Image source={item.image} style={styles.dishImg} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.dishName}>{item.name}</Text>
            <Text style={styles.dishDesc} numberOfLines={2}>
              {item.description}
            </Text>
            <Text style={styles.dishPrice}>{item.price.toFixed(2)} $</Text>
          </View>
        </TouchableOpacity>

        {/* qty buttons */}
        <View style={styles.qtyCol}>
          <TouchableOpacity onPress={() => dec(item.id)}>
            <FontAwesome name="minus" size={18} color="#000" />
          </TouchableOpacity>
          <View style={styles.qtyBadge}>
            <Text style={styles.qtyText}>{qty}</Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              addOrInc({
                id: item.id,
                name: item.name,
                restaurantId: data.id,
                restaurantName: data.name,
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
  };

  /* ------------------------------------------------------------------ */
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 90 }}>
        {/* header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Entypo name="chevron-left" size={28} color={GREEN} />
          </TouchableOpacity>

          <Text style={styles.title}>{data.name}</Text>

          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <FontAwesome name="search" size={24} color={GREEN} />
          </TouchableOpacity>
        </View>

        {/* tags */}
        <View style={styles.tagRow}>
          <Text style={styles.tagText}>{data.cuisine}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.tagText}>{data.eta}</Text>
        </View>

        {/* category chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipBar}>
          {data.categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, activeCat === cat && styles.chipActive]}
              onPress={() => setCat(cat)}
            >
              <Text style={{ color: '#000' }}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* dish list */}
        <FlatList
          data={dishes}
          keyExtractor={d => d.id}
          renderItem={renderDish}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          contentContainerStyle={{ paddingBottom: 14 }}
        />
      </ScrollView>

      <BottomNavBar navigation={navigation} />
    </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   styles                                   */
/* -------------------------------------------------------------------------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BEIGE },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  title: { fontSize: 24, fontStyle: 'italic', fontWeight: '700' },

  tagRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 6 },
  tagText: { fontSize: 14, color: '#333' },
  dot: { marginHorizontal: 6, fontSize: 14 },

  chipBar: { paddingHorizontal: 16, marginBottom: 12 },
  chip: {
    backgroundColor: CHIP_BG,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 6,
    marginRight: 12,
  },
  chipActive: { backgroundColor: '#9fed9f' },

  dishCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 10,
  },
  dishImg: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 10,
    backgroundColor: '#ccc',
  },
  dishName: { fontSize: 16, fontWeight: '600' },
  dishDesc: { fontSize: 12, color: '#555' },
  dishPrice: { fontSize: 14, fontWeight: '600', marginTop: 2 },

  qtyCol: { alignItems: 'center', marginLeft: 8 },
  qtyBadge: {
    backgroundColor: '#9fed9f',
    borderRadius: 12,
    width: 28,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  qtyText: { fontWeight: '700' },
});
