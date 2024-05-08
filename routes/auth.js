const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db/db');

const router = express.Router();

// Регистрация пользователя
router.post('/register', async (req, res) => {
    try {
        const {email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashedPassword]);
        res.status(200).send('Пользователь успешно зарегистрировался');
    } catch (error) {
        console.error(error)
        res.status(500).send('Ошибка при регистрации пользователя');
    }
})

// Авторизация пользователя
router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
        if (!user) {
            return res.status(404).send('Пользователь не найден');
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).send('Неверный пароль');
        }
        res.send('Успешный вход в систему');
    } catch (error) {
        console.error(error)
        res.status(500).send('Ошибка при входе в систему');
    }
})

module.exports = router;