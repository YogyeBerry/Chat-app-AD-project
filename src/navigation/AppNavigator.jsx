import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/theme';
import ConnectionSettingsModal from '../components/ConnectionSettingsModal';

// Screens
import ConversationsScreen from '../screens/ConversationsScreen';
import UsersScreen from '../screens/UsersScreen';
import ChatScreen from '../screens/ChatScreen';
import GroupCreateScreen from '../screens/GroupCreateScreen';
import ParticipantInfoScreen from '../screens/ParticipantInfoScreen';
import CustomCameraScreen from '../screens/CustomCameraScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const [settingsVisible, setSettingsVisible] = useState(false);

  return (
    <>
      <ConnectionSettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = 'chatbubbles';
            if (route.name === 'ConversationsTab') {
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            } else if (route.name === 'UsersTab') {
              iconName = focused ? 'people' : 'people-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textMuted,
          tabBarStyle: {
            borderTopColor: COLORS.border,
            backgroundColor: '#FFFFFF',
            elevation: 4,
          },
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTitleStyle: {
            fontWeight: '700',
            color: COLORS.text,
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={() => setSettingsVisible(true)}
              style={{ marginRight: 16 }}
            >
              <Ionicons name="settings-outline" size={22} color={COLORS.secondary} />
            </TouchableOpacity>
          ),
        })}
      >
        <Tab.Screen
          name="ConversationsTab"
          component={ConversationsScreen}
          options={{ title: 'Chats' }}
        />
        <Tab.Screen
          name="UsersTab"
          component={UsersScreen}
          options={{ title: 'Contacts' }}
        />
      </Tab.Navigator>
    </>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTitleStyle: {
            fontWeight: '700',
            color: COLORS.text,
          },
          headerTintColor: COLORS.primary,
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={({ route }) => ({
            title: route.params?.title || 'Chat',
          })}
        />
        <Stack.Screen
          name="GroupCreate"
          component={GroupCreateScreen}
          options={{ title: 'New Group' }}
        />
        <Stack.Screen
          name="ParticipantInfo"
          component={ParticipantInfoScreen}
          options={{ title: 'Info' }}
        />
        <Stack.Screen
          name="CustomCamera"
          component={CustomCameraScreen}
          options={{
            headerShown: false,
            presentation: 'fullScreenModal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
