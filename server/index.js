const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config({ path: '../.env.local' }); // Load .env.local if present

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // allow all origins for dev
    methods: ["GET", "POST"]
  }
});

// In-memory data store for the chat
let users = new Map();
let msgs = [];
let msgIdCounter = 1;

// Helper to generate a random hex color
const getRandomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Restore session or create a new one
  let sessionId = socket.handshake.auth.sessionId || `session_${Math.random().toString(36).substring(2, 9)}`;
  
  // Create user object
  const newUser = {
    id: sessionId,
    socketId: socket.id,
    name: "Anonymous",
    avatar: "1", // Default avatar index or string
    color: getRandomColor(),
    isOnline: "true",
    posX: 0,
    posY: 0,
    location: "Earth",
    flag: "🌍",
    lastSeen: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };

  users.set(socket.id, newUser);

  // Send initial data to the connected client
  socket.emit('session', { sessionId });
  socket.emit('msgs-receive-init', msgs);
  io.emit('users-updated', Array.from(users.values()));

  // -- Event Listeners --

  // 1. Update User Profile
  socket.on('update-user', (data) => {
    const user = users.get(socket.id);
    if (user) {
      user.name = data.username || user.name;
      user.avatar = data.avatar || user.avatar;
      user.color = data.color || user.color;
      users.set(socket.id, user);
      io.emit('users-updated', Array.from(users.values()));
    }
  });

  // 2. Chat Messages
  socket.on('msg-send', (data) => {
    const user = users.get(socket.id);
    if (!user || !data.content) return;

    // Prevent spam (basic check)
    if (data.content.length > 500) {
      return socket.emit('warning', { message: "Message too long!" });
    }

    const newMessage = {
      id: String(msgIdCounter++),
      sessionId: user.id,
      flag: user.flag,
      country: user.location,
      username: user.name,
      avatar: user.avatar,
      color: user.color,
      content: data.content,
      createdAt: new Date().toISOString()
    };

    msgs.push(newMessage);
    
    // Keep max 100 messages in memory
    if (msgs.length > 100) msgs.shift();

    io.emit('msg-receive', newMessage);
  });

  // 3. Typings
  socket.on('typing-send', (data) => {
    const user = users.get(socket.id);
    if (user) {
      // Broadcast to all OTHER clients
      socket.broadcast.emit('typing-receive', { 
        socketId: socket.id, 
        username: data.username || user.name 
      });
    }
  });

  // 4. Remote Cursors
  socket.on('cursor-change', (data) => {
    const user = users.get(socket.id);
    if (user && data.pos) {
      user.posX = data.pos.x;
      user.posY = data.pos.y;
      
      // Broadcast cursor changes (to avoid sending the whole user list on every mouse move)
      socket.broadcast.emit('cursor-changed', {
        socketId: socket.id,
        pos: data.pos,
        avatar: user.avatar,
        color: user.color,
        location: user.location,
        flag: user.flag
      });
    }
  });

  // 5. Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    users.delete(socket.id);
    io.emit('users-updated', Array.from(users.values()));
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Live Chat WebSocket server running on port ${PORT}`);
});
