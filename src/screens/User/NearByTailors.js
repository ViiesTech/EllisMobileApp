import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Colors from '../../config/Colors';
import { TailorCard } from '../../components/TailorCard';
import AppText from '../../components/AppText';
import Feather from 'react-native-vector-icons/Feather';
import VendorHeader from '../../components/VendorHeader';
import { useLazyGetTailorsQuery } from '../../Services/TailorServices';

const NearByTailors = ({ navigation }) => {
  const [triggerGetTailors, { isFetching }] = useLazyGetTailorsQuery();
  const [tailorsList, setTailorsList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchTailorsList = async (pageNumber, isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const res = await triggerGetTailors({
        page: pageNumber,
        limit: 10,
      }).unwrap();
      const newTailors = res?.data || [];

      if (newTailors.length < 10) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      if (isRefresh) {
        setTailorsList(newTailors);
        setPage(1);
      } else {
        setTailorsList(prev => [...prev, ...newTailors]);
        setPage(pageNumber);
      }
    } catch (err) {
      console.log('Error fetching tailors:', err);
    } finally {
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchTailorsList(1, true);
  }, []);

  const onRefresh = () => {
    setHasMore(true);
    fetchTailorsList(1, true);
  };

  const onLoadMore = () => {
    if (!loadingMore && !isFetching && hasMore && tailorsList.length > 0) {
      fetchTailorsList(page + 1, false);
    }
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#DBA83A" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (isFetching) return null;
    return (
      <View style={styles.emptyContainer}>
        <Feather name="users" size={48} color="#DEDEDE" />
        <AppText style={styles.emptyText}>No tailors found.</AppText>
      </View>
    );
  };

  if (isFetching && tailorsList.length === 0 && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <VendorHeader
          navigation={navigation}
          title="NEAR BY TAILORS"
          goBack={true}
          homeHeader={false}
          notification={false}
        />
        <View style={styles.centerLoader}>
          <ActivityIndicator size="large" color="#DBA83A" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      {/* Brand Header */}
      <VendorHeader
        navigation={navigation}
        title="NEAR BY TAILORS"
        goBack={true}
        homeHeader={false}
        notification={false}
      />

      <FlatList
        data={tailorsList}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TailorCard
            tailor={item}
            onPress={t => navigation.navigate('TailorDetails', { tailor: t })}
            onBookNow={t => navigation.navigate('TailorDetails', { tailor: t })}
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#DBA83A']}
            tintColor="#DBA83A"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 50 : 15,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 14,
    color: '#878787',
    textAlign: 'center',
    marginTop: 12,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 50 : 15,
  },
  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLoader: {
    paddingVertical: 12,
    alignItems: 'center',
  },
});

export default NearByTailors;
