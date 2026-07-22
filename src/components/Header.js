import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Colors from '../config/Colors';
import AppText from './AppText';
import { selectRole, setRole } from '../store/authSlice';

export const Header = ({ title, showBack, onBack, rightElement }) => {
  const dispatch = useDispatch();
  const role = useSelector(selectRole);
  const [modalVisible, setModalVisible] = useState(false);

  const getRoleLabel = () => {
    switch (role) {
      case 'VENDOR': return 'Vendor Mode';
      case 'TAILOR': return 'Tailor Mode';
      default: return 'User Mode';
    }
  };

  const getRoleColor = () => {
    switch (role) {
      case 'VENDOR': return '#2196F3';
      case 'TAILOR': return '#9C27B0';
      default: return Colors.primary;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        {showBack && (
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <AppText style={styles.backText}>‹</AppText>
          </TouchableOpacity>
        )}
        <AppText style={styles.title} numberOfLines={1}>{title || 'Ellis'}</AppText>
      </View>

      <View style={styles.rightRow}>
        {rightElement}
        <TouchableOpacity
          style={[styles.roleBadge, { borderColor: getRoleColor() }]}
          onPress={() => setModalVisible(true)}
        >
          <View style={[styles.dot, { backgroundColor: getRoleColor() }]} />
          <AppText style={[styles.roleText, { color: getRoleColor() }]}>
            {getRoleLabel()}
          </AppText>
        </TouchableOpacity>
      </View>

      {/* Role Switcher Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBg}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalCard}>
            <AppText style={styles.modalTitle}>Select Active Persona</AppText>
            <AppText style={styles.modalSub}>Switch view to explore different user flows in Alpha preview.</AppText>

            <TouchableOpacity
              style={[
                styles.optionBtn,
                role === 'USER' && styles.optionSelected,
              ]}
              onPress={() => {
                dispatch(setRole('USER'));
                setModalVisible(false);
              }}
            >
              <AppText style={styles.optionIcon}>👤</AppText>
              <View style={{ flex: 1 }}>
                <AppText style={styles.optionTitle}>Customer / User Flow</AppText>
                <AppText style={styles.optionDesc}>Browse suits, order fabrics, book custom tailors.</AppText>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionBtn,
                role === 'VENDOR' && styles.optionSelected,
              ]}
              onPress={() => {
                dispatch(setRole('VENDOR'));
                setModalVisible(false);
              }}
            >
              <AppText style={styles.optionIcon}>🏬</AppText>
              <View style={{ flex: 1 }}>
                <AppText style={styles.optionTitle}>Vendor Flow</AppText>
                <AppText style={styles.optionDesc}>Sell fabrics & readymade suits, manage store orders.</AppText>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionBtn,
                role === 'TAILOR' && styles.optionSelected,
              ]}
              onPress={() => {
                dispatch(setRole('TAILOR'));
                setModalVisible(false);
              }}
            >
              <AppText style={styles.optionIcon}>✂️</AppText>
              <View style={{ flex: 1 }}>
                <AppText style={styles.optionTitle}>Tailor Flow</AppText>
                <AppText style={styles.optionDesc}>Manage doorstep tailoring, bookings & stitching services.</AppText>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.graybordercolor,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backBtn: {
    paddingRight: 12,
  },
  backText: {
    fontSize: 28,
    color: Colors.secondary,
    fontWeight: '300',
    marginTop: -4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.secondary,
    letterSpacing: 0.5,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1.5,
    backgroundColor: Colors.whitebackgroundcolor,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.secondary,
    marginBottom: 4,
  },
  modalSub: {
    fontSize: 13,
    color: Colors.lightblack,
    marginBottom: 16,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.graybordercolor,
    marginBottom: 10,
    backgroundColor: Colors.textinputboxcolor,
  },
  optionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.whitebackgroundcolor,
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.secondary,
  },
  optionDesc: {
    fontSize: 12,
    color: Colors.lightblack,
    marginTop: 2,
  },
});

export default Header;
