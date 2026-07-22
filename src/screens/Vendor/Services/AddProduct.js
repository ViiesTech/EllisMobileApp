import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Colors from '../../../config/Colors';
import TextField from '../../../components/TextField';
import CustomButton from '../../../components/CustomButton';
import AppText from '../../../components/AppText';
import { useDispatch } from 'react-redux';
import { addProduct } from '../../../store/productSlice';

const AddProduct = ({ navigation }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Fabrics');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('10');
  const [material, setMaterial] = useState('Pure Silk / Wool');
  const [image] = useState(
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format&fit=crop&q=80'
  );

  const handleSubmit = () => {
    if (!name || !price) return;
    dispatch(
      addProduct({
        name,
        price: parseFloat(price) || 0,
        category,
        description,
        stock: parseInt(stock, 10) || 1,
        material,
        image,
      })
    );
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <AppText style={styles.backText}>‹</AppText>
        </TouchableOpacity>
        <AppText style={styles.title}>Add New Product</AppText>
        <AppText style={styles.sub}>List fabric or readymade suit in store catalog</AppText>
      </View>

      <View style={styles.formCard}>
        <TextField
          label="Product Name"
          value={name}
          onChangeText={setName}
          placeholder="e.g. Royal Tweed Wool Fabric"
        />

        <TextField
          label="Price ($)"
          value={price}
          onChangeText={setPrice}
          placeholder="e.g. 150"
          keyboardType="numeric"
        />

        <AppText style={styles.label}>Category</AppText>
        <View style={styles.catRow}>
          {['Fabrics', 'Suits', 'Shirts', 'Trousers'].map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.catChip,
                category === cat && styles.catChipActive,
              ]}
              onPress={() => setCategory(cat)}
            >
              <AppText
                style={[
                  styles.catText,
                  category === cat && styles.catTextActive,
                ]}
              >
                {cat}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>

        <TextField
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Describe material, weave, thread count..."
          multiline
        />

        <View style={{ flexDirection: 'row' }}>
          <TextField
            label="Stock Quantity"
            value={stock}
            onChangeText={setStock}
            keyboardType="numeric"
            style={{ flex: 1, marginRight: 10 }}
          />
          <TextField
            label="Material Type"
            value={material}
            onChangeText={setMaterial}
            style={{ flex: 1 }}
          />
        </View>

        <CustomButton title="Save & Publish Product" onPress={handleSubmit} style={{ marginTop: 16 }} />
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
    marginBottom: 6,
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
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.secondary,
    marginBottom: 6,
  },
  catRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.graybordercolor,
    marginRight: 8,
    backgroundColor: Colors.textinputboxcolor,
  },
  catChipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.whitebackgroundcolor,
  },
  catText: {
    fontSize: 12,
    color: Colors.secondary,
  },
  catTextActive: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
});

export default AddProduct;
