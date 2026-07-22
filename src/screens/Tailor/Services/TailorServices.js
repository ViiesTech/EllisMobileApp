import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Colors from '../../../config/Colors';
import TextField from '../../../components/TextField';
import CustomButton from '../../../components/CustomButton';
import AppText from '../../../components/AppText';
import { useDispatch, useSelector } from 'react-redux';
import { selectServices, addService } from '../../../store/bookingSlice';

const TailorServices = () => {
  const dispatch = useDispatch();
  const services = useSelector(selectServices);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [time, setTime] = useState('2-4 Days');
  const [description, setDescription] = useState('');

  const handleAdd = () => {
    if (!name || !price) return;
    dispatch(
      addService({
        name,
        price: parseFloat(price) || 0,
        time,
        description: description || 'Custom tailoring service.',
      }),
    );
    setName('');
    setPrice('');
    setDescription('');
    setModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <AppText style={styles.title}>My Stitching Services</AppText>
            <AppText style={styles.sub}>
              Offer custom tailoring & alteration packages
            </AppText>
          </View>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setModalVisible(true)}
          >
            <AppText style={styles.addText}>+ Add Service</AppText>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.list}>
        {services.map(svc => (
          <View key={svc.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <AppText style={styles.svcName}>{svc.name}</AppText>
              <AppText style={styles.price}>${svc.price}</AppText>
            </View>
            <AppText style={styles.desc}>{svc.description}</AppText>
            <AppText style={styles.time}>⏱ Delivery Time: {svc.time}</AppText>

            <View style={styles.cardFooter}>
              <TouchableOpacity style={styles.editBtn}>
                <AppText style={styles.editText}>Edit Package</AppText>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Add Service Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <AppText style={styles.modalTitle}>Add Tailoring Package</AppText>

            <TextField
              label="Service Title"
              value={name}
              onChangeText={setName}
              placeholder="e.g. Tuxedo Alterations"
            />
            <TextField
              label="Price ($)"
              value={price}
              onChangeText={setPrice}
              placeholder="120"
              keyboardType="numeric"
            />
            <TextField
              label="Est. Turnaround Time"
              value={time}
              onChangeText={setTime}
              placeholder="e.g. 3-5 Days"
            />
            <TextField
              label="Package Details"
              value={description}
              onChangeText={setDescription}
              placeholder="Includes fitting, hem adjustment..."
              multiline
            />

            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <CustomButton
                title="Cancel"
                onPress={() => setModalVisible(false)}
                variant="outline"
                style={{ flex: 1, marginRight: 8 }}
              />
              <CustomButton
                title="Save Package"
                onPress={handleAdd}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whitebackgroundcolor,
  },
  header: {
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.graybordercolor,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.secondary,
  },
  sub: {
    fontSize: 12,
    color: Colors.lightblack,
    marginTop: 2,
  },
  addBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.graybordercolor,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  svcName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.secondary,
    flex: 1,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  desc: {
    fontSize: 13,
    color: Colors.black,
    marginTop: 4,
  },
  time: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.lightblack,
    marginTop: 6,
  },
  cardFooter: {
    alignItems: 'flex-end',
    marginTop: 12,
  },
  editBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: Colors.textinputboxcolor,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.graybordercolor,
  },
  editText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.secondary,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.secondary,
    marginBottom: 16,
  },
});

export default TailorServices;
