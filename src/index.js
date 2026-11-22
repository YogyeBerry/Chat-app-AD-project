/**
 * Architectural manifest for Chat Application module
 * Establishes core layers:
 * - components: Reusable UI widgets (Avatar, MessageBubble, Input, States)
 * - context: Application state (Auth/User context, Settings context)
 * - hooks: Reusable stateful hooks (useUsers, useConversations, useMessages)
 * - navigation: AppNavigator, Stack and Tab navigators
 * - screens: Feature screens (UsersScreen, ConversationsScreen, ChatScreen, CameraScreen, etc.)
 * - services: Centralized API and device integrations (apiClient, userService, etc.)
 * - utils: Pure data formatters and runtime validators
 */
export const ARCHITECTURE_LAYERS = {
  COMPONENTS: 'src/components',
  CONTEXT: 'src/context',
  HOOKS: 'src/hooks',
  NAVIGATION: 'src/navigation',
  SCREENS: 'src/screens',
  SERVICES: 'src/services',
  UTILS: 'src/utils',
  CONSTANTS: 'src/constants',
};
