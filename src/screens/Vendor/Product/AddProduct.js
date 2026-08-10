import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
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
import {
  useAddProductMutation,
  useUpdateProductMutation,
  useGetVendorCategoriesQuery,
} from '../../../Services/VendorServices';
import { showToast, showToastError } from '../../../components/Toast';
import { Dropdown } from 'react-native-element-dropdown';

const AddProduct = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const editingProduct = route.params?.product;
  console.log('editingProduct:-', editingProduct);
  const [addProductMutation, { isLoading: isAdding }] = useAddProductMutation();
  const [updateProductMutation, { isLoading: isUpdating }] =
    useUpdateProductMutation();
  const isLoading = isAdding || isUpdating;

  const { data: categoriesResponse, isLoading: isLoadingCategories } =
    useGetVendorCategoriesQuery();
  const categoriesList = categoriesResponse?.data || [];

  const [name, setName] = useState(editingProduct?.name || '');
  const [price, setPrice] = useState(
    editingProduct?.price_per_meter
      ? String(editingProduct.price_per_meter)
      : editingProduct?.price
      ? String(editingProduct.price)
      : '',
  );
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState(
    editingProduct?.description || '',
  );
  const [stock, setStock] = useState(
    editingProduct?.available_stock !== undefined
      ? String(editingProduct.available_stock)
      : editingProduct?.stock
      ? String(editingProduct.stock)
      : '10',
  );
  const [material, setMaterial] = useState(
    editingProduct?.material || 'Pure Silk / Wool',
  );
  const [color, setColor] = useState(editingProduct?.color || 'Olive Green');

  useEffect(() => {
    if (editingProduct) {
      if (editingProduct.category_id) {
        setCategoryId(editingProduct.category_id);
      } else if (editingProduct.category && categoriesList.length > 0) {
        const matched = categoriesList.find(
          c => c.name.toLowerCase() === editingProduct.category.toLowerCase(),
        );
        if (matched) setCategoryId(matched.id);
      }
    } else if (categoriesList.length > 0 && !categoryId) {
      setCategoryId(categoriesList[0].id);
    }
  }, [editingProduct, categoriesList]);

  const getInitialImages = () => {
    if (!editingProduct) return [];
    if (Array.isArray(editingProduct.images)) return editingProduct.images;
    if (
      typeof editingProduct.images === 'string' &&
      editingProduct.images.trim() !== ''
    )
      return [editingProduct.images];
    if (Array.isArray(editingProduct.images)) return editingProduct.images;
    if (
      typeof editingProduct.images === 'string' &&
      editingProduct.images.trim() !== ''
    )
      return [editingProduct.images];
    return [];
  };

  const [images, setImages] = useState(getInitialImages());

  const handlePickImage = () => {
    launchImageLibrary(
      { mediaType: 'photo', selectionLimit: 0, quality: 0.5 },
      response => {
        if (response.didCancel) return;
        if (response.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
          return;
        }
        if (response.assets && response.assets.length > 0) {
          const newPicked = response.assets.map(asset => ({
            uri: asset.uri,
            fileName:
              asset.fileName ||
              `image_${Date.now()}_${Math.random()
                .toString(36)
                .substring(7)}.jpg`,
            type: asset.type || 'image/jpeg',
          }));
          setImages(prev => [...prev, ...newPicked]);
        }
      },
    );
  };

  const handleRemoveImage = indexToRemove => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      showToast('Validation Error', 'Please enter fabric name', 'error');
      return;
    }
    if (!price.trim()) {
      showToast('Validation Error', 'Please enter price per meter', 'error');
      return;
    }
    if (!categoryId) {
      showToast('Validation Error', 'Please select a category', 'error');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('category_id', String(categoryId));
      formData.append('description', description.trim());
      formData.append('price_per_meter', price.trim());
      formData.append('available_stock', stock.trim());
      formData.append('color', color.trim());
      formData.append('material', material.trim());

      images.forEach((img, index) => {
        const imgUri = typeof img === 'string' ? img : img.uri;
        if (
          imgUri &&
          !imgUri.startsWith('http') &&
          !imgUri.startsWith('https')
        ) {
          formData.append('images[]', {
            uri:
              Platform.OS === 'android'
                ? imgUri
                : imgUri.replace('file://', ''),
            name: img.fileName || `product_${index}.jpg`,
            type: img.type || 'image/jpeg',
          });
        }
      });

      let response;
      if (editingProduct) {
        response = await updateProductMutation({
          id: editingProduct.id,
          body: formData,
        }).unwrap();
        console.log('updateProduct response:-', response);
      } else {
        response = await addProductMutation(formData).unwrap();
        console.log('addProduct response:-', response);
      }

      if (response?.success) {
        showToast(
          'Success',
          response?.message ||
            (editingProduct
              ? 'Product updated successfully.'
              : 'Product created successfully.'),
          'success',
        );
        if (response?.data) {
          if (editingProduct) {
            dispatch(
              editProduct({ id: editingProduct.id, updates: response.data }),
            );
            navigation.navigate('ProductDetails', { product: response.data });
            return;
          } else {
            dispatch(addProduct(response.data));
          }
        }
        navigation.goBack();
      } else {
        showToast(
          'Error',
          response?.message ||
            (editingProduct
              ? 'Failed to update product.'
              : 'Failed to create product.'),
          'error',
        );
      }
    } catch (err) {
      console.log('handleSubmit error:-', err);
      showToastError('Error', err);
    }
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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Upload Image Box / Multi-Image List */}
          {images.length === 0 ? (
            <TouchableOpacity
              style={styles.imageUploadBox}
              onPress={handlePickImage}
              activeOpacity={0.8}
            >
              <View style={styles.uploadInner}>
                <View style={styles.uploadIconCircle}>
                  <Feather name="image" size={32} color="#1A1A1A" />
                  <View style={styles.uploadArrowBadge}>
                    <Feather name="arrow-up" size={10} color="#FFFFFF" />
                  </View>
                </View>
                <AppText style={styles.uploadText}>Upload Images</AppText>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.imagesContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.imagesList}
              >
                {images.map((img, index) => {
                  const uri = typeof img === 'string' ? img : img.uri;
                  return (
                    <View key={index} style={styles.imageThumbWrapper}>
                      <Image source={{ uri }} style={styles.thumbImage} />
                      <TouchableOpacity
                        style={styles.removeImageBadge}
                        onPress={() => handleRemoveImage(index)}
                        activeOpacity={0.8}
                      >
                        <Feather name="x" size={14} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  );
                })}
                <TouchableOpacity
                  style={styles.addMoreBox}
                  onPress={handlePickImage}
                  activeOpacity={0.8}
                >
                  <Feather name="plus" size={24} color="#1A1A1A" />
                  <AppText style={styles.addMoreText}>Add More</AppText>
                </TouchableOpacity>
              </ScrollView>
            </View>
          )}

          {/* Form Fields */}
          <TextField
            label="Fabric Name"
            value={name}
            onChangeText={setName}
            placeholder="Cotton"
          />

          {/* Category Dropdown Selector */}
          <View style={styles.dropdownContainer}>
            <AppText style={styles.dropdownLabel}>Category</AppText>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              containerStyle={styles.dropdownMenuContainer}
              data={categoriesList.map(cat => ({
                label: cat.name,
                value: cat.id,
              }))}
              maxHeight={220}
              labelField="label"
              valueField="value"
              placeholder={
                isLoadingCategories
                  ? 'Loading categories...'
                  : 'Select Category'
              }
              value={categoryId}
              onChange={item => setCategoryId(item.value)}
            />
          </View>

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
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <>
                <AppText style={styles.saveButtonText}>
                  {editingProduct
                    ? 'Update Product Details'
                    : 'Add New Product'}
                </AppText>
                <Feather
                  name="arrow-right"
                  size={20}
                  color="#000000"
                  style={styles.arrowIcon}
                />
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  keyboardView: {
    flex: 1,
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
  imagesContainer: {
    marginBottom: 24,
  },
  imagesList: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageThumbWrapper: {
    width: 100,
    height: 100,
    borderRadius: 14,
    marginRight: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeImageBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addMoreBox: {
    width: 100,
    height: 100,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DEDEDE',
    borderStyle: 'dashed',
    backgroundColor: '#F8F9FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addMoreText: {
    fontSize: 12,
    color: '#1A1A1A',
    marginTop: 4,
    fontFamily: Fonts.regular,
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
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownLabel: {
    fontSize: 13,
    color: '#7C7C7C',
    marginBottom: 6,
    marginLeft: 4,
    fontWeight: '600',
  },
  dropdown: {
    height: 52,
    borderColor: '#E2E2E2',
    borderWidth: 1,
    borderRadius: 26,
    paddingHorizontal: 18,
    backgroundColor: Colors.white,
  },
  placeholderStyle: {
    fontSize: 14,
    color: '#A3A3A3',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#000000',
  },
  dropdownMenuContainer: {
    marginTop: -20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default AddProduct;
