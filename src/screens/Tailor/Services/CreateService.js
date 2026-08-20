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

  // Required Measurements States
  const [requiredMeasurements, setRequiredMeasurements] = useState([]);
  const [isAddingMeasurement, setIsAddingMeasurement] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUnit, setNewUnit] = useState('inches');
  const [newRequired, setNewRequired] = useState(true);

  useEffect(() => {
    if (isEditMode) {
      setName(service.name || '');
      setPrice(service.price ? String(service.price) : '');
      setDescription(service.description || '');
      setImageUri(service.image_url || service.image || '');
      setStyleCategory(service.category_name || '');

      // Parse required_measurements from service if editing
      if (service.required_measurements) {
        try {
          const parsed =
            typeof service.required_measurements === 'string'
              ? JSON.parse(service.required_measurements)
              : service.required_measurements;
          if (Array.isArray(parsed)) {
            setRequiredMeasurements(parsed);
          }
        } catch (e) {
          console.log('Error parsing required_measurements:', e);
        }
      }
    }
  }, [service, isEditMode]);

  const handleAddNewMeasurement = () => {
    if (!newTitle.trim()) {
      showToast('Validation Error', 'Measurement title is required.', 'error');
      return;
    }
    const key = newTitle
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');

    // Check if key already exists
    if (requiredMeasurements.some(item => item.key === key)) {
      showToast(
        'Validation Error',
        'A measurement field with this name already exists.',
        'error',
      );
      return;
    }

    const newField = {
      key,
      title: newTitle.trim(),
      description: '',
      unit: newUnit.trim() || 'inches',
      required: newRequired,
    };

    setRequiredMeasurements(prev => [...prev, newField]);
    setIsAddingMeasurement(false);
    setNewTitle('');
    setNewUnit('inches');
    setNewRequired(true);
  };

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

      // Append required_measurements
      formData.append(
        'required_measurements',
        JSON.stringify(requiredMeasurements),
      );
      requiredMeasurements.forEach((item, index) => {
        formData.append(`required_measurements[${index}][key]`, item.key);
        formData.append(`required_measurements[${index}][title]`, item.title);
        formData.append(
          `required_measurements[${index}][description]`,
          item.description || '',
        );
        formData.append(
          `required_measurements[${index}][unit]`,
          item.unit || 'inches',
        );
        formData.append(
          `required_measurements[${index}][required]`,
          item.required ? '1' : '0',
        );
      });

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
      console.log('formData:-', formData);

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

  // console.log('styleCategory:-', styleCategory);
  // console.log('categoriesList:-', categoriesList);
  // console.log('Service:-', service?.category_id);
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

            {/* Required Measurements Section */}
            <View style={styles.measurementsSection}>
              <AppText style={styles.sectionLabel}>
                Required Measurements
              </AppText>

              {requiredMeasurements.map((item, idx) => (
                <View key={item.key} style={styles.measurementItemRow}>
                  <View style={styles.measurementItemInfo}>
                    <AppText style={styles.measurementItemTitle}>
                      {item.title}
                    </AppText>
                    <AppText style={styles.measurementItemUnit}>
                      Unit: {item.unit}{' '}
                      {item.required ? '(Required)' : '(Optional)'}
                    </AppText>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setRequiredMeasurements(prev =>
                        prev.filter((_, i) => i !== idx),
                      );
                    }}
                    style={styles.deleteBtn}
                  >
                    <Feather name="trash-2" size={18} color={Colors.red} />
                  </TouchableOpacity>
                </View>
              ))}

              {isAddingMeasurement ? (
                <View style={styles.addFormCard}>
                  <TextField
                    label="Measurement Title"
                    value={newTitle}
                    onChangeText={setNewTitle}
                    placeholder="e.g. Coat Length"
                  />
                  <TextField
                    label="Unit"
                    value={newUnit}
                    onChangeText={setNewUnit}
                    placeholder="e.g. inches"
                  />
                  <View style={styles.checkboxRow}>
                    <TouchableOpacity
                      style={styles.checkbox}
                      onPress={() => setNewRequired(prev => !prev)}
                      activeOpacity={0.7}
                    >
                      <Feather
                        name={newRequired ? 'check-square' : 'square'}
                        size={20}
                        color={Colors.primary}
                      />
                      <AppText style={styles.checkboxLabel}>
                        Is Required?
                      </AppText>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.addFormActions}>
                    <TouchableOpacity
                      style={[styles.formBtn, styles.cancelBtn]}
                      onPress={() => setIsAddingMeasurement(false)}
                    >
                      <AppText style={styles.cancelBtnText}>Cancel</AppText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.formBtn, styles.addBtn]}
                      onPress={handleAddNewMeasurement}
                    >
                      <AppText style={styles.addBtnText}>Add Field</AppText>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.addMeasurementBtn}
                  onPress={() => {
                    setNewTitle('');
                    setNewUnit('inches');
                    setNewRequired(true);
                    setIsAddingMeasurement(true);
                  }}
                  activeOpacity={0.7}
                >
                  <Feather name="plus" size={16} color={Colors.primary} />
                  <AppText style={styles.addMeasurementBtnText}>
                    Add Measurement Field
                  </AppText>
                </TouchableOpacity>
              )}
            </View>
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
  measurementsSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 20,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 13,
    color: '#7C7C7C',
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 4,
  },
  measurementItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FD',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E2E2',
  },
  measurementItemInfo: {
    flex: 1,
  },
  measurementItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 2,
  },
  measurementItemUnit: {
    fontSize: 12,
    color: '#7C7C7C',
  },
  deleteBtn: {
    padding: 6,
    marginLeft: 10,
  },
  addMeasurementBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.primary,
    borderRadius: 24,
    marginTop: 10,
  },
  addMeasurementBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    marginLeft: 6,
  },
  addFormCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  checkboxRow: {
    marginBottom: 16,
    marginLeft: 4,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '600',
    marginLeft: 8,
  },
  addFormActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  formBtn: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtn: {
    borderWidth: 1.2,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
  },
  addBtn: {
    backgroundColor: Colors.primary,
  },
  addBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
  },
});

export default CreateService;
