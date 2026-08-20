import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../config/Colors';
import AppText from './AppText';
import Feather from 'react-native-vector-icons/Feather';

export const TailorCard = ({ tailor, onBookNow, onPress }) => {
  const formatExperience = exp => {
    if (!exp && exp !== 0) return 'Experience 08 Years';
    const years = exp.toString().replace(/[^0-9]/g, '');
    return `Experience ${years || '08'} Years`;
  };

  const locationText =
    tailor.address ||
    tailor.city ||
    tailor.location ||
    'California, United states';
  const displayName =
    tailor.name && tailor.last_name
      ? `${tailor.name} ${tailor.last_name}`
      : tailor.tailorName || tailor.name || 'Andrew Ainsley';
  const imageUrl = tailor.profile_image_url || tailor.image;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress && onPress(tailor)}
      activeOpacity={0.9}
    >
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri:
              imageUrl ||
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
          }}
          style={styles.avatar}
        />
      </View>

      <View style={styles.infoCol}>
        <AppText style={styles.name} numberOfLines={1}>
          {displayName}
        </AppText>
        <AppText style={styles.experience}>
          {formatExperience(tailor.experience)}
        </AppText>
        <View style={styles.locationRow}>
          <Feather
            name="map-pin"
            size={11}
            color={Colors.secondary}
            style={styles.pinIcon}
          />
          <AppText style={styles.location} numberOfLines={1}>
            {locationText}
          </AppText>
        </View>
      </View>

      <TouchableOpacity
        style={styles.detailsBtn}
        onPress={() => onBookNow && onBookNow(tailor)}
        activeOpacity={0.8}
      >
        <AppText style={styles.detailsBtnText}>View Details</AppText>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#DBA83A', // Brand Mustard Gold
    borderRadius: 14,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  avatarContainer: {
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#F5F5F5',
  },
  infoCol: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
    marginRight: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  experience: {
    fontSize: 12,
    color: '#000000',
    marginTop: 3,
    fontWeight: '500',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  pinIcon: {
    marginRight: 4,
    marginTop: 1,
  },
  location: {
    fontSize: 11,
    color: '#000000',
    fontWeight: '500',
  },
  detailsBtn: {
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 95,
  },
  detailsBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default TailorCard;
