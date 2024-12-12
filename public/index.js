const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 8081;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Anan@123',
    database: 'sdp'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        throw err; // Terminate the application if unable to connect to the database
    }
    console.log('Connected to MySQL database');
});

app.post('/submit_form', (req, res) => {
    const { cid, title, descr, instr_id } = req.body;

    console.log('Received form data:', req.body);

    if (!cid || cid.trim() === '') {
        console.error('COURSE-ID is required');
        return res.status(400).send('course-id is required');
    }

    const sql = 'INSERT INTO course (cid, title, descr, instr_id) VALUES (?, ?, ?, ?)';
    db.query(sql, [cid, title, descr, instr_id], (err, result) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(500).send('Error submitting form');
        }
        console.log('Form submitted successfully');
        res.status(200).json({ // Send back the form data
            cid: cid,
            title: title,
            descr: descr
        });
    });
});


app.get('/student_data', (req, res) => {
    const sql = 'SELECT * FROM course';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(500).send('Error fetching student data');
        }
        console.log('Student data:', result);
        res.json(result);
    });
});

process.on('exit', () => {
    db.end((err) => {
        if (err) {
            console.error('Error closing MySQL connection:', err);
            return;
        }
        console.log('MySQL connection closed');
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});