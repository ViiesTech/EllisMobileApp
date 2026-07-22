import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../config/Colors';
import AppText from './AppText';

export const ProductCard = ({ product, onPress, onAddToCart }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress && onPress(product)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
      <View style={styles.content}>
        <AppText style={styles.category}>{product.category.toUpperCase()}</AppText>
        <AppText style={styles.title} numberOfLines={1}>
          {product.name}
        </AppText>
        <View style={styles.ratingRow}>
          <AppText style={styles.star}>★</AppText>
          <AppText style={styles.rating}>{product.rating}</AppText>
          <AppText style={styles.reviews}>({product.reviews})</AppText>
        </View>
        <View style={styles.footer}>
          <AppText style={styles.price}>${product.price}</AppText>
          {onAddToCart && (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => onAddToCart(product)}
            >
              <AppText style={styles.addBtnText}>+ Add</AppText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.graybordercolor,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: '100%',
    height: 140,
    backgroundColor: Colors.textinputboxcolor,
  },
  content: {
    padding: 10,
  },
  category: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.secondary,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  star: {
    fontSize: 12,
    color: Colors.star,
    marginRight: 2,
  },
  rating: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.secondary,
  },
  reviews: {
    fontSize: 11,
    color: Colors.lightblack,
    marginLeft: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.secondary,
  },
  addBtn: {
    backgroundColor: Colors.whitebackgroundcolor,
    borderColor: Colors.primary,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  addBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
});

export default ProductCard;
