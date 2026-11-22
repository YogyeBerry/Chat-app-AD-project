# Modern React Native Chat Application (Expo)

A production-quality, modular, and maintainable mobile messaging application built with **React Native**, **Expo**, and pure modern **JavaScript (ES6+)**.

---

## 📱 Features

- **Users Directory & Search**: Real-time keyword filtering, user avatars, and status indication.
- **Direct Messaging**: One-on-one instant messaging with optimistic UI updates and delivery confirmations.
- **Group Conversations**: Multi-participant selection and custom group creation.
- **Active Conversations Hub**: Conversation list showing participant names, avatars, latest message preview, and timestamps with pull-to-refresh.
- **Interactive Chat Interface**: Keyboard-aware scrollable message thread, sent vs. received bubble differentiation, and delivery status indicators.
- **Dual Camera Architecture**:
  - **Native Camera**: Direct system intent using `expo-camera` / `expo-image-picker`.
  - **Custom Camera Screen**: Live in-app viewfinder with front/back camera flipping, flash/torch toggles, photo capture, preview, and retake controls.
- **Media Gallery Integration**: Photo picker with image preview before sending.
- **Configurable Network Environment**: In-app runtime settings modal allowing dynamic configuration of backend REST server URL and active user identity without hardcoded IPs.

---

## 🛠 Tech Stack

- **Framework**: React Native with Expo SDK 52
- **Language**: JavaScript (ES6+, JSX)
- **Navigation**: React Navigation (Native Stack + Bottom Tabs)
- **Networking**: Axios with centralized error interceptors
- **Device & Media**: `expo-camera`, `expo-image-picker`
- **Icons & Styling**: `@expo/vector-icons`, standard React Native StyleSheet

---

## 📂 Architecture & Folder Structure

```
Chat-app-AD-project/
├── App.jsx                       # Application entry point with providers
├── index.js                      # Root component registration
├── app.json                      # Expo app configuration
├── package.json                  # Dependencies and execution scripts
├── __tests__/                    # Automated unit tests
│   └── chatValidation.test.js
└── src/
    ├── components/               # Modular, reusable UI components
    │   ├── Avatar.jsx
    │   ├── ConnectionSettingsModal.jsx
    │   ├── ConversationListItem.jsx
    │   ├── EmptyState.jsx
    │   ├── ErrorState.jsx
    │   ├── LoadingState.jsx
    │   ├── MessageBubble.jsx
    │   ├── MessageInput.jsx
    │   ├── NativeCameraLauncher.jsx
    │   ├── SearchBar.jsx
    │   └── UserListItem.jsx
    ├── constants/                # Configuration and style tokens
    │   ├── config.js
    │   └── theme.js
    ├── context/                  # Global application state
    │   └── AppContext.jsx
    ├── navigation/               # React Navigation stacks and tabs
    │   └── AppNavigator.jsx
    ├── screens/                  # Feature views
    │   ├── ChatScreen.jsx
    │   ├── ConversationsScreen.jsx
    │   ├── CustomCameraScreen.jsx
    │   ├── GroupCreateScreen.jsx
    │   ├── ParticipantInfoScreen.jsx
    │   └── UsersScreen.jsx
    ├── services/                 # Centralized API and device integrations
    │   ├── apiClient.js
    │   ├── conversationService.js
    │   ├── mediaService.js
    │   └── userService.js
    └── utils/                    # Data models, validators and formatters
        ├── formatters.js
        └── models.js
```

---

## 🚀 Running the Project

### Prerequisites
- Node.js (v18 or higher recommended)
- Expo Go app on iOS/Android or an active simulator/emulator

### Installation & Startup
1. Clone the repository:
   ```bash
   git clone https://github.com/YogyeBerry/Chat-app-AD-project.git
   cd Chat-app-AD-project
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run automated tests:
   ```bash
   node __tests__/chatValidation.test.js
   ```
4. Start the Expo development server:
   ```bash
   npx expo start
   ```
5. Scan the QR code using Expo Go on your mobile device or press `i` (iOS simulator) / `a` (Android emulator).
6. Tap the **Settings icon** (top right of the Chats/Contacts tab) in the app to configure your backend server IP/URL.
