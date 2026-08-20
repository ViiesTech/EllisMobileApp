import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Colors from '../../config/Colors';
import TextField from '../../components/TextField';
import CustomButton from '../../components/CustomButton';
import VendorHeader from '../../components/VendorHeader';
import AppText from '../../components/AppText';
import { Dropdown } from 'react-native-element-dropdown';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectBusinessProfile,
  selectUser,
  setBusinessProfile,
  setUser,
} from '../../store/authSlice';
import { showToast, showToastError } from '../../components/Toast';
import { useTailorBusinessProfileMutation } from '../../Services/Auth';
import Feather from 'react-native-vector-icons/Feather';
import { launchImageLibrary } from 'react-native-image-picker';
import Fonts from '../../config/Fonts';

const { width } = Dimensions.get('window');
const GRID_ITEM_SIZE = (width - 48 - 28) / 3;

// const SERVICES_DATA = [
//   { label: 'Suit Stitching', value: 'Suit Stitching' },
//   { label: 'Alteration', value: 'Alteration' },
//   { label: 'Tuxedo Stitching', value: 'Tuxedo Stitching' },
//   { label: 'Shirt Tailoring', value: 'Shirt Tailoring' },
//   { label: 'Trouser Hemming', value: 'Trouser Hemming' },
// ];

