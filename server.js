const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the public directory
app.use(express.static('public'));

// Store connected users and their assigned colors
const connectedUsers = new Map();
const availableColors = [
    '#007bff', // Blue
    '#28a745', // Green  
    '#dc3545', // Red
    '#fd7e14', // Orange
    '#6f42c1', // Purple
    '#20c997', // Teal
    '#e83e8c', // Pink
    '#6c757d', // Gray
    '#17a2b8', // Info blue
    '#ffc107', // Yellow
    '#343a40', // Dark
    '#f8f9fa'  // Light (with dark text)
];

let colorIndex = 0;

// Function to assign a unique color to a user
function assignUserColor(socketId) {
    const color = availableColors[colorIndex % availableColors.length];
    const isDarkText = color === '#ffc107' || color === '#f8f9fa'; // Yellow and light colors need dark text
    
    connectedUsers.set(socketId, {
        color: color,
        isDarkText: isDarkText,
        joinedAt: new Date()
    });
    
    colorIndex++;
    return { color, isDarkText };
}

// Function to remove user and potentially reassign colors
function removeUser(socketId) {
    connectedUsers.delete(socketId);
    // Optionally reset color index when users leave to reuse colors
    if (connectedUsers.size === 0) {
        colorIndex = 0;
    }
}

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    // Assign color to new user
    const userColor = assignUserColor(socket.id);
    
    // Send the user their assigned color
    socket.emit('user color assigned', userColor);
    
    // Broadcast to all users the current user count and colors
    io.emit('user list update', {
        userCount: connectedUsers.size,
        users: Array.from(connectedUsers.entries()).map(([id, data]) => ({
            id,
            color: data.color,
            isDarkText: data.isDarkText
        }))
    });

    socket.on('chat message', (msg) => {
        // console.log('Message:', msg);
        const userData = connectedUsers.get(socket.id);
        
        // Send message with user color info to everyone EXCEPT sender
        socket.broadcast.emit('chat message', {
            message: msg,
            color: userData.color,
            isDarkText: userData.isDarkText,
            senderId: socket.id
        });
    });

    socket.on('file upload', (data) => {
        console.log(`Received file: ${data.fileName}`);
        const userData = connectedUsers.get(socket.id);
        
        // Include user color info with file upload
        io.emit('file upload', {
            ...data,
            color: userData.color,
            isDarkText: userData.isDarkText,
            senderId: socket.id
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        removeUser(socket.id);
        
        // Update all users about the new user count
        io.emit('user list update', {
            userCount: connectedUsers.size,
            users: Array.from(connectedUsers.entries()).map(([id, data]) => ({
                id,
                color: data.color,
                isDarkText: data.isDarkText
            }))
        });
    });
});

const PORT = process.env.PORT || 3005;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});