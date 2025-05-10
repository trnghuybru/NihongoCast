import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { PeerServer } from 'peer';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Đổi thành origin của client
    methods: ["GET", "POST"]
  }
});

// Thêm xử lý checkUser
io.on('connection', (socket) => {
  socket.on('checkUser', (userData) => {
    const user = JSON.parse(userData);
    // Giả sử luôn cho phép kết nối (cần thêm logic kiểm tra thực tế)
    socket.emit('userOK');
  });
});


const peerServer = PeerServer({
port: 9000,
path: '/peerjs',
allow_discovery: true,
// proxied: true
});
peerServer.on('error', (err) => {
  console.error('PeerServer error:', err);
});
// Xử lý Socket.IO
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('checkUser', (userData) => {
    const existingUser = io.sockets.sockets.get(userData.id);
    if (existingUser) {
      socket.emit('userExists');
    } else {
      socket.emit('userOK');
    }
  });
  console.log('User connected:', socket.id);
  
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);
    
    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId);
    });
  });
});

httpServer.listen(3000, () => {
  console.log('Server running on port 3000');
});