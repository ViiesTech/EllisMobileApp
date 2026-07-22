import React, { useEffect } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import Colors from '../../config/Colors';
import AppText from '../../components/AppText';
import { AppImages } from '../../assets/images/AppImages';

const UnderReview = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }, 10000); // 10 seconds automatic redirect

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Vector Illustration */}
        <View style={styles.imageContainer}>
          <Image
            source={AppImages.underReview}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <View style={styles.textContainer}>
          <AppText style={styles.subHeader}>Your Profile is</AppText>
          <AppText style={styles.mainTitle}>Under Review</AppText>

          <AppText style={styles.description}>
            Your profile has been submitted & will be reviewed by our team.
            You will be notified if any extra information is needed.
          </AppText>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  imageContainer: {
    width: '100%',
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  illustration: {
    width: '90%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
  },
  subHeader: {
    fontSize: 24,
    fontFamily: 'serif',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 4,
  },
  mainTitle: {
    fontSize: 46,
    fontFamily: 'serif',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    color: '#4A5568',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
});

export default UnderReview;
