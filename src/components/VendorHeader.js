import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Colors from '../config/Colors';
import Fonts from '../config/Fonts';
import AppText from './AppText';
import Feather from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/authSlice';

const VendorHeader = ({
  navigation,
  title,
  goBack,
  homeHeader,
  notification,
}) => {
  const userProfile = useSelector(selectUser) || {};

  const handleBackPress = () => {
    if (typeof goBack === 'function') {
      goBack();
    } else if (navigation) {
      navigation.goBack();
    }
  };

  if (homeHeader) {
    return (
      <View style={styles.homeHeaderContainer}>
        <View style={styles.profileContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('VendorProfile')}
            activeOpacity={0.8}
          >
            <Image
              source={{
                uri:
                  userProfile.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
              }}
              style={styles.avatar}
            />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <AppText style={styles.welcomeText}>Welcome,</AppText>
            <AppText style={styles.shopName}>
              {userProfile.name || 'Ellis Couture'}
            </AppText>
          </View>
        </View>

        {notification && (
          <TouchableOpacity
            style={styles.bellBtn}
            activeOpacity={0.7}
            onPress={
              typeof notification === 'function' ? notification : undefined
            }
          >
            <Feather name="bell" size={20} color="#000000" />
            <View style={styles.badgeDot} />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.header}>
      {goBack ? (
        <TouchableOpacity
          style={styles.backBtn}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={24} color="#000000" />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholderBtn} />
      )}

      <View style={styles.titleContainer}>
        <AppText style={styles.titleText}>{title}</AppText>
        <View style={styles.diamondContainer}>
          <View style={styles.diamondLine} />
          <View style={styles.diamond} />
          <View style={styles.diamondLine} />
        </View>
      </View>

      <View style={styles.placeholderBtn} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: Colors.white,
    marginTop: 30,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  placeholderBtn: {
    width: 40,
  },
  titleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  titleText: {
    fontSize: 20,
    fontFamily: Fonts.regular,
    letterSpacing: 3,
    color: '#000000',
  },
  diamondContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    width: 160,
  },
  diamondLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderColor,
  },
  diamond: {
    width: 6,
    height: 6,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    transform: [{ rotate: '45deg' }],
    backgroundColor: '#FFFFFF',
  },
  homeHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: Colors.white,
    marginTop: 30,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#F5F5F5',
  },
  headerTextContainer: {
    marginLeft: 12,
  },
  welcomeText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: '#7C7C7C',
    marginBottom: 2,
  },
  shopName: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#000000',
    fontWeight: '700',
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badgeDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.redDot,
  },
});

export default VendorHeader;
