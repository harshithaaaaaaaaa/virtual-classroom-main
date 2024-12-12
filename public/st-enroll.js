const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Serve files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Enable CORS middleware (if needed)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Endpoint to get the list of files in the 'uploads' folder
app.get('/files', (req, res) => {
    const directoryPath = path.join(__dirname, '../uploads');

    // Read files in the directory
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).send('Error reading files');
        }

        // Send the list of files as JSON
        res.json(files);
    });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
