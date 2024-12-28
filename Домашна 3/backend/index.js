const { Pool } = require('pg');
const express = require('express');

const app = express();
const cors = require('cors');
const port = 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',  
    database: 'DIANS',
    password: 'postgres',
    port: 5433,       
});


pool.connect((err, client, release) => {
    if (err) {
        console.error('Error acquiring client', err.stack);
    } else {
        console.log('Connected to the database');
        release();
    }
});


app.get('/api/codes', async (req, res) => {
    try {
        const query = 'SELECT DISTINCT code FROM stock_data;';
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching codes:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/codestats', async (req, res) => {
    try {
        const query = `
            SELECT 
            code,
            COALESCE(MIN(CAST(min AS numeric)), 0) AS min_value,
            COALESCE(MAX(CAST(max AS numeric)), 0) AS max_value,
            COALESCE(AVG(CAST(avg AS numeric)), 0) AS avg_value
        FROM 
            stock_data
        GROUP BY 
            code;
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

