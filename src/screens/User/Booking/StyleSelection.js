import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Platform,
  FlatList,
  Dimensions,
} from 'react-native';
import Fonts from '../../../config/Fonts';
import AppText from '../../../components/AppText';
import Feather from 'react-native-vector-icons/Feather';
import { showToast } from '../../../components/Toast';
import VendorHeader from '../../../components/VendorHeader';
import { useGetUserTailorServicesQuery } from '../../../Services/UserServices';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

const StyleSelection = ({ route, navigation }) => {
  const tailor = route.params?.tailor;
  const categories = tailor?.categories || [];

  // Tabs structure: 'All' + tailor categories
  const tabs = [{ id: 'all', name: 'All' }, ...categories];
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedService, setSelectedService] = useState(null);

  // Fetch tailor services for selected category
  const { data, isFetching, error } = useGetUserTailorServicesQuery(
    {
      tailorId: tailor?.id,
      params: { category_id: selectedTab },
    },
    { skip: !tailor?.id },
  );

  const servicesList = data?.data?.services || data?.services || [];

  // Reset selected service when tab changes
  useEffect(() => {
    setSelectedService(null);
  }, [selectedTab]);

  const handleContinue = () => {
    if (!selectedService) {
      showToast(
        'Selection Required',
        'Please select a style/service to continue.',
        'error',
      );
      return;
    }

    navigation.navigate('Measurement', {
      tailor,
      service: selectedService,
    });
  };

  const renderTab = tab => {
    const isActive = selectedTab === tab.id;
    return (
      <TouchableOpacity
        key={tab.id}
        style={styles.tabButton}
        activeOpacity={0.8}
        onPress={() => setSelectedTab(tab.id)}
      >
        <AppText style={[styles.tabText, isActive && styles.tabTextActive]}>
          {tab.name}
        </AppText>
        {isActive && <View style={styles.activeIndicatorDiamond} />}
      </TouchableOpacity>
    );
  };

  const renderServiceItem = ({ item }) => {
    const isSelected = selectedService?.id === item.id;
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => setSelectedService(item)}
      >
        <View style={styles.imageContainer}>
          {item.image_url ? (
            <Image source={{ uri: item.image_url }} style={styles.image} />
          ) : (
            <View style={styles.placeholderImage}>
              <Feather name="image" size={32} color="#DEDEDE" />
            </View>
          )}

          {/* Custom Radio Button on top-right of image */}
          <View style={styles.radioButtonContainer}>
            <View
              style={[
                styles.radioOuter,
                isSelected && styles.radioOuterSelected,
              ]}
            >
              {isSelected && <View style={styles.radioInner} />}
            </View>
          </View>
        </View>

        <AppText numberOfLines={2} style={styles.serviceName}>
          {item.name}
        </AppText>
        <AppText style={styles.servicePrice}>
          ${Number(item.price || 0).toFixed(0)}
        </AppText>
      </TouchableOpacity>
    );
  };

  console.log('selectedService:-', selectedService);
  return (
    <View style={styles.container}>
      {/* Header */}
      <VendorHeader
        navigation={navigation}
        title="STYLE SELECTION"
        goBack={true}
        homeHeader={false}
        notification={false}
      />

      {/* Categories Horizontal Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollContent}
        >
          {tabs.map(renderTab)}
        </ScrollView>
      </View>

      {/* Services Content */}
      {isFetching ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#DBA83A" />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Feather name="alert-circle" size={48} color="#FF3B30" />
          <AppText style={styles.errorText}>Failed to load services.</AppText>
        </View>
      ) : servicesList.length === 0 ? (
        <View style={styles.centerContainer}>
          <Feather name="scissors" size={48} color="#DEDEDE" />
          <AppText style={styles.emptyText}>
            No services available in this category.
          </AppText>
        </View>
      ) : (
        <FlatList
          data={servicesList}
          keyExtractor={item => item.id.toString()}
          renderItem={renderServiceItem}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Bottom Continue Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bookBtn}
          activeOpacity={0.9}
          onPress={handleContinue}
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
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 50 : 15,
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    paddingVertical: 12,
  },
  tabsScrollContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabText: {
    fontSize: 14,
    color: '#8A8A8F',
    fontFamily: Fonts.regular,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#000000',
    fontWeight: '700',
  },
  activeIndicatorDiamond: {
    width: 6,
    height: 6,
    backgroundColor: '#DBA83A',
    transform: [{ rotate: '45deg' }],
    marginTop: 6,
    alignSelf: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    width: COLUMN_WIDTH,
    backgroundColor: '#FFFFFF',
  },
  imageContainer: {
    width: '100%',
    height: COLUMN_WIDTH * 1.25,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F9F9F9',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  radioButtonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: '#000000',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000000',
  },
  serviceName: {
    fontSize: 14,
    color: '#1A1A1A',
    fontFamily: Fonts.regular,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 18,
  },
  servicePrice: {
    fontSize: 15,
    color: '#000000',
    fontFamily: Fonts.bold,
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 14,
    color: '#8A8A8F',
    textAlign: 'center',
    marginTop: 12,
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 12,
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
});

export default StyleSelection;
