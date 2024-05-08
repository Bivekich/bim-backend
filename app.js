const express = require('express');
const authRoutes = require('./routes/auth');
const eventsRoutes = require('./routes/events');

const app = express();

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/events', eventsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер работает по порту ${PORT}`);
})