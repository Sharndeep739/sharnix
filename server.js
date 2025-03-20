const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files serve karna (CSS, JS ke liye)
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sharn',
    database: 'feedback_app'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
    } else {
        console.log('✅ Database connected successfully!');
    }
});

// Route to load the form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Route to submit feedback
app.post('/submit-feedback', (req, res) => {
    const { name, message } = req.body;
    if (!name || !message) {
        return res.status(400).json({ error: 'Please enter name and feedback' });
    }
    
    const sql = 'INSERT INTO feedback (name, message) VALUES (?, ?)';
    db.query(sql, [name, message], (err, result) => {
        if (err) {
            console.error('❌ Error inserting feedback:', err.message);
            return res.status(500).json({ error: 'Failed to submit feedback' });
        }
        res.status(200).json({ message: '✅ Feedback submitted successfully!' });
    });
});

// Start server
app.listen(3000, () => {
    console.log('🚀 Server running on http://localhost:3000');
});
