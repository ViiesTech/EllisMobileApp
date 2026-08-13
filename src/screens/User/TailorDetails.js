import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import AppText from '../../components/AppText';
import Feather from 'react-native-vector-icons/Feather';
import VendorHeader from '../../components/VendorHeader';
import Fonts from '../../config/Fonts';

const TailorDetails = ({ route, navigation }) => {
  const tailor = route.params?.tailor;
  const tailorServices = tailor.services;
  const [selectedService, setSelectedService] = useState(tailorServices[0]);
  const email = tailor.email;
  const displayName = `${tailor.name} ${tailor.last_name}`;
  const imageUrl = tailor.profile_image_url;

  // console.log('selectedService:-', selectedService);
  console.log('tailor:-', tailor);

  const getPortfolioImages = () => {
    const raw = tailor.portfolio_images;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string' && raw.trim() !== '') {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        // Not a JSON string
      }
      return [raw];
    }
    return [];
  };
  const portfolioImages = getPortfolioImages();
  return (
    <View style={styles.safeArea}>
      <VendorHeader
        navigation={navigation}
        title="TAILOR DETAILS"
        goBack={true}
        homeHeader={false}
        notification={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.body}>
          {/* Profile Card Section */}
          <View style={styles.profileSection}>
            <Image source={{ uri: imageUrl }} style={styles.avatar} />
            <View style={styles.profileTextCol}>
              <AppText style={styles.name}>{displayName}</AppText>
              <AppText style={styles.email}>{email}</AppText>
            </View>
          </View>

          {/* About Section */}
          <AppText style={styles.sectionHeader}>ABOUT</AppText>
          <AppText style={styles.bio}>
            {tailor.bio ||
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.'}
          </AppText>

          {/* Experience Section */}
          <AppText style={styles.sectionHeader}>EXPERIENCE</AppText>
          <AppText style={styles.experienceText}>
            {tailor.experience
              ? tailor.experience.replace(/[^0-9]/g, '') + ' Years'
              : '08 Years'}
          </AppText>

          {/* Portfolio Section */}
          {portfolioImages.length > 0 && (
            <>
              <AppText style={styles.sectionHeader}>PORTFOLIO</AppText>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.portfolioScroll}
              >
                {portfolioImages.map((imgUrl, index) => (
                  <View key={index} style={styles.portfolioImageWrapper}>
                    <Image
                      source={{ uri: imgUrl }}
                      style={styles.portfolioImage}
                    />
                  </View>
                ))}
              </ScrollView>
            </>
          )}

          {/* Services Section */}
          <AppText style={styles.sectionHeader}>SERVICES</AppText>
          <View style={styles.servicesRow}>
            {tailorServices.map(svc => {
              const isSelected = selectedService?.id === svc.id;
              return (
                <TouchableOpacity
                  key={svc.id}
                  style={[
                    styles.serviceChip,
                    isSelected && styles.serviceChipSelected,
                  ]}
                  onPress={() => setSelectedService(svc)}
                  activeOpacity={0.85}
                >
                  <AppText
                    style={[
                      styles.serviceChipText,
                      isSelected && styles.serviceChipTextSelected,
                    ]}
                  >
                    {svc.name}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Selected Service Detail Info Box */}
          {selectedService && (
            <View style={styles.detailInfoBox}>
              <AppText style={styles.detailTitle}>
                {'Service Name : ' + selectedService.name}
              </AppText>
              <AppText style={styles.detailCategory}>
                {'Service Category : ' + selectedService.category}
              </AppText>
              <AppText style={styles.detailDesc}>
                {'Service Description : ' + selectedService.description}
              </AppText>
              <View style={styles.detailMetaRow}>
                <View style={styles.metaLabelRow}>
                  <Feather
                    name="clock"
                    size={13}
                    color="#DBA83A"
                    style={{ marginRight: 5 }}
                  />
                  <AppText style={styles.detailTime}>
                    Estimated Time: {selectedService.time || '3-5 Days'}
                  </AppText>
                </View>
                <AppText style={styles.detailPrice}>
                  ${selectedService.price}
                </AppText>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Select Style Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bookBtn}
          activeOpacity={0.9}
          onPress={() =>
            navigation.navigate('Measurement', {
              tailor,
              service: selectedService,
            })
          }
        >
          <AppText style={styles.bookBtnText}>Continue</AppText>
          <Feather
            name="arrow-right"
            size={20}
            color="#000000"
            style={styles.bookBtnArrow}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 50 : 15,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FD',
  },
  backBtnPlaceholder: {
    width: 40,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginTop: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#EAEAEA',
  },
  diamond: {
    width: 6,
    height: 6,
    borderWidth: 1,
    borderColor: '#DBA83A',
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
    marginHorizontal: 8,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  body: {
    padding: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 5,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  profileTextCol: {
    flex: 1,
    marginLeft: 18,
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  email: {
    fontSize: 14,
    color: '#8A8A8F',
    marginTop: 4,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: 2,
    fontFamily: Fonts.regular,
    marginTop: 22,
    marginBottom: 10,
  },
  bio: {
    fontSize: 14,
    color: '#5D5D5D',
    lineHeight: 22,
  },
  experienceText: {
    fontSize: 14,
    color: '#5D5D5D',
    fontWeight: '500',
  },
  servicesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  serviceChip: {
    backgroundColor: '#DBA83A', // Brand Mustard Gold
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 4,
    marginVertical: 4,
  },
  serviceChipSelected: {
    backgroundColor: '#000000', // Selected is Black
  },
  serviceChipText: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '700',
  },
  serviceChipTextSelected: {
    color: '#DBA83A', // Selected text is Gold
  },
  detailInfoBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    marginTop: 18,
    shadowColor: '#000000',
    shadowOpacity: 0.02,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  detailTitle: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#1A1A1A',
    fontWeight: '700',
  },
  detailCategory: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: '#8A8A8F',
    paddingTop: 5,
  },
  detailDesc: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: '#5D5D5D',
    marginTop: 6,
    lineHeight: 19,
  },
  detailMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F2',
  },
  metaLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailTime: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: '#8A8A8F',
  },
  detailPrice: {
    fontSize: 17,
    fontFamily: Fonts.bold,
    color: '#DBA83A',
    fontWeight: '700',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
  },
  bookBtn: {
    backgroundColor: '#DBA83A', // Brand Mustard Gold
    height: 52,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  bookBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  bookBtnArrow: {
    position: 'absolute',
    right: 18,
  },
  portfolioScroll: {
    paddingRight: 20,
    marginBottom: 6,
  },
  portfolioImageWrapper: {
    marginRight: 12,
  },
  portfolioImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    backgroundColor: '#F8F9FD',
  },
});

export default TailorDetails;
