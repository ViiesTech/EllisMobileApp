import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../config/Colors';
import AppText from './AppText';

export const TailorCard = ({ tailor, onBookNow, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress && onPress(tailor)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: tailor.image }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <AppText style={styles.name} numberOfLines={1}>
            {tailor.name}
          </AppText>
          <View style={styles.ratingBadge}>
            <AppText style={styles.star}>★</AppText>
            <AppText style={styles.ratingText}>{tailor.rating}</AppText>
          </View>
        </View>

        <AppText style={styles.tailorSub}>
          {tailor.tailorName} • {tailor.experience}
        </AppText>

        <View style={styles.chipsRow}>
          {tailor.specialties?.map((spec, i) => (
            <View key={i} style={styles.chip}>
              <AppText style={styles.chipText}>{spec}</AppText>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <View>
            <AppText style={styles.priceLabel}>Starting from</AppText>
            <AppText style={styles.price}>${tailor.priceStarting}</AppText>
          </View>

          <TouchableOpacity
            style={styles.bookBtn}
            onPress={() => onBookNow && onBookNow(tailor)}
          >
            <AppText style={styles.bookBtnText}>Book Appointment</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    marginBottom: 16,
    flexDirection: 'row',
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.graybordercolor,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: 90,
    height: 110,
    borderRadius: 10,
    backgroundColor: Colors.textinputboxcolor,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.secondary,
    flex: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.pendingBG,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  star: {
    fontSize: 11,
    color: Colors.pending,
    marginRight: 2,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.pending,
  },
  tailorSub: {
    fontSize: 12,
    color: Colors.lightblack,
    marginTop: 2,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  chip: {
    backgroundColor: Colors.textinputboxcolor,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  chipText: {
    fontSize: 10,
    color: Colors.black,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  priceLabel: {
    fontSize: 10,
    color: Colors.lightblack,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  bookBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  bookBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
});

export default TailorCard;
