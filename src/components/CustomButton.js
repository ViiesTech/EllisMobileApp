import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import Colors from '../config/Colors';
import AppText from './AppText';
import Entypo from 'react-native-vector-icons/Entypo';

export const CustomButton = ({
  title,
  onPress,
  variant = 'primary',
  style,
  textStyle,
  disabled,
  loading,
  hasArrow = true,
}) => {
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        isPrimary ? styles.primaryBtn : styles.outlineBtn,
        disabled && styles.disabledBtn,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={Colors.black} />
      ) : (
        <View style={styles.contentRow}>
          <AppText
            style={[
              styles.text,
              isPrimary ? styles.primaryText : styles.outlineText,
              textStyle,
            ]}
          >
            {title}
          </AppText>
          {hasArrow && isPrimary && (
            <Entypo
              name="chevron-right"
              size={20}
              color="#000000"
              style={styles.arrow}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },
  primaryBtn: {
    backgroundColor: '#DBA83A',
  },
  outlineBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#DBA83A',
  },
  disabledBtn: {
    opacity: 0.55,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
  },
  text: {
    fontSize: 16,
    fontFamily: 'serif',
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  primaryText: {
    color: '#000000',
  },
  outlineText: {
    color: '#DBA83A',
  },
  arrow: {
    position: 'absolute',
    right: 4,
  },
});

export default CustomButton;
