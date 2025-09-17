require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const PORT = process.env.PORT || 5000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// Get items
app.get('/api/items', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, name FROM items ORDER BY id DESC LIMIT 100');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add item
app.post('/api/items', async (req, res) => {
  try {
    const { name } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO items(name) VALUES($1) RETURNING id, name',
      [name]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));