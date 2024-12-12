const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const app = express();

// Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use the original name of the file
    }
});

const upload = multer({ storage: storage });

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Serve the upload.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'uploadFile.html'));
});

// Handle file upload
app.post('/upload', upload.single('fileUpload'), (req, res) => {
    res.send('File uploaded successfully!');
});

// Serve uploaded files dynamically
app.get('/uploads/:filename', (req, res) => {
    const fileName = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', fileName);

    // Check if the file exists
    if (fs.existsSync(filePath)) {
        // Stream the file to the client
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    } else {
        res.status(404).send('File not found');
    }
});

// Handle request to list files
app.get('/listFiles', (req, res) => {
    fs.readdir(path.join(__dirname, 'uploads'), (err, files) => {
        if (err) {
            console.error('Error reading uploads directory:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(files);
        }
    });
});

// Create uploads folder if not exists
const uploadsFolder = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsFolder)) {
    fs.mkdirSync(uploadsFolder);
}

const PORT = process.env.PORT || 3100;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    // Automatically open the default browser
    // opn(`http://localhost:${PORT}`);
});
