const express = require('express');
const cors = require('cors');
const http = require('http')
const { WebSocket, Server } = require('ws');
const authRoutes = require('./routes/auth');
const eventsRoutes = require('./routes/events');
const coworkingRoutes = require('./routes/coworking');

const app = express();

const server = http.createServer(app);
const wss = new Server({ server });

const clients = new Map()

app.use(express.json());
app.use(cors())
app.use('/auth', authRoutes);
app.use('/events', eventsRoutes);
app.use('/coworking', coworkingRoutes);

wss.on('connection', (ws) => {
    const clientId = Math.random().toString(36).substring(2);

    clients.set(clientId, ws);

    ws.on('message', (message) => {
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        clients.delete(clientId);
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер работает по порту ${PORT}`);
})