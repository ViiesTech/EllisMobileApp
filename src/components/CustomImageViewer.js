import React, { useRef, useEffect } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AppText from './AppText';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CustomImageViewer = ({ visible, images, imageIndex, onClose, onImageIndexChange }) => {
  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (visible && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ x: imageIndex * screenWidth, animated: false });
      }, 50);
    }
  }, [visible, imageIndex]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header with Page Indicator and Close Button */}
        <View style={styles.header}>
          <AppText style={styles.pageText}>
            {imageIndex + 1} / {images.length}
          </AppText>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
            <Feather name="x" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Scrollable Images */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const contentOffset = e.nativeEvent.contentOffset;
            const index = Math.round(contentOffset.x / screenWidth);
            if (onImageIndexChange) {
              onImageIndexChange(index);
            }
          }}
          maximumZoomScale={Platform.OS === 'ios' ? 3 : 1}
          minimumZoomScale={1}
          style={styles.scrollView}
        >
          {images.map((img, idx) => (
            <View key={idx} style={styles.slide}>
              <Image
                source={{ uri: img }}
                style={styles.largeImage}
                resizeMode="contain"
              />
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  pageText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    width: screenWidth,
  },
  slide: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeImage: {
    width: screenWidth,
    height: screenHeight * 0.75,
  },
});

export default CustomImageViewer;
