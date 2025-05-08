import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';

import BottomNavBar from '../components/BottomNavBar';
import type { RootStackParamList } from '../App';

type NavigationProp = StackNavigationProp<RootStackParamList>;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const NAV_BAR_HEIGHT = 60;
const SLIDER_HEIGHT = 180;

const COLORS = {
  green: '#2E8B57',
  beige: '#fdf8ef',
  orange: '#ff8c00',
};

export default function HomeScreen({ navigation }: { navigation: NavigationProp }) {
  const [points, setPoints] = useState(0);
  const [recommended, setRecommended] = useState<
    { id: number; name: string; images: string[] }[]
  >([]);

  // Debug state
  const [viewHeight, setViewHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const scrollable = contentHeight > viewHeight;

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return;

      try {
        // Fetch points
        const pRes = await fetch('http://localhost:5000/api/points', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const pJson = await pRes.json();
        if (pRes.ok && typeof pJson.points === 'number') {
          setPoints(pJson.points);
        }

        // Fetch recommended restaurants
        const rRes = await fetch('http://localhost:5000/api/restaurants', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { restaurants } = await rRes.json();
        const details = await Promise.all(
          restaurants.map(async (r: any) => {
            const mRes = await fetch(`http://localhost:5000/api/menu/${r.id}`);
            const items = await mRes.json();
            return {
              id: r.id,
              name: r.business_name,
              images: items.map((i: any) => i.image_url).filter(Boolean),
            };
          })
        );
        setRecommended(details);
      } catch (err) {
        console.warn(err);
      }
    })();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.main}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator
          onLayout={e => setViewHeight(e.nativeEvent.layout.height)}
          onContentSizeChange={(_w, h) => setContentHeight(h)}
        >
          {/* HEADER */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.navigate('Account')}>
              <FontAwesome name="user-circle-o" size={28} color={COLORS.green} />
            </TouchableOpacity>
            <View style={styles.pointsWrapper}>
              <View style={styles.pointsCircle}>
                <Text style={styles.pointsText}>{points}</Text>
                <Text style={styles.brandText}>RePlate</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
              <FontAwesome name="search" size={28} color={COLORS.green} />
            </TouchableOpacity>
          </View>

          {/* CTA BUTTON */}
          <TouchableOpacity
            style={styles.newBtn}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('NewOnReplate')}
          >
            <Text style={styles.newBtnText}>New on RePlate</Text>
            <Ionicons name="arrow-forward" size={24} color="#fff" />
          </TouchableOpacity>

          {/* SECTION TITLE */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Just for YOU!</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('RestaurantList', { category: 'Recommended' })
              }
            >
              <Text style={styles.showAll}>Show All</Text>
            </TouchableOpacity>
          </View>

          {/* RECOMMENDATIONS */}
          {recommended.map(rest => (
            <View key={rest.id} style={styles.recCard}>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recScrollContent}
              >
                {rest.images.map((uri, idx) => (
                  <Image key={idx} source={{ uri }} style={styles.recImage} />
                ))}
              </ScrollView>
              <Text style={styles.restaurantName}>{rest.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* OVERLAYED NAV BAR */}
      <View style={styles.navOverlay} pointerEvents="box-none">
        <View style={styles.navWrapper}>
          <BottomNavBar navigation={navigation} />
        </View>
      </View>

      {/* DEBUG BADGE */}
      {__DEV__ && (
        <View style={styles.debugBadge}>
          <Text style={styles.debugText}>
            {scrollable ? 'Scrollable ✅' : 'Not scrollable ❌'}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    position: 'relative',
    backgroundColor: COLORS.beige,
  },
  main: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    overflow: 'scroll',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: NAV_BAR_HEIGHT + 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pointsWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  pointsCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: COLORS.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.orange,
  },
  brandText: {
    fontSize: 20,
    color: COLORS.green,
    fontStyle: 'italic',
  },
  newBtn: {
    backgroundColor: COLORS.green,
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  newBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  showAll: {
    fontSize: 14,
    color: '#007bff',
  },
  recCard: {
    marginBottom: 32,
  },
  recScrollContent: {
    paddingRight: 16,
  },
  recImage: {
    width: SCREEN_WIDTH - 48,
    height: SLIDER_HEIGHT,
    borderRadius: 10,
    marginRight: 12,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
    marginLeft: 4,
  },
  navOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: NAV_BAR_HEIGHT,
    backgroundColor: COLORS.beige,
    borderTopWidth: 1,
    borderColor: '#ddd',
    zIndex: 1000,
    elevation: 10,
    overflow: 'hidden',
  },
  navWrapper: {
    flex: 1,
    overflow: 'hidden',
  },
  debugBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  debugText: {
    color: '#fff',
    fontSize: 12,
  },
});
