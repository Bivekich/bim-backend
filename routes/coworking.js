const express = require('express');
const pool = require('../db/db');

const router = express.Router();

// Получение информации о доступных коворкингах
router.get('/', async (req, res) => {
    try {
        const coworkingSpaces = await pool.query('SELECT * FROM coworking_spaces');
        res.json(coworkingSpaces.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
});

// Бронирование коворкинга
router.post('/book', async (req, res) => {
    try {
        const { coworkingId, userId, date, startTime, endTime } = req.body;
        const existingBooking = await pool.query('SELECT * FROM coworking_bookings WHERE coworking_id = $1 AND date = $2 AND (($3 >= start_time AND $3 < end_time) OR ($4 > start_time AND $4 <= end_time) OR ($3 <= start_time AND $4 >= end_time))', [coworkingId, date, startTime, endTime]);
        if (existingBooking.rows.length > 0) {
            return res.status(400).json({ message: 'Коворкинг уже забронирован на указанное время' });
        }
        await pool.query('INSERT INTO coworking_bookings (coworking_id, user_id, date, start_time, end_time) VALUES ($1, $2, $3, $4, $5)', [coworkingId, userId, date, startTime, endTime]);
        res.status(201).json({ message: 'Коворкинг успешно забронирован' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
});

// Отмена бронирования коворкинга
router.delete('/cancel/:bookingId', async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        await pool.query('DELETE FROM coworking_bookings WHERE id = $1', [bookingId]);
        res.json({ message: 'Бронирование успешно отменено' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
});

module.exports = router