/**
 * Local in-memory mock store for standalone / offline APK evaluation.
 * Guarantees the app works 100% out of the box on any mobile device without requiring a running backend server.
 */

const INITIAL_USERS = [
  { id: '1', name: 'You (Demo User)', email: 'you@example.com', status: 'online' },
  { id: '2', name: 'Alex Johnson', email: 'alex@example.com', status: 'online' },
  { id: '3', name: 'Sarah Miller', email: 'sarah@example.com', status: 'offline' },
  { id: '4', name: 'Michael Chen', email: 'michael@example.com', status: 'online' },
  { id: '5', name: 'Emily Davis', email: 'emily@example.com', status: 'online' },
];

let users = [...INITIAL_USERS];

let conversations = [
  {
    id: 'conv_1',
    name: '',
    is_group: false,
    participants: [INITIAL_USERS[0], INITIAL_USERS[1]],
    latest_message: {
      id: 'msg_1',
      conversation_id: 'conv_1',
      sender_id: '2',
      sender_name: 'Alex Johnson',
      content: 'Hey there! How is the project going?',
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    unread_count: 1,
    updated_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'conv_2',
    name: 'Study Group - AD',
    is_group: true,
    participants: [INITIAL_USERS[0], INITIAL_USERS[1], INITIAL_USERS[2], INITIAL_USERS[3]],
    latest_message: {
      id: 'msg_2',
      conversation_id: 'conv_2',
      sender_id: '3',
      sender_name: 'Sarah Miller',
      content: 'Meeting tomorrow at 10 AM to prepare viva notes!',
      created_at: new Date(Date.now() - 1800000).toISOString(),
    },
    unread_count: 2,
    updated_at: new Date(Date.now() - 1800000).toISOString(),
  },
];

let messages = [
  {
    id: 'msg_1',
    conversation_id: 'conv_1',
    sender_id: '2',
    sender_name: 'Alex Johnson',
    content: 'Hey there! How is the project going?',
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'msg_2',
    conversation_id: 'conv_2',
    sender_id: '3',
    sender_name: 'Sarah Miller',
    content: 'Meeting tomorrow at 10 AM to prepare viva notes!',
    created_at: new Date(Date.now() - 1800000).toISOString(),
  },
];

// Contextual simulated responses for offline interactive chat demo
const AUTO_REPLIES = [
  'Got your message! Looks great.',
  'Thanks for the update!',
  'Received! Let me review this and get back to you.',
  'Awesome, sounds like a solid plan.',
  'Photo received clearly!',
  'Perfect, thanks!',
];

export const localMockStore = {
  isOfflineMode: false,

  setOffline(status) {
    this.isOfflineMode = Boolean(status);
  },

  getUsers() {
    return [...users];
  },

  getUserProfile(userId) {
    return users.find((u) => String(u.id) === String(userId)) || users[0];
  },

  getConversations(currentUserId = '1') {
    if (currentUserId) {
      return conversations.filter((c) =>
        c.participants && c.participants.some((p) => String(p.id) === String(currentUserId))
      );
    }
    return [...conversations];
  },

  getMessages(conversationId) {
    return messages.filter((m) => String(m.conversation_id) === String(conversationId));
  },

  sendMessage({ conversation_id, content = '', media_url = null, sender_id = '1', sender_name = 'You' }) {
    const senderUser = users.find((u) => String(u.id) === String(sender_id));
    const resolvedName = sender_name || senderUser?.name || 'You';

    const newMsg = {
      id: `local_msg_${Date.now()}`,
      conversation_id,
      sender_id: String(sender_id),
      sender_name: resolvedName,
      content: content || '',
      media_url: media_url || null,
      created_at: new Date().toISOString(),
    };

    messages.push(newMsg);

    // Update conversation latest message
    const conv = conversations.find((c) => String(c.id) === String(conversation_id));
    if (conv) {
      conv.latest_message = newMsg;
      conv.updated_at = newMsg.created_at;
    }

    // Schedule a simulated auto-reply if chatting in direct 1-on-1 mode to demonstrate live chat
    if (conv && !conv.is_group) {
      setTimeout(() => {
        const otherParticipant = conv.participants.find((p) => String(p.id) !== String(sender_id)) || users[1];
        const replyText = media_url
          ? 'Photo received! Looks very clear.'
          : AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];

        const replyMsg = {
          id: `reply_msg_${Date.now()}`,
          conversation_id,
          sender_id: String(otherParticipant.id),
          sender_name: otherParticipant.name,
          content: replyText,
          media_url: null,
          created_at: new Date().toISOString(),
        };

        messages.push(replyMsg);
        conv.latest_message = replyMsg;
        conv.updated_at = replyMsg.created_at;
      }, 1200);
    }

    return newMsg;
  },

  createConversation({ participant_ids = [], is_group = false, name = '', creator_id = '1' }) {
    const isGroupBool = Boolean(is_group);
    const creator = users.find((u) => String(u.id) === String(creator_id)) || users[0];

    // For 1-on-1 direct conversations, return existing conversation if one already exists
    if (!isGroupBool && participant_ids.length > 0) {
      const otherId = String(participant_ids[0]);
      const existing = conversations.find((c) => {
        if (c.is_group) return false;
        const ids = (c.participants || []).map((p) => String(p.id));
        return ids.length === 2 && ids.includes(String(creator.id)) && ids.includes(otherId);
      });
      if (existing) {
        return existing;
      }
    }

    const otherUsers = users.filter((u) => participant_ids.map(String).includes(String(u.id)));
    const fullParticipants = isGroupBool
      ? [creator, ...otherUsers.filter((u) => String(u.id) !== String(creator.id))]
      : [creator, ...otherUsers.filter((u) => String(u.id) !== String(creator.id))].slice(0, 2);

    let title = name;
    if (!title && isGroupBool) {
      title = fullParticipants.map((p) => p.name).join(', ') || 'Group Chat';
    }

    const newConv = {
      id: `local_conv_${Date.now()}`,
      name: isGroupBool ? title : '',
      is_group: isGroupBool,
      participants: fullParticipants,
      latest_message: null,
      unread_count: 0,
      updated_at: new Date().toISOString(),
    };

    conversations.unshift(newConv);
    return newConv;
  },
};
