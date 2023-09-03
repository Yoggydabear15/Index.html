const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Create a MySQL database connection
const db = mysql.createConnection({
  host: '127.0.0.1', // Change to your database host
  user: 'root', // Change to your database username
  password: 'ronnoc15', // Change to your database password
  database: 'pushup_tracker', // Change to your database name
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
    return;
  }
  console.log('Connected to the database');
});

// Create a user (POST request)
app.post('/api/users', (req, res) => {
  const { username, email } = req.body; // Assuming you send username and email in the request body

  if (!username || !email) {
    return res.status(400).json({ error: 'Username and email are required' });
  }

  const sql = 'INSERT INTO users (username, email) VALUES (?, ?)';
  const values = [username, email];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // User created successfully
    res.status(201).json({ message: 'User created', userId: result.insertId });
  });
});

// Fetch all users (GET request)
app.get('/api/users', (req, res) => {
  const sql = 'SELECT * FROM users';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Send the list of users as JSON response
    res.json(results);
  });
});

// Start the server
const port = process.env.PORT || 3000; // Use the provided port or 3000 by default
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
