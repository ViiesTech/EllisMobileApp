import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Colors from '../../config/Colors';
import AppText from '../../components/AppText';
import VendorHeader from '../../components/VendorHeader';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { selectUser, setClearStore, setUser, setBusinessProfile } from '../../store/authSlice';
import { useGetTailorProfileQuery } from '../../Services/TailorServices';
import { useLogoutMutation } from '../../Services/Auth';
import { getFcmToken } from '../../config/Firebase';

const TailorProfile = ({ navigation }) => {
  const dispatch = useDispatch();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const userProfile = useSelector(selectUser) || {};

  const { data, refetch } = useGetTailorProfileQuery();

  useEffect(() => {
    if (data?.success && data?.data) {
      if (data.data.user) {
        dispatch(setUser(data.data.user));
      }
      if (data.data.tailor) {
        dispatch(setBusinessProfile(data.data.tailor));
      }
    }
  }, [data, dispatch]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetch();
    });
    return unsubscribe;
  }, [navigation, refetch]);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            const fcmToken = await getFcmToken();
            await logout({ device_token: fcmToken || '' }).unwrap();
          } catch (err) {
            console.log('Logout API error:-', err);
          } finally {
            dispatch(setClearStore());
            dispatch(setUser(null));
          }
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
      id: 'change_password',
      label: 'Change Password',
      action: () => {
        navigation.navigate('ChangePassword');
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
      <Modal transparent visible={isLoggingOut} animationType="none">
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color={Colors.primary || '#DBA83A'} />
        </View>
      </Modal>

      <VendorHeader navigation={navigation} title="PROFILE" goBack={false} />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Avatar section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <Image
              style={styles.avatarImage}
              source={{
                uri:
                  userProfile.profile_image ||
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
              }}
            />
          </View>
          <AppText style={styles.userName}>{userProfile.name}</AppText>
          <AppText style={styles.userEmail}>{userProfile.email}</AppText>
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
  loaderOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TailorProfile;
