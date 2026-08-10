import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import Colors from '../../../config/Colors';
import AppText from '../../../components/AppText';
import TextField from '../../../components/TextField';
import VendorHeader from '../../../components/VendorHeader';
import Feather from 'react-native-vector-icons/Feather';
import { launchImageLibrary } from 'react-native-image-picker';
import { Dropdown } from 'react-native-element-dropdown';
import { showToast } from '../../../components/Toast';
import {
  useGetTailorCategoriesQuery,
  useCreateTailorServiceMutation,
  useUpdateTailorServiceMutation,
} from '../../../Services/TailorServices';

const CreateService = ({ route, navigation }) => {
  const { service } = route.params || {};
  const isEditMode = !!service;

  const { data: categoriesResponse, isLoading: isLoadingCategories } =
    useGetTailorCategoriesQuery();
  const categoriesList = useMemo(
    () => categoriesResponse?.data || [],
    [categoriesResponse],
  );

  const [createTailorService, { isLoading: isCreating }] =
    useCreateTailorServiceMutation();
  const [updateTailorService, { isLoading: isUpdating }] =
    useUpdateTailorServiceMutation();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [pickedImage, setPickedImage] = useState(null);
  const [styleCategory, setStyleCategory] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      setName(service.name || '');
      setPrice(service.price ? String(service.price) : '');
      setDescription(service.description || '');
      setImageUri(service.image_url || service.image || '');
      setStyleCategory(service.category_name || '');
    }
  }, [service, isEditMode]);

  const handlePickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, response => {
      if (response.didCancel) return;
      if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
        return;
      }
      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        setImageUri(asset.uri);
        setPickedImage({
          uri: asset.uri,
          fileName: asset.fileName || `service_${Date.now()}.jpg`,
          type: asset.type || 'image/jpeg',
        });
      }
    });
  };

  const handleSave = async () => {
    const tempErrors = {};
    if (!name.trim()) tempErrors.name = 'Service name is required';
    if (!price.trim()) {
      tempErrors.price = 'Price is required';
    } else if (isNaN(price) || parseFloat(price) <= 0) {
      tempErrors.price = 'Price must be a valid positive number';
    }

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    const selectedCategory = categoriesList.find(
      cat => cat.name === styleCategory,
    );
    const categoryId = selectedCategory
      ? selectedCategory.id
      : categoriesList[0]?.id || '';

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('price', price.trim());
      formData.append('description', description.trim());
      formData.append('category_id', String(categoryId));

      if (pickedImage) {
        formData.append('image', {
          uri:
            Platform.OS === 'android'
              ? pickedImage.uri
              : pickedImage.uri.replace('file://', ''),
          name: pickedImage.fileName || 'service.jpg',
          type: pickedImage.type || 'image/jpeg',
        });
      }

      let response;
      if (isEditMode) {
        response = await updateTailorService({
          id: service.id,
          body: formData,
        }).unwrap();
      } else {
        response = await createTailorService(formData).unwrap();
      }

      if (response?.success) {
        showToast(
          'Success',
          response?.message ||
            (isEditMode
              ? 'Service updated successfully.'
              : 'Service added successfully.'),
          'success',
        );
        navigation.goBack();
      } else {
        showToast(
          'Error',
          response?.message || 'Failed to save service.',
          'error',
        );
      }
    } catch (err) {
      console.log('handleSave error:', err);
      showToast(
        'Error',
        err?.data?.message || 'An error occurred while saving.',
        'error',
      );
    }
  };

  console.log('styleCategory:-', styleCategory);
  console.log('categoriesList:-', categoriesList);
  console.log('Service:-', service?.category_id);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.safeArea}
    >
      <View style={styles.safeArea}>
        <VendorHeader
          navigation={navigation}
          title={isEditMode ? 'EDIT SERVICE' : 'ADD NEW SERVICE'}
          goBack={true}
          homeHeader={false}
          notification={false}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            {/* Upload Image Box */}
            <TouchableOpacity
              style={styles.imageUploadBox}
              onPress={handlePickImage}
              activeOpacity={0.8}
            >
              {imageUri ? (
                <>
                  <Image
                    source={
                      typeof imageUri === 'string'
                        ? { uri: imageUri }
                        : imageUri
                    }
                    style={styles.uploadedImage}
                  />
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

            <TextField
              label="Service Name"
              value={name}
              onChangeText={txt => {
                setName(txt);
                if (errors.name) setErrors({ ...errors, name: null });
              }}
              placeholder="Tuxedo Stitching"
              error={errors.name}
            />

            <TextField
              label="Service Price"
              value={price}
              onChangeText={txt => {
                setPrice(txt);
                if (errors.price) setErrors({ ...errors, price: null });
              }}
              placeholder="$60"
              keyboardType="numeric"
              error={errors.price}
            />

            {/* Style Category Dropdown Selector */}
            <View style={styles.dropdownContainer}>
              <AppText style={styles.dropdownLabel}>Style</AppText>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                containerStyle={styles.dropdownMenuContainer}
                data={categoriesList.map(cat => ({
                  label: cat.name,
                  value: cat.name,
                }))}
                maxHeight={220}
                labelField="label"
                valueField="value"
                placeholder={
                  isLoadingCategories ? 'Loading categories...' : 'Select Style'
                }
                value={styleCategory}
                onChange={item => setStyleCategory(item.value)}
              />
            </View>

            <TextField
              label="Service Description"
              value={description}
              onChangeText={setDescription}
              placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
              multiline
              style={styles.descriptionInput}
            />
          </View>
        </ScrollView>

        {/* Save Button */}
        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={[
              styles.saveBtn,
              (isCreating || isUpdating) && { opacity: 0.7 },
            ]}
            onPress={handleSave}
            disabled={isCreating || isUpdating}
            activeOpacity={0.8}
          >
            {isCreating || isUpdating ? (
              <ActivityIndicator size="small" color="#000000" />
            ) : (
              <>
                <AppText style={styles.saveBtnText}>
                  {isEditMode ? 'Save Changes' : 'Add New Service'}
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
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 110,
  },
  form: {
    marginTop: 10,
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  imageUploadBox: {
    height: 150,
    borderWidth: 1,
    borderColor: '#DEDEDE',
    borderRadius: 14,
    backgroundColor: '#F8F9FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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
    fontWeight: '700',
    color: '#FFFFFF',
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
  btnContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Colors.white,
  },
  saveBtn: {
    height: 52,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  arrowIcon: {
    position: 'absolute',
    right: 20,
  },
});

export default CreateService;
