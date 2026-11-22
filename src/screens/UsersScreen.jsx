import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { userService } from '../services/userService';
import UserListItem from '../components/UserListItem';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { COLORS } from '../constants/theme';

export default function UsersScreen() {
  const navigation = useNavigation();
  const { baseUrl, currentUser } = useApp();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await userService.getUsers(baseUrl);
      // Filter out current user from contacts directory
      const filtered = data.filter((u) => String(u.id) !== String(currentUser?.id));
      setUsers(filtered);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [baseUrl, currentUser]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleUserPress = (user) => {
    navigation.navigate('Chat', {
      participant: user,
      title: user.name,
    });
  };

  if (loading && !refreshing) {
    return <LoadingState message="Fetching users directory..." />;
  }

  if (error && users.length === 0) {
    return <ErrorState message={error} onRetry={() => fetchUsers(false)} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <UserListItem user={item} onPress={handleUserPress} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchUsers(true)}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="people-outline"
            title="No Users Found"
            message="There are currently no other users registered on this network."
            actionLabel="Refresh"
            onAction={() => fetchUsers(false)}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
