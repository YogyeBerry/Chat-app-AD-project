import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { userService } from '../services/userService';
import UserListItem from '../components/UserListItem';
import SearchBar from '../components/SearchBar';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { COLORS } from '../constants/theme';

export default function UsersScreen() {
  const navigation = useNavigation();
  const { baseUrl, currentUser } = useApp();

  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await userService.getUsers(baseUrl);
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

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const query = searchQuery.toLowerCase().trim();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        (user.email && user.email.toLowerCase().includes(query))
    );
  }, [users, searchQuery]);

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
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={() => setSearchQuery('')}
        placeholder="Search contacts by name or email..."
      />
      <FlatList
        data={filteredUsers}
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
            icon={searchQuery ? 'search-outline' : 'people-outline'}
            title={searchQuery ? 'No Results' : 'No Users Found'}
            message={
              searchQuery
                ? `No contact matches "${searchQuery}".`
                : 'There are currently no other users registered on this network.'
            }
            actionLabel={searchQuery ? 'Clear Search' : 'Refresh'}
            onAction={searchQuery ? () => setSearchQuery('') : () => fetchUsers(false)}
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
