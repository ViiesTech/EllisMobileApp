import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Colors from '../../../config/Colors';
import TextField from '../../../components/TextField';
import CustomButton from '../../../components/CustomButton';
import AppText from '../../../components/AppText';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../../store/authSlice';
import { addBooking } from '../../../store/bookingSlice';

const Measurement = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const userProfile = useSelector(selectUser) || {};
  const tailor = route.params?.tailor;
  const service = route.params?.service;

  const [chest, setChest] = useState('40');
  const [waist, setWaist] = useState('32');
  const [shoulder, setShoulder] = useState('18');
  const [armLength, setArmLength] = useState('25');
  const [neck, setNeck] = useState('15.5');
  const [inseam, setInseam] = useState('31');
  const [date, setDate] = useState('2026-07-28');
  const [time, setTime] = useState('10:30 AM');
  const [address, setAddress] = useState('742 Evergreen Terrace, Springfield');

  const handleConfirm = () => {
    const bookingData = {
      serviceName: service ? service.name : 'Custom Fitting',
      tailorName: tailor ? tailor.name : 'Master Tailor',
      price: service ? service.price : 150,
      date,
      time,
      customerName: userProfile.name || 'Alan Charles',
      phone: userProfile.phone || '+1 234 567 8900',
      address,
      measurements: {
        chest: `${chest} in`,
        waist: `${waist} in`,
        shoulder: `${shoulder} in`,
        armLength: `${armLength} in`,
        neck: `${neck} in`,
        inseam: `${inseam} in`,
      },
    };

    dispatch(addBooking(bookingData));
    navigation.navigate('Bookings');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <AppText style={styles.backText}>‹</AppText>
        </TouchableOpacity>
        <AppText style={styles.title}>Upload Body Measurements</AppText>
        <AppText style={styles.sub}>
          Enter custom sizing metrics for {tailor ? tailor.name : 'your tailor'}
        </AppText>
      </View>

      <View style={styles.formCard}>
        <AppText style={styles.sectionHeader}>UPPER BODY SIZING (INCHES)</AppText>
        
        <View style={styles.row}>
          <TextField
            label="Chest Size"
            value={chest}
            onChangeText={setChest}
            keyboardType="numeric"
            style={{ flex: 1, marginRight: 10 }}
          />
          <TextField
            label="Waist Size"
            value={waist}
            onChangeText={setWaist}
            keyboardType="numeric"
            style={{ flex: 1 }}
          />
        </View>

        <View style={styles.row}>
          <TextField
            label="Shoulder Width"
            value={shoulder}
            onChangeText={setShoulder}
            keyboardType="numeric"
            style={{ flex: 1, marginRight: 10 }}
          />
          <TextField
            label="Arm Length"
            value={armLength}
            onChangeText={setArmLength}
            keyboardType="numeric"
            style={{ flex: 1 }}
          />
        </View>

        <View style={styles.row}>
          <TextField
            label="Neck Circumference"
            value={neck}
            onChangeText={setNeck}
            keyboardType="numeric"
            style={{ flex: 1, marginRight: 10 }}
          />
          <TextField
            label="Inseam / Leg Length"
            value={inseam}
            onChangeText={setInseam}
            keyboardType="numeric"
            style={{ flex: 1 }}
          />
        </View>

        <AppText style={styles.sectionHeader}>FITTING APPOINTMENT DETAILS</AppText>

        <View style={styles.row}>
          <TextField
            label="Preferred Date"
            value={date}
            onChangeText={setDate}
            style={{ flex: 1, marginRight: 10 }}
          />
          <TextField
            label="Preferred Time"
            value={time}
            onChangeText={setTime}
            style={{ flex: 1 }}
          />
        </View>

        <TextField
          label="Doorstep Fitting Address"
          value={address}
          onChangeText={setAddress}
          multiline
        />

        <CustomButton
          title={`Confirm Appointment • $${service ? service.price : 150}`}
          onPress={handleConfirm}
          style={{ marginTop: 16 }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whitebackgroundcolor,
  },
  header: {
    padding: 20,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.graybordercolor,
  },
  backBtn: {
    marginBottom: 8,
  },
  backText: {
    fontSize: 28,
    color: Colors.secondary,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.secondary,
  },
  sub: {
    fontSize: 13,
    color: Colors.lightblack,
    marginTop: 2,
  },
  formCard: {
    margin: 16,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.graybordercolor,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 6,
  },
  row: {
    flexDirection: 'row',
  },
});

export default Measurement;
