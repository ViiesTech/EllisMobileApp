import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Colors from '../../config/Colors';
import TextField from '../../components/TextField';
import CustomButton from '../../components/CustomButton';
import AppText from '../../components/AppText';
import { Dropdown } from 'react-native-element-dropdown';
import { useSignupMutation } from '../../Services/Auth';
import { showToast, showToastError } from '../../components/Toast';
import { useSelector } from 'react-redux';
import { selectRole } from '../../store/authSlice';

const ROLES_DATA = [
  { label: 'User', value: '2' },
  { label: 'Vendor', value: '3' },
  { label: 'Tailor', value: '4' },
];

const Signup = ({ navigation }) => {
  const [signup, { isLoading }] = useSignupMutation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setSelectedRole] = useState('');
  const [errors, setErrors] = useState({});
  const roleType = useSelector(selectRole);
  console.log('roleTypee:-', roleType);

  useEffect(() => {
    if (roleType) {
      const type = roleType.toUpperCase();
      if (type === 'USER') {
        setSelectedRole('2');
      } else if (type === 'VENDOR') {
        setSelectedRole('3');
      } else if (type === 'TAILOR') {
        setSelectedRole('4');
      }
    }
  }, [roleType]);

  const validate = () => {
    let valid = true;
    let newErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
      valid = false;
    } else if (firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
      valid = false;
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      valid = false;
    } else if (lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
      valid = false;
    }

    if (!role) {
      newErrors.role = 'Please select a role';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
      valid = false;
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSignUp = async () => {
    if (validate()) {
      try {
        const payload = {
          name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
          password: password,
          password_confirmation: confirmPassword,
          role_id: Number(role),
        };
        console.log('payload:-', payload);
        const response = await signup(payload).unwrap();
        console.log('Signup response:-', response);

        if (response?.success) {
          showToast(
            'Success',
            response?.message || 'Verification code sent successfully',
            'success',
          );
          navigation.navigate('VerifyOTP', {
            email: email.trim(),
            payload: payload,
          });
        } else {
          showToast(
            'Error',
            response?.message || 'Registration failed',
            'error',
          );
        }
      } catch (err) {
        console.log('Signup error:-', err);
        showToastError('Signup Failed', err);
      }
    }
  };

  return (
    <View style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title */}
          <View style={styles.header}>
            <AppText style={styles.title}>Sign Up</AppText>
          </View>

          {/* Inputs */}
          <View style={styles.form}>
            <TextField
              label="First Name"
              value={firstName}
              onChangeText={text => {
                setFirstName(text);
                if (errors.firstName) {
                  setErrors(prev => ({ ...prev, firstName: null }));
                }
              }}
              placeholder="Alex"
              error={errors.firstName}
            />

            <TextField
              label="Last Name"
              value={lastName}
              onChangeText={text => {
                setLastName(text);
                if (errors.lastName) {
                  setErrors(prev => ({ ...prev, lastName: null }));
                }
              }}
              placeholder="Charlie"
              error={errors.lastName}
            />

            <TextField
              label="Email"
              leftIcon="mail"
              value={email}
              onChangeText={text => {
                setEmail(text);
                if (errors.email) {
                  setErrors(prev => ({ ...prev, email: null }));
                }
              }}
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            {/* Role Dropdown */}
            <View style={styles.dropdownContainer}>
              <AppText style={styles.dropdownLabel}>Role</AppText>
              <Dropdown
                style={[styles.dropdown, errors.role && styles.errorDropdown]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                containerStyle={styles.dropdownContainerStyle}
                data={ROLES_DATA}
                maxHeight={200}
                labelField="label"
                valueField="value"
                placeholder="Select Role"
                value={role}
                onChange={item => {
                  setSelectedRole(item.value);
                  if (errors.role) {
                    setErrors(prev => ({ ...prev, role: null }));
                  }
                }}
              />
              {errors.role && (
                <AppText style={styles.errorText}>{errors.role}</AppText>
              )}
            </View>

            <TextField
              label="Password"
              leftIcon="lock"
              value={password}
              onChangeText={text => {
                setPassword(text);
                if (errors.password) {
                  setErrors(prev => ({ ...prev, password: null }));
                }
              }}
              placeholder="••••••••"
              secureTextEntry
              error={errors.password}
            />

            <TextField
              label="Confirm Password"
              leftIcon="lock"
              value={confirmPassword}
              onChangeText={text => {
                setConfirmPassword(text);
                if (errors.confirmPassword) {
                  setErrors(prev => ({ ...prev, confirmPassword: null }));
                }
              }}
              placeholder="••••••••"
              secureTextEntry
              error={errors.confirmPassword}
            />
          </View>

          {/* Bottom Button */}
          <View style={styles.bottomArea}>
            <CustomButton
              title="Create Account"
              onPress={handleSignUp}
              loading={isLoading}
            />

            <View style={styles.loginRow}>
              <AppText style={styles.alreadyText}>
                Already have an account?{' '}
              </AppText>
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                activeOpacity={0.7}
              >
                <AppText style={styles.loginLink}>Login</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
  container: {
    flexGrow: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 48,
    fontFamily: 'serif',
    color: '#000000',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownLabel: {
    fontSize: 13,
    color: '#7C7C7C',
    marginBottom: 6,
    marginLeft: 4,
  },
  dropdown: {
    height: 52,
    borderColor: '#E2E2E2',
    borderWidth: 1,
    borderRadius: 26,
    paddingHorizontal: 18,
    backgroundColor: Colors.white,
  },
  errorDropdown: {
    borderColor: Colors.red,
  },
  placeholderStyle: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#000000',
  },
  errorText: {
    fontSize: 12,
    color: Colors.red,
    marginTop: 4,
    marginLeft: 6,
  },
  bottomArea: {
    marginTop: 30,
    width: '100%',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  alreadyText: {
    fontSize: 14,
    color: '#4A5568',
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'serif',
  },
  dropdownContainerStyle: {
    borderColor: '#E2E2E2',
    borderWidth: 1,
    borderRadius: 12,
    top: -25,
  },
});

export default Signup;
