import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Colors from '../config/Colors';
import Fonts from '../config/Fonts';
import AppText from './AppText';
import Feather from 'react-native-vector-icons/Feather';

export const TextField = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  multiline,
  numberOfLines,
  error,
  leftIcon,
  style,
  inputStyle,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <AppText style={styles.label}>{label}</AppText>}
      <View
        style={[
          styles.inputBox,
          multiline && {
            height: 80,
            borderRadius: 16,
            alignItems: 'flex-start',
            paddingTop: 12,
          },
          error && styles.errorInput,
          containerStyle,
        ]}
      >
        {leftIcon && (
          <Feather
            name={leftIcon}
            size={18}
            color="#8E8E93"
            style={styles.leftIcon}
          />
        )}
        <TextInput
          style={[
            styles.input,
            multiline && { textAlignVertical: 'top' },
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#A3A3A3"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
        />
      </View>
      {error && <AppText style={styles.errorText}>{error}</AppText>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '400',
    color: '#7C7C7C',
    marginBottom: 6,
    marginLeft: 4,
  },
  inputBox: {
    height: 52,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderRadius: 26,
    paddingHorizontal: 18,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    paddingVertical: 0,
    fontFamily: Fonts.regular,
  },
  errorInput: {
    borderColor: Colors.red,
  },
  errorText: {
    fontSize: 12,
    color: Colors.red,
    marginTop: 4,
    marginLeft: 6,
  },
});

export default TextField;
