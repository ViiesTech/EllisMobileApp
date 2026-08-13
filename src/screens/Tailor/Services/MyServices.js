import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Colors from '../../../config/Colors';
import AppText from '../../../components/AppText';
import VendorHeader from '../../../components/VendorHeader';
import Feather from 'react-native-vector-icons/Feather';
import { AppImages } from '../../../assets/images/AppImages';
import {
  useGetTailorServicesQuery,
  useDeleteTailorServiceMutation,
} from '../../../Services/TailorServices';
import { showToast, showToastError } from '../../../components/Toast';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = (screenWidth - 40 - 16) / 2; // 40 for screen padding, 16 for column gap

export const getImageSource = item => {
  const imgUrl = item?.image_url;
  if (imgUrl && imgUrl !== '') {
    if (typeof imgUrl === 'string') {
      return { uri: imgUrl };
    }
    return imgUrl;
  }
  return AppImages.placeholder;
};

const MyServices = ({ navigation }) => {
  const {
    data: servicesResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetTailorServicesQuery();
  const [deleteTailorService] = useDeleteTailorServiceMutation();
  const servicesList = servicesResponse?.data || [];

  const handleDelete = (id, name) => {
    Alert.alert(
      'Delete Service',
      `Are you sure you want to delete the service "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await deleteTailorService(id).unwrap();
              if (res?.success) {
                showToast(
                  'Success',
                  'Service has been removed successfully.',
                  'success',
                );
              } else {
                showToastError('Error', 'Failed to delete service.');
              }
            } catch (err) {
              console.log('deleteTailorService error:', err);
              showToastError('Error', err?.data?.message || 'Failed to delete');
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.safeArea}>
      <VendorHeader
        navigation={navigation}
        title="MY SERVICES"
        goBack={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
          />
        }
      >
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={Colors.primary}
            style={{ marginTop: 40 }}
          />
        ) : servicesList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <AppText style={styles.emptyText}>
              No services found. Click below to add one!
            </AppText>
          </View>
        ) : (
          <View style={styles.gridContainer}>
            {servicesList.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.serviceCard}
                onPress={() =>
                  navigation.navigate('ServiceDetails', { service: item })
                }
                activeOpacity={0.8}
              >
                {/* Top Row of Card */}
                <View style={styles.cardTopRow}>
                  <View style={styles.iconContainer}>
                    <Image
                      source={getImageSource(item)}
                      style={styles.serviceIconImage}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.deleteIconBtn}
                    onPress={() => handleDelete(item.id, item.name)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Feather name="trash-2" size={16} color={Colors.primary} />
                  </TouchableOpacity>
                </View>

                {/* Title & Description */}
                <AppText style={styles.serviceTitle} numberOfLines={2}>
                  {item.name}
                </AppText>
                <AppText style={styles.serviceDesc} numberOfLines={2}>
                  {item.description || 'Lorem ipsum simply dummy'}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add New Service Bottom Button */}
      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('CreateService')}
          activeOpacity={0.8}
        >
          <AppText style={styles.addBtnText}>Add New Service</AppText>
          <Feather
            name="arrow-right"
            size={20}
            color="#000000"
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
    // backgroundColor: 'red',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: CARD_WIDTH,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    height: 165,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconContainer: {
    height: 65,
    width: '100%',
    borderRadius: 10,
    backgroundColor: Colors.graybordercolor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceIconImage: {
    height: 65,
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
  deleteIconBtn: {
    backgroundColor: Colors.secondary,
    borderRadius: 50,
    position: 'absolute',
    top: -8,
    right: -7,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginTop: 8,
    fontFamily: 'serif',
  },
  serviceDesc: {
    fontSize: 11,
    color: '#333333',
    lineHeight: 14,
    marginTop: 4,
  },
  btnContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
  },
  addBtn: {
    height: 52,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  addBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  arrowIcon: {
    position: 'absolute',
    right: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  emptyText: {
    fontSize: 14,
    color: '#7C7C7C',
    textAlign: 'center',
  },
});

export default MyServices;
