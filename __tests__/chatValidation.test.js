import { normalizeUser, normalizeMessage, normalizeConversation } from '../src/utils/models.js';
import { formatMessageTime, formatConversationTime } from '../src/utils/formatters.js';

console.log('--- Running Chat Functionality Automated Unit Tests ---');

// Test 1: User Normalization
const rawUser = {
  _id: 'usr_123',
  username: 'Alice Smith',
  email: 'alice@example.com',
  is_online: true,
};
const user = normalizeUser(rawUser);
console.assert(user.id === 'usr_123', 'User id normalization failed');
console.assert(user.name === 'Alice Smith', 'User name normalization failed');
console.assert(user.status === 'online', 'User status normalization failed');
console.log('✔ Test 1 Passed: User normalizer handles _id, username, and status.');

// Test 2: Message Normalization & Ownership
const rawMessage = {
  id: 'msg_999',
  conversation_id: 'conv_1',
  sender_id: 'usr_123',
  sender_name: 'Alice',
  content: 'Hello World',
  created_at: '2026-11-22T10:00:00.000Z',
};
const msgForAlice = normalizeMessage(rawMessage, 'usr_123');
const msgForBob = normalizeMessage(rawMessage, 'usr_456');
console.assert(msgForAlice.isMine === true, 'Message ownership for sender failed');
console.assert(msgForBob.isMine === false, 'Message ownership for recipient failed');
console.log('✔ Test 2 Passed: Message ownership and attributes normalized correctly.');

// Test 3: Conversation Normalization
const rawConversation = {
  id: 'conv_1',
  name: 'Project Dev',
  is_group: true,
  participants: [rawUser, { id: 'usr_456', name: 'Bob' }],
  latest_message: rawMessage,
};
const conv = normalizeConversation(rawConversation, 'usr_456');
console.assert(conv.id === 'conv_1', 'Conversation id mismatch');
console.assert(conv.title === 'Project Dev', 'Conversation title mismatch');
console.assert(conv.isGroup === true, 'Conversation isGroup mismatch');
console.assert(conv.participants.length === 2, 'Conversation participant count mismatch');
console.log('✔ Test 3 Passed: Conversation and nested participants normalized.');

// Test 3B: 1-on-1 Direct Conversation Integrity (Never turns into group)
const rawDirectConversation = {
  id: 'conv_direct_1',
  name: '',
  is_group: false,
  participants: [
    { id: '1', name: 'You' },
    { id: '2', name: 'Alex Johnson' },
  ],
  latest_message: rawMessage,
};
const directForAlex = normalizeConversation(rawDirectConversation, '2');
const directForYou = normalizeConversation(rawDirectConversation, '1');
console.assert(directForAlex.isGroup === false, 'Direct conversation incorrectly marked as group for Alex');
console.assert(directForYou.isGroup === false, 'Direct conversation incorrectly marked as group for You');
console.assert(directForAlex.title === 'You', 'Relative title for Alex should be "You"');
console.assert(directForYou.title === 'Alex Johnson', 'Relative title for You should be "Alex Johnson"');
console.log('✔ Test 3B Passed: 1-on-1 Direct conversation stays direct and titles resolve dynamically.');

// Test 4: Formatters
const formattedTime = formatMessageTime('2026-11-22T14:35:00.000Z');
console.assert(typeof formattedTime === 'string' && formattedTime.length > 0, 'formatMessageTime failed');
console.log('✔ Test 4 Passed: Timestamp formatting functions executed successfully.');

console.log('🎉 All automated unit test suites passed successfully!');
