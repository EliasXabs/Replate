import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Entypo } from '@expo/vector-icons';

import BottomNavBar from '../components/BottomNavBar';
import type { RootStackParamList } from '../App';

type NavigationProp = StackNavigationProp<RootStackParamList, 'RestaurantList'>;
type RouteProp      = { params: { category?: string } };

interface Restaurant {
  id: string;
  name: string;
  image: any;
  distance: string;
  rating: number;
}

/* ---------- constants ---------- */
const GREEN  = '#2E8B57';
const BEIGE  = '#fdf8ef';

/* -------------------------------------------------------------------------- */
export default function RestaurantListScreen({
  navigation,
  route,
}: {
  navigation: NavigationProp;
  route: RouteProp;
}) {
  const { category } = route.params ?? {};
  const [list, setList]   = useState<Restaurant[]>([]);
  const [loading, setLoad] = useState(true);

  /* stub fetch – replace later */
  useEffect(() => {
    (async () => {
      await new Promise(r => setTimeout(r, 300));
      setList(
        Array.from({ length: 8 }).map((_, i) => ({
          id: `rest-${i}`,
          name: `${category ?? 'All'} Restaurant #${i + 1}`,
          image: require('../assets/replate-logo.png'),
          distance: `${(Math.random() * 2 + 0.3).toFixed(1)} km`,
          rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
        }))
      );
      setLoad(false);
    })();
  }, [category]);

  /* ---------- render card ---------- */
  const renderItem = ({ item }: { item: Restaurant }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('FoodListing', { id: item.id })}
    >
      <Image source={item.image} style={styles.cardImg} />
      <View style={styles.cardInfo}>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardMeta}>
          {item.rating} ★ · {item.distance}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Entypo name="chevron-left" size={28} color={GREEN} />
        </TouchableOpacity>
        <Text style={styles.title}>{category ?? 'All Restaurants'}</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* list */}
      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color={GREEN} />
      ) : (
        <FlatList
          data={list}
          keyExtractor={r => r.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
          ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        />
      )}

      <BottomNavBar navigation={navigation} />
    </SafeAreaView>
  );
}

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  safe:  { flex: 1, backgroundColor: BEIGE },
  headerRow: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8,
  },
  title: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '600' },

  card:   { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden' },
  cardImg:{ width: 90, height: 90 },
  cardInfo:{ flex: 1, padding: 10, justifyContent: 'center' },
  cardName:{ fontSize: 16, fontWeight: '600' },
  cardMeta:{ color: '#555', marginTop: 4 },
});
