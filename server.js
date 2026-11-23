const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '15mb' }));

// Initial mock data store
let users = [
  { id: '1', name: 'You (Demo User)', email: 'you@example.com', status: 'online' },
  { id: '2', name: 'Alex Johnson', email: 'alex@example.com', status: 'online' },
  { id: '3', name: 'Sarah Miller', email: 'sarah@example.com', status: 'offline' },
  { id: '4', name: 'Michael Chen', email: 'michael@example.com', status: 'online' },
  { id: '5', name: 'Emily Davis', email: 'emily@example.com', status: 'online' },
];

let conversations = [
  {
    id: 'conv_1',
    name: 'Alex Johnson',
    is_group: false,
    participants: [users[0], users[1]],
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
    participants: [users[0], users[1], users[2], users[3]],
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

// GET /user - Fetch all users
app.get('/user', (req, res) => {
  res.json(users);
});

// GET /user/profile - Fetch user profile
app.get('/user/profile', (req, res) => {
  const userId = req.query.user_id;
  const user = users.find((u) => String(u.id) === String(userId)) || users[0];
  res.json({ user });
});

// GET /conversation - Fetch all conversations
app.get('/conversation', (req, res) => {
  res.json(conversations);
});

// POST /conversation - Create conversation
app.post('/conversation', (req, res) => {
  const { participant_ids = [], is_group = false, name = '', creator_id = '1' } = req.body;
  const participants = users.filter((u) => participant_ids.map(String).includes(String(u.id)));

  // Find or identify creator
  const creator = users.find((u) => String(u.id) === String(creator_id)) || {
    id: String(creator_id),
    name: 'You',
  };

  // Ensure creator is in participants list
  const fullParticipants = participants.some((p) => String(p.id) === String(creator.id))
    ? participants
    : [creator, ...participants];

  let title = name;
  if (!title) {
    title = is_group
      ? participants.map((p) => p.name).join(', ')
      : participants[0]?.name || 'Chat';
  }

  const newConv = {
    id: `conv_${Date.now()}`,
    name: title,
    is_group: Boolean(is_group),
    participants: fullParticipants,
    latest_message: null,
    unread_count: 0,
    updated_at: new Date().toISOString(),
  };

  conversations.unshift(newConv);
  res.status(201).json({ conversation: newConv });
});

// GET /message - Fetch message history
app.get('/message', (req, res) => {
  const convId = req.query.conversation_id;
  const filtered = messages.filter((m) => String(m.conversation_id) === String(convId));
  res.json(filtered);
});

// POST /message - Send message
app.post('/message', (req, res) => {
  const { conversation_id, content = '', media_url = null, sender_id = '1', sender_name } = req.body;

  const senderUser = users.find((u) => String(u.id) === String(sender_id));
  const resolvedName = sender_name || senderUser?.name || 'User';

  const newMsg = {
    id: `msg_${Date.now()}`,
    conversation_id,
    sender_id: String(sender_id),
    sender_name: resolvedName,
    content: content || '',
    media_url: media_url || null,
    created_at: new Date().toISOString(),
  };

  messages.push(newMsg);

  // Update latest message in conversation
  const conv = conversations.find((c) => String(c.id) === String(conversation_id));
  if (conv) {
    conv.latest_message = newMsg;
    conv.updated_at = newMsg.created_at;
  }

  res.status(201).json({ message: newMsg });
});

// POST /upload - Image upload endpoint
app.post('/upload', (req, res) => {
  res.json({ url: req.body?.uri || 'https://via.placeholder.com/300' });
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server successfully running at http://0.0.0.0:${PORT}`);
});
