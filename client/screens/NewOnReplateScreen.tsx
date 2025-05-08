import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavBar from '../components/BottomNavBar';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SLIDER_HEIGHT = 180;
const GREEN = '#2E8B57';
const BEIGE = '#fdf8ef';
const NAV_BAR_HEIGHT = 60;

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function NewOnReplateScreen({ navigation }: { navigation: NavigationProp }) {
  const [restaurants, setRestaurants] = useState<
    { id: number; name: string; createdAt: string; images: string[] }[]
  >([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) return;

        const res = await fetch('http://localhost:5000/api/restaurants', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { restaurants } = await res.json();

        // Sort by createdAt descending (newest first)
        const sorted = restaurants.sort(
          (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // Fetch menu images for each restaurant
        const enriched = await Promise.all(
          sorted.map(async (rest: any) => {
            const menuRes = await fetch(`http://localhost:5000/api/menu/${rest.id}`);
            const menuItems = await menuRes.json();

            return {
              id: rest.id,
              name: rest.business_name,
              createdAt: rest.createdAt,
              images: menuItems.map((item: any) => item.image_url).filter(Boolean),
            };
          })
        );

        setRestaurants(enriched);
      } catch (err) {
        console.error('Error fetching restaurants:', err);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <View style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome name="arrow-left" size={28} color={GREEN} />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>New on Replate</Text>
          <View style={{ width: 28 }} />
        </View>

        {restaurants.length === 0 ? (
          <Text style={styles.emptyText}>No restaurants found.</Text>
        ) : (
          restaurants.map((rest) => (
            <View key={rest.id} style={{ marginBottom: 32 }}>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 16 }}
                style={{ width: SCREEN_WIDTH - 32, alignSelf: 'center' }}
              >
                {rest.images.map((img, idx) => (
                  <Image
                    key={idx}
                    source={{ uri: img }}
                    style={{
                      width: SCREEN_WIDTH - 48,
                      height: SLIDER_HEIGHT,
                      borderRadius: 10,
                      marginRight: 12,
                    }}
                  />
                ))}
              </ScrollView>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  marginTop: 8,
                  marginLeft: 4,
                }}
              >
                {rest.name}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      <BottomNavBar navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BEIGE,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: NAV_BAR_HEIGHT + 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: GREEN,
  },
  emptyText: {
    marginTop: 48,
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
});
