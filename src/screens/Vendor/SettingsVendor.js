import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import Colors from '../../config/Colors';
import TextField from '../../components/TextField';
import CustomButton from '../../components/CustomButton';
import AppText from '../../components/AppText';
import { useSelector } from 'react-redux';
import { selectUser, selectRole } from '../../store/authSlice';

const SettingsVendor = () => {
  const userProfile = useSelector(selectUser) || {};
  const role = useSelector(selectRole);
  const [activeTab, setActiveTab] = useState('PROFILE');

  const [businessName, setBusinessName] = useState(userProfile.businessName || 'Ellis Couture');
  const [phone, setPhone] = useState(userProfile.phone);
  const [bankAcc, setBankAcc] = useState('7492 8391 1002 9948');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
        <AppText style={styles.name}>{userProfile.name}</AppText>
        <AppText style={styles.roleSub}>{role} ACCOUNT • APPROVED</AppText>

        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'PROFILE' && styles.tabActive]}
            onPress={() => setActiveTab('PROFILE')}
          >
            <AppText style={[styles.tabText, activeTab === 'PROFILE' && styles.tabTextActive]}>
              Edit Profile
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'BUSINESS' && styles.tabActive]}
            onPress={() => setActiveTab('BUSINESS')}
          >
            <AppText style={[styles.tabText, activeTab === 'BUSINESS' && styles.tabTextActive]}>
              Business Profile
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'BANK' && styles.tabActive]}
            onPress={() => setActiveTab('BANK')}
          >
            <AppText style={[styles.tabText, activeTab === 'BANK' && styles.tabTextActive]}>
              Bank Account
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardSection}>
        {activeTab === 'PROFILE' && (
          <View>
            <Text style={styles.cardHeader}>PERSONAL DETAILS</Text>
            <TextField label="Full Name" value={userProfile.name} />
            <TextField label="Email Address" value={userProfile.email} />
            <TextField label="Phone Number" value={phone} onChangeText={setPhone} />
            <CustomButton title="Save Changes" onPress={() => {}} style={{ marginTop: 10 }} />
          </View>
        )}

        {activeTab === 'BUSINESS' && (
          <View>
            <Text style={styles.cardHeader}>BUSINESS INFORMATION</Text>
            <TextField
              label="Store / Brand Name"
              value={businessName}
              onChangeText={setBusinessName}
            />
            <TextField label="Registration Number" value="REG-99201-NY" />
            <TextField label="Business Address" value="5th Avenue, Suite 400, New York" multiline />
            <CustomButton title="Update Business Profile" onPress={() => {}} style={{ marginTop: 10 }} />
          </View>
        )}

        {activeTab === 'BANK' && (
          <View>
            <Text style={styles.cardHeader}>PAYOUT BANK ACCOUNT</Text>

            <View style={styles.bankCardVisual}>
              <Text style={styles.bankName}>CHASE PLATINUM BUSINESS</Text>
              <Text style={styles.accNum}>•••• •••• •••• 9948</Text>
              <Text style={styles.accHolder}>{userProfile.name}</Text>
            </View>

            <TextField label="Bank Name" value="Chase Bank NA" />
            <TextField
              label="Account / IBAN"
              value={bankAcc}
              onChangeText={setBankAcc}
            />
            <CustomButton title="Update Payout Method" onPress={() => {}} style={{ marginTop: 10 }} />
          </View>
        )}
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
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.graybordercolor,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.secondary,
  },
  roleSub: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primaryDark,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: Colors.textinputboxcolor,
    borderRadius: 10,
    padding: 3,
    marginTop: 16,
    width: '100%',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: Colors.white,
    elevation: 1,
  },
  tabText: {
    fontSize: 11,
    color: Colors.lightblack,
    fontWeight: '600',
  },
  tabTextActive: {
    color: Colors.secondary,
    fontWeight: '700',
  },
  cardSection: {
    margin: 16,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.graybordercolor,
  },
  cardHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
    letterSpacing: 1,
    marginBottom: 14,
  },
  bankCardVisual: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  bankName: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1.5,
  },
  accNum: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    marginVertical: 12,
    letterSpacing: 2,
  },
  accHolder: {
    fontSize: 12,
    color: Colors.Lightgray,
    fontWeight: '600',
  },
});

export default SettingsVendor;
