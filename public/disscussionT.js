const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3103;

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
        throw err;
    }
    console.log('Connected to MySQL database');
});

// Route to handle form submission
app.post('/submit_form', (req, res) => {
    const { cid, message ,user_id} = req.body;

    console.log('Received form data:', req.body);

    if (!cid || cid.trim() === '') {
        console.error('COURSE-ID is required');
        return res.status(400).send('COURSE-ID is required');
    }

    const sql = 'INSERT INTO disscussion (cid, message ,user_id) VALUES (?, ?, ?)';
    db.query(sql, [cid, message ,user_id], (err, result) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(500).send('Error submitting form');
        }
        console.log('Message added');
        res.status(200).json({ // Send back the form data
            cid: cid,
            message: message,
            user_id: user_id
        });
    });
});

// Route to fetch courses
app.get('/courses', async (req, res) => {
    try {
        const [courses] = await db.promise().query('SELECT CID FROM Course');
        res.json(courses);
    } catch (err) {
        console.error('Error fetching courses:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to fetch student data
app.get('/student_data', (req, res) => {
    const sql = 'SELECT * FROM disscussion';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(500).send('Error fetching student data');
        }
        console.log('Student data:', result);
        res.json(result);
    });
});

// Route to delete student data
app.delete('/delete_student/:discussionId', (req, res) => {
    const discussionId = req.params.discussionId;
    console.log('Deleting discussion with ID:', discussionId); // Debug statement
    const sql = 'DELETE FROM disscussion WHERE DID = ?';
    db.query(sql, [discussionId], (err, result) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(500).send('Error deleting discussion');
        }
        console.log('Discussion deleted:', result.affectedRows); // Debug statement
        res.sendStatus(200);
    });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
