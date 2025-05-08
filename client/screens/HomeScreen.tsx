import React, { useRef, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

import BottomNavBar from '../components/BottomNavBar';           // shared bottom bar
import type { RootStackParamList } from '../App';               // 👈 shared nav type
import { Platform } from 'react-native';
/* -------------------------------------------------------------------------- */
/*                               Navigation                                   */
/* -------------------------------------------------------------------------- */
type NavigationProp = StackNavigationProp<RootStackParamList>;

/* -------------------------------------------------------------------------- */
/*                               Constants                                    */
/* -------------------------------------------------------------------------- */
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_HEIGHT   = 250;
const SLIDER_HEIGHT = 180;

const GREEN = '#2E8B57';
const BEIGE = '#fdf8ef';
const NAV_BAR_HEIGHT = 60;

/* -------------------------------------------------------------------------- */
/*                               Slider helpers                               */
/* -------------------------------------------------------------------------- */
interface SliderItem {
  id: string;
  image: any;
  target: keyof RootStackParamList;
  params?: Record<string, any>;
}
interface ImageSliderProps {
  data: SliderItem[];
  navigation: NavigationProp;
  imageHeight: number;
}
const ImageSlider: React.FC<ImageSliderProps> = ({
  data,
  navigation,
  imageHeight,
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setActiveIdx(Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH));

  return (
    <>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        directionalLockEnabled
      >
        {data.map(item => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.8}
            onPress={() => navigation.navigate(item.target, item.params as any)}
          >
            <Image source={item.image} style={{ width: SCREEN_WIDTH, height: imageHeight }} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.dotsRow}>
        {data.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.dot,
              { backgroundColor: idx === activeIdx ? '#006400' : '#d3d3d3' },
            ]}
          />
        ))}
      </View>
    </>
  );
};

