import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { launchImageLibrary } from 'react-native-image-picker';
import Colors from '../../../config/Colors';
import Fonts from '../../../config/Fonts';
import TextField from '../../../components/TextField';
import AppText from '../../../components/AppText';
import Feather from 'react-native-vector-icons/Feather';
import { addProduct, editProduct } from '../../../store/productSlice';
import VendorHeader from '../../../components/VendorHeader';

const AddProduct = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const editingProduct = route.params?.product;

  const [name, setName] = useState(editingProduct?.name || '');
  const [price, setPrice] = useState(
    editingProduct?.price ? String(editingProduct.price) : '',
  );
  const [category, setCategory] = useState(
    editingProduct?.category || 'Fabrics',
  );
  const [description, setDescription] = useState(
    editingProduct?.description || '',
  );
  const [stock, setStock] = useState(
    editingProduct?.stock ? String(editingProduct.stock) : '10',
  );
  const [material, setMaterial] = useState(
    editingProduct?.material || 'Pure Silk / Wool',
  );
  const [color, setColor] = useState(editingProduct?.color || 'Olive Green');
  const [imageUri, setImageUri] = useState(editingProduct?.image || '');

  const [catModalVisible, setCatModalVisible] = useState(false);

  const handlePickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, response => {
      if (response.didCancel) return;
      if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
        return;
      }
      if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const handleSubmit = () => {
    if (!name || !price) return;

    const productData = {
      name,
      price: parseFloat(price) || 0,
      category,
      description,
      stock: parseInt(stock, 10) || 1,
      material,
      image:
        imageUri ||
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format&fit=crop&q=80',
      color,
    };

    if (editingProduct) {
      dispatch(
        editProduct({
          id: editingProduct.id,
          updates: productData,
        }),
      );
    } else {
      dispatch(addProduct(productData));
    }

    navigation.goBack();
  };

  const categories = ['Fabrics', 'Suits', 'Shirts', 'Trousers'];

  return (
    <View style={styles.safeArea}>
      <VendorHeader
        navigation={navigation}
        title={editingProduct ? 'EDIT PRODUCT' : 'ADD NEW PRODUCT'}
        goBack={true}
        homeHeader={false}
        notification={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Upload Image Box */}
        <TouchableOpacity
          style={styles.imageUploadBox}
          onPress={handlePickImage}
          activeOpacity={0.8}
        >
          {imageUri ? (
            <>
              <Image source={{ uri: imageUri }} style={styles.uploadedImage} />
              <View style={styles.changeBadge}>
                <AppText style={styles.changeText}>Change Image</AppText>
              </View>
            </>
          ) : (
            <View style={styles.uploadInner}>
              <View style={styles.uploadIconCircle}>
                <Feather name="image" size={32} color="#1A1A1A" />
                <View style={styles.uploadArrowBadge}>
                  <Feather name="arrow-up" size={10} color="#FFFFFF" />
                </View>
              </View>
              <AppText style={styles.uploadText}>Upload Image</AppText>
            </View>
          )}
        </TouchableOpacity>

        {/* Form Fields */}
        <TextField
          label="Fabric Name"
          value={name}
          onChangeText={setName}
          placeholder="Cotton"
        />

        {/* Category Trigger Field */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setCatModalVisible(true)}
        >
          <View pointerEvents="none">
            <TextField
              label="Category"
              value={category}
              placeholder="Lorem ipsum"
            />
          </View>
        </TouchableOpacity>

        <TextField
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Lorem ipsum"
          multiline
        />

        <TextField
          label="Price per Meter"
          value={price}
          onChangeText={setPrice}
          placeholder="$30"
          keyboardType="numeric"
        />

        <TextField
          label="Available Stock"
          value={stock}
          onChangeText={setStock}
          placeholder="Yes"
          keyboardType="numeric"
        />

        <TextField
          label="Color"
          value={color}
          onChangeText={setColor}
          placeholder="Olive Green"
        />

        <TextField
          label="Material"
          value={material}
          onChangeText={setMaterial}
          placeholder="Lorem ipsum"
        />
      </ScrollView>

      {/* Save Button */}
      <View style={styles.bottomBtnContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <AppText style={styles.saveButtonText}>
            {editingProduct ? 'Update Product Details' : 'Add New Product'}
          </AppText>
          <Feather
            name="arrow-right"
            size={20}
            color="#000000"
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Category Selection Modal */}
      <Modal
        visible={catModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCatModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBg}
          activeOpacity={1}
          onPress={() => setCatModalVisible(false)}
        >
          <View style={styles.modalCard}>
            <AppText style={styles.modalTitle}>Select Category</AppText>

            <FlatList
              data={categories}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.catOption,
                    category === item && styles.catOptionSelected,
                  ]}
                  onPress={() => {
                    setCategory(item);
                    setCatModalVisible(false);
                  }}
                >
                  <AppText style={styles.catOptionText}>{item}</AppText>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setCatModalVisible(false)}
            >
              <AppText style={styles.closeBtnText}>Close</AppText>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: Colors.white,
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
    backgroundColor: '#DEDEDE',
  },
  diamond: {
    width: 6,
    height: 6,
    borderWidth: 1,
    borderColor: '#DEDEDE',
    transform: [{ rotate: '45deg' }],
    backgroundColor: '#FFFFFF',
    marginHorizontal: 8,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 120, // Extra padding for floating bottom button
  },
  imageUploadBox: {
    height: 150,
    borderWidth: 1,
    borderColor: '#DEDEDE',
    borderRadius: 14,
    backgroundColor: '#F8F9FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    overflow: 'hidden',
  },
  uploadInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadIconCircle: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  uploadArrowBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#F8F9FD',
  },
  uploadText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#1A1A1A',
    marginTop: 4,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  changeBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  changeText: {
    fontSize: 11,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
  },
  bottomBtnContainer: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    backgroundColor: 'transparent',
  },
  saveButton: {
    height: 54,
    backgroundColor: '#DBA83A',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#000000',
    fontWeight: '700',
  },
  arrowIcon: {
    position: 'absolute',
    right: 20,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#000000',
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '700',
  },
  catOption: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'center',
  },
  catOptionSelected: {
    backgroundColor: '#F9EFCF',
    borderRadius: 8,
  },
  catOptionText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#1A1A1A',
  },
  closeBtn: {
    marginTop: 16,
    backgroundColor: '#1A1A1A',
    height: 46,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

export default AddProduct;
