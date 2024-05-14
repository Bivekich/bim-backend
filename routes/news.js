// newsRouter.js

const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// Получение всех новостей
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM news');
        const news = result.rows;
        res.json(news);
    } catch (error) {
        console.error('Ошибка при получении новостей:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
});

// Получение новости по ID
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await pool.query('SELECT * FROM news WHERE id = $1', [id]);
        const news = result.rows[0];
        if (news) {
            res.json(news);
        } else {
            res.status(404).json({ message: 'Новость не найдена' });
        }
    } catch (error) {
        console.error('Ошибка при получении новости по ID:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
});

// Создание новости
router.post('/', async (req, res) => {
    const { title, content } = req.body;
    try {
        const result = await pool.query('INSERT INTO news (title, content) VALUES ($1, $2) RETURNING *', [title, content]);
        const newNews = result.rows[0];
        res.status(201).json(newNews);
    } catch (error) {
        console.error('Ошибка при создании новости:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
});

// Обновление новости
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { title, content } = req.body;
    try {
        const result = await pool.query('UPDATE news SET title = $1, content = $2 WHERE id = $3 RETURNING *', [title, content, id]);
        const updatedNews = result.rows[0];
        if (updatedNews) {
            res.json(updatedNews);
        } else {
            res.status(404).json({ message: 'Новость не найдена' });
        }
    } catch (error) {
        console.error('Ошибка при обновлении новости:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
});

// Удаление новости
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await pool.query('DELETE FROM news WHERE id = $1 RETURNING *', [id]);
        const deletedNews = result.rows[0];
        if (deletedNews) {
            res.json({ message: 'Новость успешно удалена' });
        } else {
            res.status(404).json({ message: 'Новость не найдена' });
        }
    } catch (error) {
        console.error('Ошибка при удалении новости:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
});

module.exports = router;
