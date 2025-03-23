require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');  // PostgreSQL ke liye pg module
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Static Files Serve Karna (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// ✅ PostgreSQL Database Connection (Render)
const db = new Pool({
    connectionString: process.env.DATABASE_URL, // Render ka database URL
    ssl: { rejectUnauthorized: false }  // SSL required hai Render pe
});

db.connect()
    .then(() => console.log("✅ Connected to Render PostgreSQL Database!"))
    .catch(err => console.error("❌ Database connection failed:", err.message));

// ✅ Route to Serve Static HTML Pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/Hkotlin', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Hkotlin.html'));
});

app.get('/kotlin', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'kotlin-Eng.html'));
});

// ✅ Route to Submit Feedback
app.post('/submit-feedback', async (req, res) => {
    const { name, message } = req.body;
    if (!name || !message) {
        return res.status(400).json({ error: 'Please enter name and feedback' });
    }

    try {
        const sql = 'INSERT INTO feedback (name, message) VALUES ($1, $2)';
        await db.query(sql, [name, message]);
        res.status(200).json({ message: '✅ Feedback submitted successfully!' });
    } catch (err) {
        console.error('❌ Error inserting feedback:', err.message);
        res.status(500).json({ error: 'Failed to submit feedback' });
    }
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
