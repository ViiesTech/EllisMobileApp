import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { launchImageLibrary } from 'react-native-image-picker';
import Colors from '../../config/Colors';
import AppText from '../../components/AppText';
import VendorHeader from '../../components/VendorHeader';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  selectUser,
  setUserProfile,
  setClearStore,
  setUser,
} from '../../store/authSlice';

const TailorProfile = ({ navigation }) => {
  const dispatch = useDispatch();
  const userProfile = useSelector(selectUser) || {};

  const handlePickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, response => {
      if (response.didCancel) return;
      if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
        return;
      }
      if (response.assets && response.assets.length > 0) {
        dispatch(
          setUserProfile({
            ...userProfile,
            avatar: response.assets[0].uri,
          }),
        );
      }
    });
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: () => {
          dispatch(setClearStore());
          dispatch(setUser(null));
        },
      },
    ]);
  };

  const handleShowInfo = (title, message) => {
    Alert.alert(title, message, [{ text: 'OK' }]);
  };

  const menuItems = [
    {
      id: 'edit_profile',
      label: 'Edit Profile',
      action: () => {
        navigation.navigate('TailorEditProfile');
      },
    },
    {
      id: 'business_info',
      label: 'Business Information',
      action: () => {
        navigation.navigate('TailorBusinessProfile');
      },
    },
    {
      id: 'payment_bank',
      label: 'Payment & Bank',
      action: () => {
        navigation.navigate('BankAccount');
      },
    },
    {
      id: 'help_support',
      label: 'Help & Support',
      action: () =>
        handleShowInfo(
          'Help & Support',
          'For support inquiries, please contact us at support@ellisthreadmarks.com',
        ),
    },
    {
      id: 'privacy_policy',
      label: 'Privacy Policy',
      action: () => {
        navigation.navigate('PrivacyPolicy');
      },
    },
    {
      id: 'terms_conditions',
      label: 'Terms & Conditions',
      action: () => {
        navigation.navigate('TermsAndCoditions');
      },
    },
    { id: 'logout', label: 'Logout', action: handleLogout, isRed: true },
  ];

  return (
    <View style={styles.mainContainer}>
      <VendorHeader
        navigation={navigation}
        title="PROFILE"
        goBack={true}
        homeHeader={false}
        notification={false}
      />

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
                  userProfile.avatar ||
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
              }}
              style={styles.avatarImage}
            />
          </View>
          <AppText style={styles.userName}>
            {userProfile.name || 'Liam James'}
          </AppText>
          <AppText style={styles.userEmail}>
            {userProfile.email || 'liamjames878@gmail.com'}
          </AppText>
        </View>

        {/* Menu Items List */}
        <View style={styles.menuSection}>
          {menuItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuRow}
              activeOpacity={0.7}
              onPress={item.action}
            >
              <AppText
                style={[styles.menuLabel, item.isRed && styles.menuLabelRed]}
              >
                {item.label}
              </AppText>
              <Feather
                name="chevron-right"
                size={18}
                color={item.isRed ? Colors.red : Colors.secondary}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F5F5F5',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#7C7C7C',
    textAlign: 'center',
  },
  menuSection: {
    paddingHorizontal: 24,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  menuLabelRed: {
    color: Colors.red,
  },
});

export default TailorProfile;
