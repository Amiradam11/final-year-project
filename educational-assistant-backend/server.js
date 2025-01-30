const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the MySQL database.');
    }
});

// Registration Endpoint
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the email already exists
        const [rows] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.status(400).json({ message: 'Email already registered.' });
        }

        // Hash the password and insert the user
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.promise().query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Login Endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the email exists
        const [rows] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const user = rows[0];

        // Validate the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Protected Route for Dashboard
app.get('/dashboard', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied.' });

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        res.json({ message: `Welcome, user ${decoded.email}!` });
    } catch (err) {
        res.status(403).json({ message: 'Invalid token.' });
    }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
