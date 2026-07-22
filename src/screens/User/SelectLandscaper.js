import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import Colors from '../../config/Colors';
import { TailorCard } from '../../components/TailorCard';
import AppText from '../../components/AppText';
import { useSelector } from 'react-redux';
import { selectTailors } from '../../store/bookingSlice';

const SelectLandscaper = ({ navigation }) => {
  const tailors = useSelector(selectTailors);
  const [search, setSearch] = useState('');

  const filtered = tailors.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.specialties.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <AppText style={styles.title}>Nearby Bespoke Tailors</AppText>
        <AppText style={styles.sub}>Find certified master tailors for doorstep measurements & fitting</AppText>

        <View style={styles.searchBar}>
          <AppText style={styles.searchIcon}>📍</AppText>
          <TextInput
            style={styles.input}
            placeholder="Search by specialty, location, or name..."
            placeholderTextColor={Colors.gray}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <View style={styles.list}>
        {filtered.map((tailor) => (
          <TailorCard
            key={tailor.id}
            tailor={tailor}
            onPress={(t) => navigation.navigate('SelectedLandscaper', { tailor: t })}
            onBookNow={(t) => navigation.navigate('SelectedLandscaper', { tailor: t })}
          />
        ))}
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
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.graybordercolor,
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
    marginBottom: 14,
  },
  searchBar: {
    height: 44,
    backgroundColor: Colors.textinputboxcolor,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.graybordercolor,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: Colors.secondary,
  },
  list: {
    padding: 16,
  },
});

export default SelectLandscaper;
