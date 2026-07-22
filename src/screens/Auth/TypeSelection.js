import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setRole, selectRole } from '../../store/authSlice';
import Colors from '../../config/Colors';
import AppText from '../../components/AppText';
import Entypo from 'react-native-vector-icons/Entypo';

const ROLES = [
  { key: 'USER', label: 'User' },
  { key: 'VENDOR', label: 'Vendor' },
  { key: 'TAILOR', label: 'Tailor' },
];

const TypeSelection = ({ navigation }) => {
  const dispatch = useDispatch();
  const currentRole = useSelector(selectRole);
  const [selected, setSelected] = useState(currentRole || 'USER');

  const handleConfirm = () => {
    dispatch(setRole(selected));
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Title */}
        <AppText style={styles.title}>
          Select Role
        </AppText>

        {/* Role Options */}
        <View style={styles.optionsContainer}>
          {ROLES.map(role => {
            const isSelected = selected === role.key;
            return (
              <TouchableOpacity
                key={role.key}
                style={styles.optionWrapper}
                onPress={() => setSelected(role.key)}
                activeOpacity={0.8}
              >
                <View style={styles.cardBox}>
                  <AppText style={styles.optionLabel}>
                    {role.label}
                  </AppText>
                </View>
                <View
                  style={[
                    styles.badge,
                    isSelected ? styles.badgeActive : styles.badgeInactive,
                  ]}
                >
                  {isSelected && <AppText style={styles.checkmark}>✓</AppText>}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={handleConfirm}
          activeOpacity={0.85}
        >
          <AppText style={styles.btnText}>Continue</AppText>
          {/* <AppText style={styles.btnArrow}>→</AppText> */}
          <Entypo
            name="chevron-right"
            size={20}
            color={Colors.black}
            style={styles.btnArrow}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 30,
  },
  title: {
    fontSize: 40,
    fontFamily: 'serif',
    fontWeight: '400',
    color: '#000000',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  optionsContainer: {
    width: '100%',
    paddingHorizontal: 12,
  },
  optionWrapper: {
    marginBottom: 24,
    justifyContent: 'center',
    position: 'relative',
    paddingLeft: 18,
  },
  cardBox: {
    height: 66,
    borderWidth: 1.2,
    borderColor: '#1E1E1E',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    paddingLeft: 46,
  },
  badge: {
    position: 'absolute',
    left: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  badgeActive: {
    backgroundColor: '#DBA83A',
  },
  badgeInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 5,
    borderColor: '#DBA83A',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: -2,
  },
  optionLabel: {
    fontSize: 24,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#000000',
    fontWeight: '400',
  },
  continueBtn: {
    height: 56,
    backgroundColor: '#DBA83A',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginHorizontal: 4,
    position: 'relative',
  },
  btnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  btnArrow: {
    position: 'absolute',
    right: 20,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
  },
});

export default TypeSelection;