/* -------------------------------------------------------------------------- */
/*                                 Home screen                                */
/* -------------------------------------------------------------------------- */
export default function HomeScreen({ navigation }: { navigation: NavigationProp }) {
  const [points, setPoints] = useState(0);

  const [recommended, setRecommended] = useState<
    { id: number; name: string; images: string[] }[]
  >([]);

  /* dummy slider data ---------------------------------------------------- */
  const recs: SliderItem[] = [
    { id: 'r1', image: require('../assets/reco_placeholder1.png'), target: 'RecommendationDetails', params: { id: 'r1' } },
    { id: 'r2', image: require('../assets/reco_placeholder2.png'), target: 'RecommendationDetails', params: { id: 'r2' } },
  ];

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) return;
  
        const res = await fetch('http://localhost:5000/api/points', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const data = await res.json();
  
        if (res.ok && typeof data.points === 'number') {
          setPoints(data.points);
        } else {
          console.warn('Failed to fetch points:', data);
        }
      } catch (error) {
        console.error('Error fetching points:', error);
      }
    };
  
    fetchPoints();

    const fetchRecommendations = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) return;
  
        const res = await fetch('http://localhost:5000/api/restaurants', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const { restaurants } = await res.json();
  
        const detailedRestaurants = await Promise.all(
          restaurants.map(async (rest: any) => {
            const menuRes = await fetch(`http://localhost:5000/api/menu/${rest.id}`);
            const menuItems = await menuRes.json();
  
            return {
              id: rest.id,
              name: rest.business_name,
              images: menuItems.map((item: any) => item.image_url).filter(Boolean),
            };
          })
        );
  
      setRecommended(detailedRestaurants); // or shuffle for more variety
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
      }
    };

    fetchRecommendations();
  }, []);

  /* render --------------------------------------------------------------- */
  return (
    <View style={styles.safe}>
      {Platform.OS === 'web' ? (
        /* Web: use View with overflowY */
        <View style={styles.webScroll}>
          {/* header */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.navigate('Account')}>
              <FontAwesome name="user-circle-o" size={28} color="#006400" />
            </TouchableOpacity>
            <View style={styles.pointsWrapper}>
              <View style={styles.pointsCircle}>
                <Text style={styles.pointsText}>{points}</Text>
                <Text style={styles.brandText}>RePlate</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
              <FontAwesome name="search" size={28} color="#006400" />
            </TouchableOpacity>
          </View>

          {/* CTA */}
          <TouchableOpacity
            style={styles.newBtn}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('NewOnReplate')}
          >
            <Text style={styles.newBtnText}>New on replate</Text>
            <Ionicons name="arrow-forward" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Section Header */}
          <SectionHeader
            title="Just for YOU!"
            onShowAll={() =>
              navigation.navigate('RestaurantList', { category: 'Recommended' })
            }
          />

          {/* Recommendation cards */}
          {recommended.map((rest) => (
            <View key={rest.id} style={{ marginBottom: 32 }}>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 16 }}
                style={{
                  width: SCREEN_WIDTH - 32,
                  alignSelf: 'center',
                }}
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
          ))}
        </View>
      ) : (
        /* Native: use ScrollView */
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            ...styles.scrollContent,
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator
        >
          {/* header */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.navigate('Account')}>
              <FontAwesome name="user-circle-o" size={28} color="#006400" />
            </TouchableOpacity>
            <View style={styles.pointsWrapper}>
              <View style={styles.pointsCircle}>
                <Text style={styles.pointsText}>{points}</Text>
                <Text style={styles.brandText}>RePlate</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
              <FontAwesome name="search" size={28} color="#006400" />
            </TouchableOpacity>
          </View>

          {/* CTA */}
          <TouchableOpacity
            style={styles.newBtn}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('NewOnReplate')}
          >
            <Text style={styles.newBtnText}>New on replate</Text>
            <Ionicons name="arrow-forward" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Section Header */}
          <SectionHeader
            title="Just for YOU!"
            onShowAll={() =>
              navigation.navigate('RestaurantList', { category: 'Recommended' })
            }
          />

          {/* Recommendation cards */}
          {recommended.map((rest) => (
            <View key={rest.id} style={{ marginBottom: 32 }}>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 16 }}
                style={{
                  width: SCREEN_WIDTH - 32,
                  alignSelf: 'center',
                }}
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
          ))}
        </ScrollView>
      )}

      {/* persistent bottom bar */}
      <BottomNavBar navigation={navigation} />
    </View>
  );


  

  
  
}

/* -------------------------------------------------------------------------- */
/*                          Helper components                                 */
/* -------------------------------------------------------------------------- */
const SectionHeader = ({
  title,
  onShowAll,
}: {
  title: string;
  onShowAll: () => void;
}) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <TouchableOpacity onPress={onShowAll}>
      <Text style={styles.showAll}>Show All</Text>
    </TouchableOpacity>
  </View>
);

/* -------------------------------------------------------------------------- */
/*                                   Styles                                   */
/* -------------------------------------------------------------------------- */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BEIGE,
  },
  webScroll: {
    flex: 1,
    height: '100%',         // ensure full-screen on web
    overflow: 'scroll',      // let browser handle vertical scroll
    paddingHorizontal: 16,
    paddingBottom: NAV_BAR_HEIGHT + 40,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: NAV_BAR_HEIGHT + 40,
  },

  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  pointsWrapper: { alignItems: 'center', flex: 1 },
  pointsCircle: { borderWidth: 2, borderColor: GREEN, borderRadius: 100, width: 140, height: 140, justifyContent: 'center', alignItems: 'center' },
  pointsText: { fontSize: 32, fontWeight: '700', color: '#ff8c00' },
  brandText: { fontSize: 20, color: GREEN, fontStyle: 'italic' },

  newBtn: { backgroundColor: GREEN, borderRadius: 18, paddingVertical: 20, paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  newBtnText: { color: '#fff', fontSize: 18, fontWeight: '600' },

  dotsRow: { flexDirection: 'row', justifyContent: 'center', marginVertical: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 20, marginBottom: 6 },
  sectionTitle: { fontSize: 22, fontWeight: '700', color: '#000' },
  showAll: { color: '#007bff', fontSize: 14 },
});
