const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise'); // Using promise-based API for MySQL

const app = express();
const port = 8082;

app.use(cors());
app.use(bodyParser.json());

// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Anan@123',
    database: 'sdp'
};

// Function to authenticate user from the database
async function authenticateUser(username, password, role) {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM signup WHERE susername = ? AND spassword = ? AND srole = ?', [username, password, role]);
        await connection.end();
        return rows.length > 0;
    } catch (error) {
        console.error('Error authenticating user:', error); // Log the error
        return false;
    }
}


// Login route
app.post('/login', async (req, res) => {
    const { username, password, role } = req.body;

    // Authenticate user
    const authenticated = await authenticateUser(username, password, role);

    if (authenticated) {
        res.status(200).send('Login successful');
    } else {
        res.status(401).send('Invalid username or password');
    }
});

/// Route to get user ID by username
app.get('/getUserId', async (req, res) => {
    const { username } = req.query;

    try {
        const db = mysql.createConnection(dbConfig);
        const [rows] = await db.promise().execute('SELECT susername FROM signup WHERE susername = ?', [username]);
        db.end();

        if (rows.length > 0) {
            res.status(200).json({ userId: rows[0].susername });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error retrieving user ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
