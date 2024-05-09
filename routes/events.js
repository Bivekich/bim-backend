const express = require('express');
const pool = require('../db/db');

const router = express.Router();

// Создание мероприятия
router.post('/', async (req, res) => {
    try {
        const { title, description, date } = req.body;
        const result = await pool.query('INSERT INTO events (title, description, date) VALUES ($1, $2, $3) RETURNING *', [title, description, date]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
});

// Получение списка всех мероприятий
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM events');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
});

// Получение информации о конкретном мероприятии
router.get('/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Событие не найдено' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
});

// Обновление информации о мероприятии
router.put('/:id', async (req, res) => {
    try {
        const { title, description, date } = req.body;
        const result = await pool.query('UPDATE events SET title = $1, description = $2, date = $3 WHERE id = $4 RETURNING *', [title, description, date, req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Событие не найдено' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
});

// Удаление мероприятия
router.delete('/:id', async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING *', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Событие не найдено' });
        }
        res.json({ message: 'Событие успешно удалено' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
});

// Добавление участника к мероприятию
router.post('/:eventId/participants', async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const { userId } = req.body;
        const result = await pool.query('SELECT * FROM event_participants WHERE event_id = $1 AND user_id = $2', [eventId, userId]);
        if (result.rows.length > 0) {
            return res.status(400).json({ message: 'Участник уже зарегистрирован на мероприятие' });
        } else {
            await pool.query('INSERT INTO event_participants (event_id, user_id) VALUES ($1, $2) RETURNING *', [eventId, userId]);
        }
        res.status(201).json({ message: 'Участник успешно добавлен' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
});

// Удаление участника из мероприятия
router.delete('/:eventId/participants/:userId', async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const userId = req.params.userId;
        await pool.query('DELETE FROM event_participants WHERE event_id = $1 AND user_id = $2 RETURNING *', [eventId, userId]);
        res.json({ message: 'Участник успешно удален' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
});

// Получение списка участников мероприятия
router.get('/:eventId/participants', async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const result = await pool.query('SELECT * FROM event_participants WHERE event_id = $1', [eventId]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
});


module.exports = router;

