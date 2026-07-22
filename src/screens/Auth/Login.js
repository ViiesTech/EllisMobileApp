import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Colors from '../../config/Colors';
import TextField from '../../components/TextField';
import CustomButton from '../../components/CustomButton';
import AppText from '../../components/AppText';
import { useDispatch } from 'react-redux';
import { setToken } from '../../store/authSlice';

const Login = ({ navigation }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      dispatch(setToken('auth_token_active'));
    }, 600);
  };

  return (
    <View style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title */}
        <View style={styles.header}>
          <AppText style={styles.title}>Login</AppText>
        </View>

        {/* Inputs */}
        <View style={styles.form}>
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

          <TouchableOpacity
            style={styles.forgotBtn}
            onPress={() => navigation.navigate('Forgot_password')}
            activeOpacity={0.7}
          >
            <AppText style={styles.forgotText}>Forgot password?</AppText>
          </TouchableOpacity>
        </View>

        {/* Bottom Button */}
        <View style={styles.bottomArea}>
          <CustomButton title="Login" onPress={handleLogin} loading={loading} />

          <View style={styles.signupRow}>
            <AppText style={styles.noAccountText}>
              Don't have an Account?{' '}
            </AppText>
            <TouchableOpacity
              onPress={() => navigation.navigate('SignUp')}
              activeOpacity={0.7}
            >
              <AppText style={styles.signupLink}>SignUp</AppText>
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
    marginTop: 80,
    marginBottom: 40,
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
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: 4,
    marginBottom: 20,
  },
  forgotText: {
    fontSize: 14,
    fontFamily: 'serif',
    fontWeight: '700',
    color: '#000000',
  },
  bottomArea: {
    marginTop: 40,
    width: '100%',
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  noAccountText: {
    fontSize: 14,
    color: '#4A5568',
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'serif',
    color: '#000000',
    // textDecorationLine: 'underline',
  },
});

export default Login;
