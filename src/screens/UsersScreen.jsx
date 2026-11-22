import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { userService } from '../services/userService';
import UserListItem from '../components/UserListItem';
import SearchBar from '../components/SearchBar';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';

export default function UsersScreen() {
  const navigation = useNavigation();
  const { baseUrl, currentUser } = useApp();

  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
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

  const toggleSelectUser = (user) => {
    const userId = String(user.id);
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleUserPress = (user) => {
    if (selectionMode) {
      toggleSelectUser(user);
    } else {
      // Direct messaging navigation
      navigation.navigate('Chat', {
        participant: user,
        title: user.name,
      });
    }
  };

  const startGroupCreation = () => {
    const selectedUsers = users.filter((u) => selectedUserIds.includes(String(u.id)));
    navigation.navigate('GroupCreate', {
      initialSelectedUsers: selectedUsers,
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
      <View style={styles.topActions}>
        <TouchableOpacity
          style={[styles.modeToggle, selectionMode && styles.modeToggleActive]}
          onPress={() => {
            setSelectionMode(!selectionMode);
            setSelectedUserIds([]);
          }}
        >
          <Ionicons
            name={selectionMode ? 'close-circle' : 'checkbox-outline'}
            size={18}
            color={selectionMode ? '#FFFFFF' : COLORS.primary}
          />
          <Text style={[styles.modeToggleText, selectionMode && styles.modeToggleTextActive]}>
            {selectionMode ? 'Cancel Selection' : 'Multi-Select'}
          </Text>
        </TouchableOpacity>

        {selectionMode && selectedUserIds.length > 0 && (
          <TouchableOpacity
            style={styles.createGroupBtn}
            onPress={startGroupCreation}
          >
            <Ionicons name="people" size={18} color="#FFFFFF" />
            <Text style={styles.createGroupBtnText}>
              Create Group ({selectedUserIds.length})
            </Text>
          </TouchableOpacity>
        )}
      </View>

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
          <UserListItem
            user={item}
            onPress={handleUserPress}
            selectable={selectionMode}
            isSelected={selectedUserIds.includes(String(item.id))}
          />
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
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  modeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
  },
  modeToggleActive: {
    backgroundColor: COLORS.secondary,
  },
  modeToggleText: {
    marginLeft: 6,
    fontSize: TYPOGRAPHY.caption,
    fontWeight: '600',
    color: COLORS.primary,
  },
  modeToggleTextActive: {
    color: '#FFFFFF',
  },
  createGroupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
  },
  createGroupBtnText: {
    marginLeft: 6,
    fontSize: TYPOGRAPHY.caption,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
