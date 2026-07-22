import React, { useState } from 'react';
import { View, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import Colors from '../../config/Colors';
import CustomButton from '../../components/CustomButton';
import AppText from '../../components/AppText';
import { useSelector } from 'react-redux';
import { selectServices } from '../../store/bookingSlice';

const SelectedLandscaper = ({ route, navigation }) => {
  const services = useSelector(selectServices);
  const tailor = route.params?.tailor || {
    name: 'Master Savile Rows',
    tailorName: 'Alex Masterson',
    experience: '15 Years Experience',
    rating: 4.9,
    priceStarting: 120,
    specialties: ['Bespoke Suits', 'Alterations', 'Tuxedo Fitting'],
    bio: 'Crafting luxury tailored menswear with artisanal hand-stitching techniques passed down through generations.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  };

  const [selectedService, setSelectedService] = useState(services[0] || null);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: tailor.image }} style={styles.image} />
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <AppText style={styles.backText}>‹</AppText>
        </TouchableOpacity>

        <View style={styles.body}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <AppText style={styles.name}>{tailor.name}</AppText>
              <AppText style={styles.tailorSub}>{tailor.tailorName} • {tailor.experience}</AppText>
            </View>
            <View style={styles.ratingBadge}>
              <AppText style={styles.star}>★ {tailor.rating}</AppText>
            </View>
          </View>

          <AppText style={styles.bio}>{tailor.bio}</AppText>

          <AppText style={styles.sectionHeader}>SPECIALIZATION</AppText>
          <View style={styles.chipsRow}>
            {tailor.specialties?.map((spec, i) => (
              <View key={i} style={styles.chip}>
                <AppText style={styles.chipText}>{spec}</AppText>
              </View>
            ))}
          </View>

          <AppText style={styles.sectionHeader}>SELECT STITCHING SERVICE</AppText>
          {services.map((svc) => {
            const isSelected = selectedService?.id === svc.id;
            return (
              <TouchableOpacity
                key={svc.id}
                style={[
                  styles.svcCard,
                  isSelected && styles.svcCardSelected,
                ]}
                onPress={() => setSelectedService(svc)}
              >
                <View style={{ flex: 1 }}>
                  <AppText style={styles.svcName}>{svc.name}</AppText>
                  <AppText style={styles.svcDesc}>{svc.description}</AppText>
                  <AppText style={styles.svcTime}>Estimated Time: {svc.time}</AppText>
                </View>
                <AppText style={styles.svcPrice}>${svc.price}</AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <CustomButton
          title={`Book Service • $${selectedService ? selectedService.price : tailor.priceStarting}`}
          onPress={() => navigation.navigate('Measurement', { tailor, service: selectedService })}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 90,
  },
  image: {
    width: '100%',
    height: 280,
    backgroundColor: Colors.textinputboxcolor,
  },
  backBtn: {
    position: 'absolute',
    top: 44,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 26,
    color: Colors.secondary,
    marginTop: -4,
  },
  body: {
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.secondary,
  },
  tailorSub: {
    fontSize: 13,
    color: Colors.lightblack,
    marginTop: 2,
  },
  ratingBadge: {
    backgroundColor: Colors.pendingBG,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  star: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.pending,
  },
  bio: {
    fontSize: 14,
    color: Colors.black,
    marginTop: 12,
    lineHeight: 20,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.lightblack,
    letterSpacing: 1,
    marginTop: 20,
    marginBottom: 10,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    backgroundColor: Colors.whitebackgroundcolor,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.graybordercolor,
  },
  chipText: {
    fontSize: 12,
    color: Colors.primaryDark,
    fontWeight: '600',
  },
  svcCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.graybordercolor,
    backgroundColor: Colors.white,
    marginBottom: 10,
  },
  svcCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.whitebackgroundcolor,
  },
  svcName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.secondary,
  },
  svcDesc: {
    fontSize: 12,
    color: Colors.lightblack,
    marginTop: 2,
  },
  svcTime: {
    fontSize: 11,
    color: Colors.primaryDark,
    marginTop: 4,
    fontWeight: '600',
  },
  svcPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginLeft: 12,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.graybordercolor,
  },
});

export default SelectedLandscaper;
