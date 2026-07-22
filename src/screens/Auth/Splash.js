import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Colors from '../../config/Colors';
import { AppImages } from '../../assets/images/AppImages';

const Splash = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('OnBoarding');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={AppImages.logo} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: 230,
    width: '100%',
    resizeMode: 'contain',
  },
});

export default Splash;
