import React from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Platform,
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import Colors from '../../config/Colors';
import { AppImages } from '../../assets/images/AppImages';
import AppText from '../../components/AppText';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    key: '1',
    title: 'Perfect Fit\nEvery Time',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    image: AppImages.onb1,
  },
  {
    key: '2',
    title: 'Dress With\nConfidence',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    image: AppImages.onb2,
  },
  {
    key: '3',
    title: 'We\nCome To You',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    image: AppImages.onb3,
  },
];

const OnBoarding = ({ navigation }) => {
  const handleFinish = () => {
    navigation.replace('TypeSelection');
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <ImageBackground
          source={item.image}
          style={styles.bgImage}
          resizeMode="cover"
        >
          <View style={styles.overlay}>
            <View style={styles.contentContainer}>
              <AppText style={styles.title}>
                {item.title}
              </AppText>
              <AppText style={styles.description}>{item.description}</AppText>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  };

  const renderNextButton = () => (
    <View style={styles.btnContainer}>
      <AppText style={styles.btnText}>NEXT</AppText>
    </View>
  );

  const renderSkipButton = () => (
    <View style={styles.btnContainer}>
      <AppText style={styles.btnText}>SKIP</AppText>
    </View>
  );

  const renderDoneButton = () => (
    <View style={styles.btnContainer}>
      <AppText style={styles.btnText}>NEXT</AppText>
    </View>
  );

  return (
    <View style={styles.container}>
      <AppIntroSlider
        data={slides}
        renderItem={renderItem}
        onDone={handleFinish}
        onSkip={handleFinish}
        showSkipButton={true}
        renderNextButton={renderNextButton}
        renderSkipButton={renderSkipButton}
        renderDoneButton={renderDoneButton}
        activeDotStyle={styles.activeDot}
        dotStyle={styles.dot}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  slide: {
    width: width,
    height: height,
  },
  bgImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 110,
  },
  contentContainer: {
    maxWidth: '90%',
  },
  title: {
    fontSize: 38,
    fontFamily: 'serif',
    color: Colors.white,
    lineHeight: 46,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'javanese',
    color: 'rgba(255, 255, 255, 0.82)',
    marginTop: 18,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  btnContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
    letterSpacing: 1.5,
  },
  dot: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Colors.white,
    width: 22,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default OnBoarding;
