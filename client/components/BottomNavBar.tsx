import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface Props {
  navigation: NavigationProp;
}

const GREEN = '#2E8B57';
const NAV_BAR_HEIGHT = 60;

const BottomNavBar: React.FC<Props> = ({ navigation }) => {
  const NavIcon = ({
    icon,
    to,
  }: { icon: React.ReactElement; to: keyof RootStackParamList }) => (
    <TouchableOpacity style={styles.navIcon} onPress={() => navigation.navigate(to as never)}>
      {icon}
    </TouchableOpacity>
  );

  return (
    <View style={styles.navBar}>
      <NavIcon icon={<Entypo   name="location-pin" size={24} color="#fff" />} to="Location"     />
      <NavIcon icon={<FontAwesome name="shopping-bag" size={24} color="#fff" />} to="Cart"         />
      <NavIcon icon={<FontAwesome name="home"        size={24} color="#fff" />} to="Home"         />
      <NavIcon icon={<FontAwesome name="list"        size={24} color="#fff" />} to="TrackOrder"   />
      <NavIcon icon={<FontAwesome name="bell"        size={24} color="#fff" />} to="Notifications"/>
    </View>
  );
};

export default BottomNavBar;

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: NAV_BAR_HEIGHT,
    paddingVertical: 10,
    backgroundColor: GREEN,
  },
  navIcon: { paddingHorizontal: 6 },
});
