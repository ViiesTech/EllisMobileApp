import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  Modal,
  ActivityIndicator,
} from 'react-native';
import Colors from '../../config/Colors';
import AppText from '../../components/AppText';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, setClearStore } from '../../store/authSlice';
import VendorHeader from '../../components/VendorHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { useLogoutMutation } from '../../Services/Auth';
import { getFcmToken } from '../../config/Firebase';

const VendorProfile = ({ navigation }) => {
  const dispatch = useDispatch();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const userProfile = useSelector(selectUser) || {};

  // Modals are now separate screens, so we only need to dispatch actions and manage logout.
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              const fcmToken = await getFcmToken();
              await logout({ device_token: fcmToken || '' }).unwrap();
            } catch (err) {
              console.log('Logout API error:-', err);
            } finally {
              dispatch(setClearStore());
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const handleShowInfo = (title, message) => {
    Alert.alert(title, message, [{ text: 'OK' }]);
  };

  const menuItems = [
    {
      id: 'edit_profile',
      label: 'Edit Profile',
      action: () => {
        navigation.navigate('VendorEditProfile');
      },
    },
    {
      id: 'business_info',
      label: 'Business Information',
      action: () => {
        navigation.navigate('VendorBusinessProfile');
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

  console.log('userProfile:->', userProfile);
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
              source={{
                uri:
                  userProfile.profile_image ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
              }}
              style={styles.avatarImage}
            />
          </View>
          <AppText fontWeight="700" style={styles.userName}>
            {userProfile.name || 'Alex Charlie'}
          </AppText>
          <AppText style={styles.userEmail}>
            {userProfile.email || 'alexcharlie878@gmail.com'}
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
                fontWeight="500"
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.graybordercolor,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  closeBtn: {
    padding: 4,
  },
  modalForm: {
    marginBottom: 10,
  },
  saveBtn: {
    marginTop: 20,
    marginBottom: 10,
  },
  bankCardVisual: {
    backgroundColor: Colors.secondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  bankNameText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1.5,
  },
  accNumText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
    marginVertical: 14,
    letterSpacing: 2,
  },
  accHolderText: {
    fontSize: 13,
    color: Colors.Lightgray,
    fontWeight: '600',
  },
  loaderOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VendorProfile;
