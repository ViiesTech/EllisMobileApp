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
import { selectUser, setUserProfile } from '../../store/authSlice';
import { showToast, showToastError } from '../../components/Toast';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTailorEditProfileMutation } from '../../Services/Auth';

const TailorEditProfile = ({ navigation }) => {
  const dispatch = useDispatch();
  const userProfile = useSelector(selectUser) || {};

  const [firstName, setFirstName] = useState(userProfile.name || '');
  const [lastName, setLastName] = useState(userProfile.last_name || '');
  const [email, setEmail] = useState(userProfile.email || '');
  const [imageUri, setImageUri] = useState(userProfile.profile_image || '');

  const [tailorEditProfile, { isLoading }] = useTailorEditProfileMutation();

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
    if (!email.trim()) {
      showToast('Validation Error', 'Email cannot be empty.', 'error');
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
        formData.append('profile_image', {
          uri:
            Platform.OS === 'android'
              ? imageUri
              : imageUri.replace('file://', ''),
          name: `profile_${Date.now()}.jpg`,
          type: 'image/jpeg',
        });
      }

      const response = await tailorEditProfile(formData).unwrap();
      console.log('tailorEditProfile response:-', response);

      if (response?.success) {
        showToast(
          'Success',
          response?.message || 'Profile changes saved successfully.',
          'success',
        );

        if (response?.data?.user) {
          dispatch(
            setUserProfile({
              ...userProfile,
              name: response.data.user.name || '',
              last_name: response.data.user.last_name || '',
              email: response.data.user.email || email.trim(),
              profile_image: response.data.user.profile_image,
            }),
          );
        }
        navigation.goBack();
      } else {
        showToast(
          'Error',
          response?.message || 'Failed to save profile changes.',
          'error',
        );
      }
    } catch (err) {
      console.log('tailorEditProfile error:-', err);
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
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
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
              placeholder="Liam"
            />
            <TextField
              label="Last Name"
              value={lastName}
              onChangeText={setLastName}
              placeholder="James"
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
            {/* <TextField
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry={true}
              leftIcon="lock"
            />
            <TextField
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="••••••••"
              secureTextEntry={true}
              leftIcon="lock"
            /> */}
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

export default TailorEditProfile;
