import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import Colors from '../../config/Colors';
import TextField from '../../components/TextField';
import CustomButton from '../../components/CustomButton';
import VendorHeader from '../../components/VendorHeader';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, setUser } from '../../store/authSlice';
import { showToast, showToastError } from '../../components/Toast';
import { useVendorUpdateProfileMutation } from '../../Services/Auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';

const VendorEditProfile = ({ navigation }) => {
  const dispatch = useDispatch();
  const userProfile = useSelector(selectUser) || {};
  const [vendorUpdateProfile, { isLoading }] = useVendorUpdateProfileMutation();

  const [firstName, setFirstName] = useState(userProfile?.name);
  const [lastName, setLastName] = useState(userProfile?.last_name);
  const [email, setEmail] = useState(userProfile.email);
  const [imageUri, setImageUri] = useState(userProfile.profile_image || '');

  const handlePickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, response => {
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

  const handleSave = async () => {
    if (!firstName.trim()) {
      showToast('Validation Error', 'First name cannot be empty.', 'error');
      return;
    }
    if (!lastName.trim()) {
      showToast('Validation Error', 'Last name cannot be empty.', 'error');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', firstName.trim());
      formData.append('last_name', lastName.trim());

      if (
        imageUri &&
        !imageUri.startsWith('http') &&
        !imageUri.startsWith('https')
      ) {
        const uriParts = imageUri.split('/');
        const fileName = uriParts[uriParts.length - 1] || 'profile.jpg';
        formData.append('profile_image', {
          uri:
            Platform.OS === 'android'
              ? imageUri
              : imageUri.replace('file://', ''),
          name: fileName,
          type: 'image/jpeg',
        });
      }

      const response = await vendorUpdateProfile(formData).unwrap();
      console.log('vendorUpdateProfile response:-', response);

      if (response?.success) {
        showToast(
          'Success',
          response?.message || 'Profile changes saved successfully.',
          'success',
        );

        const updatedUser = response?.data?.user;

        // Build new user profile object for Redux store
        const newUserObj = {
          ...userProfile,
          name: updatedUser?.name,
          last_name: updatedUser?.last_name,
          profile_image: updatedUser?.profile_image,
        };

        dispatch(setUser(newUserObj));
        navigation.goBack();
      } else {
        showToast(
          'Error',
          response?.message || 'Profile update failed',
          'error',
        );
      }
    } catch (err) {
      console.log('vendorUpdateProfile error:-', err);
      showToastError('Error', err);
    }
  };

  return (
    <View style={styles.safeArea}>
      <VendorHeader
        navigation={navigation}
        title="EDIT PROFILE"
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
          {/* Profile Avatar section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{
                  uri:
                    imageUri ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
                }}
                style={styles.avatarImage}
              />
              <TouchableOpacity
                style={styles.editBadge}
                activeOpacity={0.8}
                onPress={handlePickImage}
              >
                <Ionicons name="pencil" size={14} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.form}>
            <TextField
              label="First Name"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Alex"
            />
            <TextField
              label="Last Name"
              value={lastName}
              onChangeText={setLastName}
              placeholder="Charlie"
            />
            <TextField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              keyboardType="email-address"
              leftIcon="mail"
              editable={false}
            />
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
  avatarSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F5F5F5',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  form: {
    marginTop: 10,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 0,
    elevation: 0,
  },
});

export default VendorEditProfile;
