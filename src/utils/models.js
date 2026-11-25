/**
 * User Data Model Normalizer & Validator
 * @param {Object} raw
 * @returns {Object} Normalized user object
 */
export function normalizeUser(raw) {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const id = String(raw.id || raw._id || raw.user_id || raw.userId || '');
  const name = String(raw.name || raw.username || raw.full_name || raw.email || 'Anonymous').trim();
  const email = String(raw.email || '').trim();
  const avatar = raw.avatar || raw.avatar_url || raw.profile_picture || raw.image || null;
  const status = raw.status || (raw.is_online ? 'online' : 'offline');

  if (!id) return null;

  return {
    id,
    name,
    email,
    avatar: avatar && typeof avatar === 'string' && avatar.startsWith('http') ? avatar : null,
    status,
    raw,
  };
}

/**
 * Message Data Model Normalizer & Validator
 * @param {Object} raw
 * @param {string} currentUserId
 * @returns {Object} Normalized message object
 */
export function normalizeMessage(raw, currentUserId) {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const id = String(raw.id || raw._id || raw.message_id || raw.messageId || `msg_${Date.now()}_${Math.random()}`);
  const conversationId = String(raw.conversation_id || raw.conversationId || raw.chat_id || '');
  
  // Extract sender
  let senderId = '';
  let senderName = '';
  let senderAvatar = null;

  if (typeof raw.sender === 'object' && raw.sender !== null) {
    senderId = String(raw.sender.id || raw.sender._id || raw.sender.user_id || '');
    senderName = raw.sender.name || raw.sender.username || '';
    senderAvatar = raw.sender.avatar || raw.sender.profile_picture || null;
  } else if (raw.sender_id || raw.senderId || raw.userId || raw.user_id) {
    senderId = String(raw.sender_id || raw.senderId || raw.userId || raw.user_id);
    senderName = raw.sender_name || raw.senderName || '';
  }

  const content = String(raw.content || raw.message || raw.text || raw.body || '');
  const mediaUrl = raw.media_url || raw.mediaUrl || raw.image || raw.imageUrl || raw.attachment || null;
  const createdAt = raw.created_at || raw.createdAt || raw.timestamp || new Date().toISOString();
  
  const isMine = currentUserId ? String(senderId) === String(currentUserId) : false;

  return {
    id,
    conversationId,
    senderId,
    senderName,
    senderAvatar,
    content,
    mediaUrl: mediaUrl && typeof mediaUrl === 'string' ? mediaUrl : null,
    createdAt,
    isMine,
    status: raw.status || 'delivered', // sending, delivered, failed
    raw,
  };
}

/**
 * Conversation Data Model Normalizer & Validator
 * @param {Object} raw
 * @param {string} currentUserId
 * @returns {Object} Normalized conversation object
 */
export function normalizeConversation(raw, currentUserId) {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const id = String(raw.id || raw._id || raw.conversation_id || raw.conversationId || '');
  const isGroup = Boolean(raw.is_group || raw.isGroup || (raw.participants && raw.participants.length > 2));
  
  // Process participants
  let participants = [];
  if (Array.isArray(raw.participants)) {
    participants = raw.participants.map(normalizeUser).filter(Boolean);
  } else if (Array.isArray(raw.users)) {
    participants = raw.users.map(normalizeUser).filter(Boolean);
  }

  // Derive conversation title
  let title = '';
  if (isGroup) {
    title = raw.name || raw.title || raw.group_name || '';
    if (!title) {
      title = participants.length > 0
        ? participants.map((p) => p.name).join(', ')
        : 'Group Conversation';
    }
  } else {
    // In 1-on-1 direct messaging, the title MUST be the other participant relative to the current user
    const otherParticipant = participants.find((p) => String(p.id) !== String(currentUserId));
    title = otherParticipant
      ? otherParticipant.name
      : (participants[0]?.name || raw.name || 'Direct Conversation');
  }

  // Derive last message
  let lastMessage = null;
  if (raw.last_message || raw.lastMessage) {
    lastMessage = normalizeMessage(raw.last_message || raw.lastMessage, currentUserId);
  } else if (raw.latest_message || raw.latestMessage) {
    lastMessage = normalizeMessage(raw.latest_message || raw.latestMessage, currentUserId);
  }

  const updatedAt = raw.updated_at || raw.updatedAt || lastMessage?.createdAt || new Date().toISOString();

  return {
    id,
    title,
    isGroup,
    participants,
    lastMessage,
    updatedAt,
    unreadCount: Number(raw.unread_count || raw.unreadCount || 0),
    raw,
  };
}
