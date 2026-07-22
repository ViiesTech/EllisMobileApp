import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import Colors from '../../config/Colors';
import TextField from '../../components/TextField';
import CustomButton from '../../components/CustomButton';
import AppText from '../../components/AppText';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/authSlice';

const SettingsTailor = () => {
  const userProfile = useSelector(selectUser) || {};
  const [activeTab, setActiveTab] = useState('SETUP');

  const [experience, setExperience] = useState('12 Years');
  const [specialties, setSpecialties] = useState('Bespoke Suits, Tuxedo Fitting, Alterations');
  const [hourlyRate, setHourlyRate] = useState('50');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' }} style={styles.avatar} />
        <AppText style={styles.name}>Master Alex Masterson</AppText>
        <AppText style={styles.roleSub}>MASTER TAILOR • VERIFIED PRO</AppText>

        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'SETUP' && styles.tabActive]}
            onPress={() => setActiveTab('SETUP')}
          >
            <AppText style={[styles.tabText, activeTab === 'SETUP' && styles.tabTextActive]}>
              Tailor Setup
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
          <TouchableOpacity
            style={[styles.tab, activeTab === 'REVIEW' && styles.tabActive]}
            onPress={() => setActiveTab('REVIEW')}
          >
            <AppText style={[styles.tabText, activeTab === 'REVIEW' && styles.tabTextActive]}>
              Approval Status
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardSection}>
        {activeTab === 'SETUP' && (
          <View>
            <Text style={styles.cardHeader}>TAILOR PROFILE & SKILLS</Text>
            <TextField
              label="Years of Experience"
              value={experience}
              onChangeText={setExperience}
            />
            <TextField
              label="Stitching Specialties"
              value={specialties}
              onChangeText={setSpecialties}
            />
            <TextField
              label="Doorstep Consultation Fee ($)"
              value={hourlyRate}
              onChangeText={setHourlyRate}
              keyboardType="numeric"
            />
            <CustomButton title="Save Tailor Profile" onPress={() => {}} style={{ marginTop: 10 }} />
          </View>
        )}

        {activeTab === 'BANK' && (
          <View>
            <Text style={styles.cardHeader}>TAILOR EARNINGS PAYOUT ACCOUNT</Text>

            <View style={styles.bankCardVisual}>
              <Text style={styles.bankName}>WELLS FARGO BESPOKE PAY</Text>
              <Text style={styles.accNum}>•••• •••• •••• 3310</Text>
              <Text style={styles.accHolder}>Alex Masterson</Text>
            </View>

            <TextField label="Bank Name" value="Wells Fargo Bank" />
            <TextField label="Routing Number" value="121000248" />
            <TextField label="Account Number" value="331099201" secureTextEntry />
            <CustomButton title="Update Direct Deposit" onPress={() => {}} style={{ marginTop: 10 }} />
          </View>
        )}

        {activeTab === 'REVIEW' && (
          <View style={styles.reviewBox}>
            <Text style={styles.reviewIcon}>📋</Text>
            <Text style={styles.reviewTitle}>Your Profile is Under Review</Text>
            <Text style={styles.reviewSub}>
              Our master tailors team is verifying your craft credentials. You can accept local client appointments once approved.
            </Text>

            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>Status: Active Verified</Text>
            </View>
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
  reviewBox: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  reviewIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.secondary,
  },
  reviewSub: {
    fontSize: 13,
    color: Colors.lightblack,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  statusPill: {
    backgroundColor: Colors.greenBG,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 16,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.green,
  },
});

export default SettingsTailor;