const TailorBusinessProfile = ({ navigation }) => {
  const dispatch = useDispatch();
  const userProfile = useSelector(selectUser) || {};
  const businessProfile = useSelector(selectBusinessProfile) || {};

  let _businessName =
    businessProfile?.business_name?.trim() || userProfile?.name?.trim();
  let _email =
    businessProfile?.business_email?.trim() ||
    userProfile?.business_email?.trim();
  let _phone =
    businessProfile?.phone_number?.trim() || userProfile?.phone_number?.trim();
  let _city = businessProfile?.city?.trim() || userProfile?.city?.trim();
  let _address =
    businessProfile?.address?.trim() || userProfile?.address?.trim();
  let _experience =
    businessProfile?.experience?.trim() || userProfile?.experience?.trim();
  let _servicesOffered =
    businessProfile?.services?.trim() || userProfile?.services?.trim();
  let _about = businessProfile?.about || userProfile?.about;

  const [businessName, setBusinessName] = useState(_businessName);
  const [email, setEmail] = useState(_email);
  const [phone, setPhone] = useState(_phone);
  const [city, setCity] = useState(_city);
  const [address, setAddress] = useState(_address);
  const [experience, setExperience] = useState(_experience);
  const [servicesOffered, setServicesOffered] = useState(_servicesOffered);
  const [about, setAbout] = useState(_about);
  const user = useSelector(selectUser);
  // Portfolio gallery logic
  const getInitialPortfolioImages = useCallback(() => {
    const raw = userProfile?.portfolio_images || businessProfile?.portfolio_images;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string' && raw.trim() !== '') {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
      return [raw];
    }
    return [];
  }, [userProfile?.portfolio_images, businessProfile?.portfolio_images]);

  const [existingPortfolio, setExistingPortfolio] = useState(
    getInitialPortfolioImages(),
  );
  const [newPortfolioImages, setNewPortfolioImages] = useState([]);
  const [deletedPortfolioUrls, setDeletedPortfolioUrls] = useState([]);

  useEffect(() => {
    const initial = getInitialPortfolioImages();
    setExistingPortfolio(initial);
  }, [userProfile?.portfolio_images, businessProfile?.portfolio_images, getInitialPortfolioImages]);

  const [tailorBusinessProfile, { isLoading }] =
    useTailorBusinessProfileMutation();

  const handlePickPortfolioImages = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.5, selectionLimit: 0 },
      response => {
        if (response.didCancel) return;
        if (response.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
          return;
        }
        if (response.assets) {
          const picked = response.assets.map(asset => asset.uri);
          setNewPortfolioImages(prev => [...prev, ...picked]);
        }
      },
    );
  };

  const handleRemoveExisting = url => {
    setExistingPortfolio(prev => prev.filter(img => img !== url));
    setDeletedPortfolioUrls(prev => [...prev, url]);
  };

  const handleRemoveNew = uri => {
    setNewPortfolioImages(prev => prev.filter(item => item !== uri));
  };
  console.log('selectUser:-', user);
  const handleSave = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!businessName.trim()) {
      showToast('Validation Error', 'Business name cannot be empty.', 'error');
      return;
    }
    if (!email.trim()) {
      showToast('Validation Error', 'Email cannot be empty.', 'error');
      return;
    }
    if (!emailRegex.test(email.trim())) {
      showToast(
        'Validation Error',
        'Please enter a valid email address.',
        'error',
      );
      return;
    }
    if (!phone.trim()) {
      showToast('Validation Error', 'Phone number cannot be empty.', 'error');
      return;
    }
    if (!city.trim()) {
      showToast('Validation Error', 'City cannot be empty.', 'error');
      return;
    }
    if (!address.trim()) {
      showToast('Validation Error', 'Address cannot be empty.', 'error');
      return;
    }
    if (!experience.trim()) {
      showToast('Validation Error', 'Experience cannot be empty.', 'error');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('business_name', businessName.trim());
      formData.append('phone_number', phone.trim());
      formData.append('city', city.trim());
      formData.append('address', address.trim());
      formData.append('experience', experience.trim());
      // formData.append('services', servicesOffered.trim());
      formData.append('business_email', email.trim());
      formData.append('about', about.trim());

      if (deletedPortfolioUrls.length > 0) {
        formData.append(
          'delete_portfolio_images',
          JSON.stringify(deletedPortfolioUrls),
        );
      }

      newPortfolioImages.forEach((uri, idx) => {
        formData.append('portfolio_images[]', {
          uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
          name: `portfolio_${idx}_${Date.now()}.jpg`,
          type: 'image/jpeg',
        });
      });

      console.log('Saving Tailor Business Profile Form Data');
      const response = await tailorBusinessProfile(formData).unwrap();
      console.log('tailorBusinessProfile response:-', response);

      if (response?.success) {
        showToast(
          'Success',
          response?.message || 'Business profile updated successfully.',
          'success',
        );
        if (response?.data?.user) {
          dispatch(setUser({ ...user, is_business_profile: true }));
        }
        if (response?.data?.tailor) {
          dispatch(setBusinessProfile(response.data.tailor));
        }
        navigation.goBack();
      } else {
        showToast(
          'Error',
          response?.message || 'Failed to save tailor profile.',
          'error',
        );
      }
    } catch (err) {
      console.log('tailorBusinessProfile error:-', err);
      showToastError('Error', err);
    }
  };

  return (
    <View style={styles.safeArea}>
      <VendorHeader
        navigation={navigation}
        title="BUSINESS PROFILE"
        goBack={true}
        homeHeader={false}
        notification={false}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={10}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            <TextField
              label="Business Name"
              value={businessName}
              onChangeText={setBusinessName}
              placeholder="Business Name"
            />
            <TextField
              label="Business Email"
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              keyboardType="email-address"
              leftIcon="mail"
            />
            <TextField
              label="Number"
              value={phone}
              onChangeText={setPhone}
              placeholder="+123-456-7890"
              keyboardType="phone-pad"
            />
            <TextField
              label="City"
              value={city}
              onChangeText={setCity}
              placeholder="City"
            />
            <TextField
              label="Address"
              value={address}
              onChangeText={setAddress}
              placeholder="Address"
            />
            <TextField
              label="Experience In Years"
              value={experience}
              onChangeText={setExperience}
              placeholder="Experience"
              keyboardType="number-pad"
            />

            {/* Services Offered Dropdown */}
            {/* <View style={styles.dropdownContainer}>
              <AppText style={styles.dropdownLabel}>Services Offered</AppText>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                containerStyle={styles.dropdownMenuContainer}
                data={SERVICES_DATA}
                maxHeight={200}
                labelField="label"
                valueField="value"
                placeholder="Select Service"
                value={servicesOffered}
                onChange={item => setServicesOffered(item.value)}
              />
            </View> */}

            {/* About / Biography Section */}
            <TextField
              label="About / Bio"
              value={about}
              onChangeText={setAbout}
              placeholder="Tell clients about your tailoring studio, specialization, etc..."
              multiline={true}
              numberOfLines={4}
            />

            {/* Portfolio Images Section */}
            <View style={styles.portfolioContainer}>
              <AppText style={styles.dropdownLabel}>Portfolio Images</AppText>
              <View style={styles.portfolioGrid}>
                {existingPortfolio.map((url, idx) => (
                  <View key={`existing-${idx}`} style={styles.portfolioItem}>
                    <Image
                      source={{ uri: url }}
                      style={styles.portfolioImage}
                    />
                    <TouchableOpacity
                      style={styles.deleteBadge}
                      activeOpacity={0.8}
                      onPress={() => handleRemoveExisting(url)}
                    >
                      <Feather name="x" size={12} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                ))}

                {newPortfolioImages.map((uri, idx) => (
                  <View key={`new-${idx}`} style={styles.portfolioItem}>
                    <Image
                      source={{ uri: uri }}
                      style={styles.portfolioImage}
                    />
                    <TouchableOpacity
                      style={styles.deleteBadge}
                      activeOpacity={0.8}
                      onPress={() => handleRemoveNew(uri)}
                    >
                      <Feather name="x" size={12} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                ))}

                <TouchableOpacity
                  style={styles.addPortfolioBtn}
                  activeOpacity={0.8}
                  onPress={handlePickPortfolioImages}
                >
                  <Feather name="plus" size={24} color="#8A8A8F" />
                  <AppText style={styles.addBtnText}>Add Image</AppText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Save Changes"
            onPress={handleSave}
            hasArrow={true}
            loading={isLoading}
          />
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
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  form: {
    marginTop: 10,
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownLabel: {
    fontSize: 13,
    color: '#7C7C7C',
    marginBottom: 6,
    marginLeft: 4,
    fontFamily: Fonts.regular,
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
  buttonContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Colors.white,
  },
  portfolioContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  portfolioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  portfolioItem: {
    width: GRID_ITEM_SIZE,
    height: GRID_ITEM_SIZE,
    borderRadius: 10,
    marginHorizontal: 4,
    marginVertical: 4,
    position: 'relative',
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
  },
  portfolioImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  deleteBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  addPortfolioBtn: {
    width: GRID_ITEM_SIZE,
    height: GRID_ITEM_SIZE,
    borderRadius: 10,
    marginHorizontal: 4,
    marginVertical: 4,
    borderWidth: 1.5,
    borderColor: '#E2E2E2',
    borderStyle: 'dashed',
    backgroundColor: '#F8F9FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: {
    fontSize: 10,
    color: '#8A8A8F',
    marginTop: 4,
    fontFamily: Fonts.regular,
  },
});

export default TailorBusinessProfile;
