/* -------------------------------------------------------------------------- */
/*  FoodListingScreen.tsx                                                     */
/* -------------------------------------------------------------------------- */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import BottomNavBar from '../components/BottomNavBar';
import { useCart } from '../context/CartContext';
import type { RootStackParamList } from '../App';

/* ---------- nav helpers ---------- */
type NavigationProp = StackNavigationProp<RootStackParamList, 'FoodListing'>;
type RouteProp = { params: { id: string } };

/* ---------- data models ---------- */
interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image: { uri: string };
}

interface Restaurant {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  categories: string[];
  dishes: Dish[];
}

/* ---------- constants ---------- */
const GREEN = '#2E8B57';
const BEIGE = '#fdf8ef';
const CHIP_BG = '#c4f1c4';
const IMAGE_SIZE = 80;

export default function FoodListingScreen({
  navigation,
  route,
}: {
  navigation: NavigationProp;
  route: RouteProp;
}) {
  const { addOrInc, dec, items } = useCart();
  const { id } = route.params;

  const [data, setData] = useState<Restaurant | null>(null);
  const [activeCat, setCat] = useState<string>('All');

  useEffect(() => {
    const loadRestaurant = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) return;
  
        const restRes = await fetch(
          `http://localhost:5000/api/restaurants/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const restJson = await restRes.json();
        const restaurant = restJson.restaurant;
        
        const name = restaurant.business_name;
        const address = restaurant.address;
        const phone = restaurant.phone_number;
        
  
        const menuRes = await fetch(`http://localhost:5000/api/menu/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const menuJson = await menuRes.json();
  
        const dishes: Dish[] = (menuJson as any[]).map((item) => ({
          id: item.id.toString(),
          name: item.name,
          description: item.description,
          price: parseFloat(item.price),
          image: { uri: item.image_url },
        }));
  
        const categories = ['All', ...new Set(dishes.map((d) => d.name))];
  
        setData({
          id,
          name,
          address,
          phone,
          categories,
          dishes,
        });
      } catch (err) {
        console.error('Failed to load restaurant:', err);
      }
    };
  
    loadRestaurant();
  }, [id]);

  if (!data) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={{ marginTop: 40, textAlign: 'center' }}>Loading…</Text>
      </SafeAreaView>
    );
  }

  // filter dishes by active category (simple name match, since no explicit category field)
  const dishes =
    activeCat === 'All'
      ? data.dishes
      : data.dishes.filter((d) =>
          d.name.toLowerCase().includes(activeCat.toLowerCase())
        );

  const renderDish = ({ item }: { item: Dish }) => {
    const qty = items.find((i) => i.id === item.id)?.qty ?? 0;
    return (
      <View style={styles.dishCard}>
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
            <Text style={styles.dishPrice}>{item.price.toFixed(2)} $</Text>
          </View>
        </TouchableOpacity>

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

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 120 }}>
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
  
        {/* restaurant details */}
        <View style={styles.detailsContainer}>
          {data.address && (
            <Text style={styles.detailsText}>📍 {data.address}</Text>
          )}
          {data.phone && (
            <Text style={styles.detailsText}>📞 {data.phone}</Text>
          )}
        </View>
  
        {/* category chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipBar}>
          {data.categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, activeCat === cat && styles.chipActive]}
              onPress={() => setCat(cat)}
            >
              <Text style={{ color: '#000' }}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
  
        {/* dishes list */}
        <FlatList
          data={dishes}
          keyExtractor={(d) => d.id}
          renderItem={renderDish}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          contentContainerStyle={{ paddingBottom: 14 }}
        />
      </ScrollView>
  
      {/* View Cart button */}
      {items.length > 0 && (
        <TouchableOpacity
          style={styles.cartButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.cartButtonText}>
            View Cart ({items.reduce((total, item) => total + item.qty, 0)})
          </Text>
        </TouchableOpacity>
      )}

  
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
  detailsContainer: {
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  detailsText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  cartButton: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    right: 16,
    backgroundColor: GREEN,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  cartButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  
});
