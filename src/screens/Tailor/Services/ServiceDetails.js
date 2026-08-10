import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import Colors from '../../../config/Colors';
import AppText from '../../../components/AppText';
import VendorHeader from '../../../components/VendorHeader';
import { getImageSource } from './MyServices';
import { useDeleteTailorServiceMutation } from '../../../Services/TailorServices';

const ServiceDetails = ({ route, navigation }) => {
  const { service } = route.params || {};
  const [deleteTailorService] = useDeleteTailorServiceMutation();

  if (!service) {
    return (
      <View style={styles.errorContainer}>
        <AppText style={styles.errorText}>
          No service details available.
        </AppText>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Service',
      `Are you sure you want to delete the service "${service.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await deleteTailorService(service.id).unwrap();
              if (res?.success) {
                Alert.alert('Deleted', 'Service package has been removed.', [
                  { text: 'OK', onPress: () => navigation.goBack() },
                ]);
              } else {
                Alert.alert(
                  'Error',
                  res?.message || 'Failed to delete service.',
                );
              }
            } catch (err) {
              console.log('deleteTailorService error:', err);
              Alert.alert('Error', 'An error occurred while deleting service.');
            }
          },
        },
      ],
    );
  };

  console.log('service:-', service);
  return (
    <View style={styles.safeArea}>
      <VendorHeader
        navigation={navigation}
        title="SERVICE DETAILS"
        goBack={true}
        homeHeader={false}
        notification={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Details Block */}
        <View style={styles.topInfoRow}>
          <View style={styles.iconBox}>
            <Image
              source={getImageSource(service)}
              style={styles.serviceIconImage}
            />
          </View>
          <View style={styles.titlePriceCol}>
            <AppText style={styles.serviceName}>{service.name}</AppText>
            <AppText style={styles.servicePriceTop}>${service.price}</AppText>
          </View>
        </View>

        {/* Section: Description */}
        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Service Description</AppText>
          <AppText style={styles.sectionBody}>
            {service.description || '----'}
          </AppText>
        </View>

        {/* Section: Style Category */}
        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Style Category</AppText>
          <AppText style={styles.sectionBody}>
            {service.category_name || '----'}
          </AppText>
        </View>

        {/* Section: Price */}
        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Service Price</AppText>
          <AppText style={styles.priceBig}>${service.price}</AppText>
        </View>
      </ScrollView>

      {/* Bottom Button Actions */}
      <View style={styles.actionContainer}>
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={[styles.btn, styles.editBtn]}
            onPress={() => navigation.navigate('CreateService', { service })}
            activeOpacity={0.8}
          >
            <AppText style={styles.editBtnText}>Edit</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.deleteBtn]}
            onPress={handleDelete}
            activeOpacity={0.8}
          >
            <AppText style={styles.deleteBtnText}>Delete</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 110,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#7C7C7C',
  },
  topInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  iconBox: {
    width: 68,
    height: 68,
    borderRadius: 12,
    backgroundColor: Colors.graybordercolor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceIconImage: {
    height: 66,
    width: 66,
    resizeMode: 'cover',
    borderRadius: 12,
  },
  titlePriceCol: {
    marginLeft: 20,
    justifyContent: 'center',
    flex: 1,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  servicePriceTop: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  sectionBody: {
    fontSize: 14,
    color: '#7C7C7C',
    lineHeight: 22,
  },
  priceBig: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'serif',
  },
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Colors.white,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBtn: {
    backgroundColor: Colors.primary,
    marginRight: 8,
  },
  editBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  deleteBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#000000',
    marginLeft: 8,
  },
  deleteBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
});

export default ServiceDetails;
