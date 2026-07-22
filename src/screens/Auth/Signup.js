import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Colors from '../../config/Colors';
import TextField from '../../components/TextField';
import CustomButton from '../../components/CustomButton';
import AppText from '../../components/AppText';

const Signup = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = () => {
    navigation.navigate('VerifyOTP');
  };

  return (
    <View style={styles.safeArea}>
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
            onChangeText={setFirstName}
            placeholder="Alex"
          />

          <TextField
            label="Last Name"
            value={lastName}
            onChangeText={setLastName}
            placeholder="Charlie"
          />

          <TextField
            label="Email"
            leftIcon="mail"
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextField
            label="Password"
            leftIcon="lock"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
          />

          <TextField
            label="Confirm Password"
            leftIcon="lock"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="••••••••"
            secureTextEntry
          />
        </View>

        {/* Bottom Button */}
        <View style={styles.bottomArea}>
          <CustomButton title="Create Account" onPress={handleSignUp} />

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
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
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
});

export default Signup;
