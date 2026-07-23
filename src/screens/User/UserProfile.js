import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import Colors from '../../config/Colors';
import AppText from '../../components/AppText';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, setClearStore, setUser } from '../../store/authSlice';
import Feather from 'react-native-vector-icons/Feather';
import VendorHeader from '../../components/VendorHeader';

const UserProfile = ({ navigation }) => {
  const dispatch = useDispatch();
  const userProfile = useSelector(selectUser) || {};

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
        navigation.navigate('UserEditProfile');
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
    <View style={styles.safeArea}>
      <VendorHeader
        navigation={navigation}
        title="PROFILE"
        goBack={false}
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
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
              }}
              style={styles.avatarImage}
            />
          </View>
          <AppText style={styles.userName}>
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
                style={[styles.menuLabel, item.isRed && styles.menuLabelRed]}
              >
                {item.label}
              </AppText>
              {!item.isRed && (
                <Feather name="chevron-right" size={18} color="#C7C7CC" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
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
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
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
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    marginTop: 16,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  userEmail: {
    fontSize: 14,
    color: '#8A8A8F',
    marginTop: 4,
  },
  menuSection: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#F2F2F7',
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  menuLabel: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  menuLabelRed: {
    color: '#FF3B30',
    fontWeight: '600',
  },
});

export default UserProfile;
