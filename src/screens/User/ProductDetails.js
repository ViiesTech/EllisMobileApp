import React, { useState } from 'react';
import { View, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import Colors from '../../config/Colors';
import CustomButton from '../../components/CustomButton';
import AppText from '../../components/AppText';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/productSlice';

const ProductDetails = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const product = route.params?.product || {
    name: 'Italian Navy Wool Suit Fabric',
    category: 'Fabrics',
    price: 180,
    rating: 4.8,
    reviews: 42,
    stock: 15,
    material: 'Pure Wool',
    description: 'Premium 100% Super 130s Italian Wool.',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format&fit=crop&q=80',
  };

  const [selectedFit, setSelectedFit] = useState('Slim Fit');
  const [qty, setQty] = useState(1);
  const [addedAlert, setAddedAlert] = useState(false);

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: qty }));
    setAddedAlert(true);
    setTimeout(() => setAddedAlert(false), 2000);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: product.image }} style={styles.image} />
        
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <AppText style={styles.backText}>‹</AppText>
        </TouchableOpacity>

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <AppText style={styles.category}>{product.category.toUpperCase()}</AppText>
              <AppText style={styles.name}>{product.name}</AppText>
            </View>
            <AppText style={styles.price}>${product.price}</AppText>
          </View>

          <View style={styles.ratingRow}>
            <AppText style={styles.star}>★ {product.rating}</AppText>
            <AppText style={styles.reviews}>({product.reviews} customer reviews)</AppText>
            <View style={styles.stockBadge}>
              <AppText style={styles.stockText}>In Stock ({product.stock})</AppText>
            </View>
          </View>

          <AppText style={styles.sectionHeader}>DESCRIPTION & SPECIFICATIONS</AppText>
          <AppText style={styles.desc}>{product.description}</AppText>

          <View style={styles.specRow}>
            <View style={styles.specBox}>
              <AppText style={styles.specLabel}>Material</AppText>
              <AppText style={styles.specVal}>{product.material}</AppText>
            </View>
            <View style={styles.specBox}>
              <AppText style={styles.specLabel}>Weave</AppText>
              <AppText style={styles.specVal}>Super 130s</AppText>
            </View>
            <View style={styles.specBox}>
              <AppText style={styles.specLabel}>Origin</AppText>
              <AppText style={styles.specVal}>Italy</AppText>
            </View>
          </View>

          <AppText style={styles.sectionHeader}>SELECT FIT CONTOUR</AppText>
          <View style={styles.fitRow}>
            {['Slim Fit', 'Custom Tailored', 'Regular Fit'].map((fit) => (
              <TouchableOpacity
                key={fit}
                style={[
                  styles.fitChip,
                  selectedFit === fit && styles.fitChipSelected,
                ]}
                onPress={() => setSelectedFit(fit)}
              >
                <AppText
                  style={[
                    styles.fitText,
                    selectedFit === fit && styles.fitTextSelected,
                  ]}
                >
                  {fit}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>

          <AppText style={styles.sectionHeader}>QUANTITY</AppText>
          <View style={styles.qtyRow}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQty(Math.max(1, qty - 1))}
            >
              <AppText style={styles.qtyBtnText}>-</AppText>
            </TouchableOpacity>
            <AppText style={styles.qtyText}>{qty}</AppText>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQty(qty + 1)}
            >
              <AppText style={styles.qtyBtnText}>+</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <CustomButton
          title={addedAlert ? '✓ Added to Cart!' : `Add to Cart • $${product.price * qty}`}
          onPress={handleAddToCart}
          variant={addedAlert ? 'secondary' : 'primary'}
          style={{ flex: 1, marginRight: 10 }}
        />
        <CustomButton
          title="Buy Now"
          onPress={() => {
            addToCart(product, qty);
            navigation.navigate('CartCheckout');
          }}
          variant="outline"
          style={{ width: 110 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
  },
  image: {
    width: '100%',
    height: 320,
    backgroundColor: Colors.textinputboxcolor,
  },
  backBtn: {
    position: 'absolute',
    top: 44,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 26,
    color: Colors.secondary,
    marginTop: -4,
  },
  body: {
    padding: 20,
  },
  category: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
    letterSpacing: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.secondary,
  },
  price: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginLeft: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  star: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.star,
    marginRight: 6,
  },
  reviews: {
    fontSize: 12,
    color: Colors.lightblack,
    marginRight: 10,
  },
  stockBadge: {
    backgroundColor: Colors.greenBG,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  stockText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.green,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.lightblack,
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 8,
  },
  desc: {
    fontSize: 14,
    color: Colors.black,
    lineHeight: 22,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  specBox: {
    flex: 1,
    backgroundColor: Colors.whitebackgroundcolor,
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.graybordercolor,
  },
  specLabel: {
    fontSize: 10,
    color: Colors.lightblack,
  },
  specVal: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.secondary,
    marginTop: 2,
  },
  fitRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  fitChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.graybordercolor,
    marginRight: 10,
    backgroundColor: Colors.textinputboxcolor,
  },
  fitChipSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.whitebackgroundcolor,
  },
  fitText: {
    fontSize: 13,
    color: Colors.secondary,
    fontWeight: '600',
  },
  fitTextSelected: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.graybordercolor,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.textinputboxcolor,
  },
  qtyBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.secondary,
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.secondary,
    marginHorizontal: 16,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.graybordercolor,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ProductDetails;
