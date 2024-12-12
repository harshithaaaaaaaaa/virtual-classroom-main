const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// Middleware for serving static files from the 'assets' directory
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Middleware
app.use(fileUpload());

app.use(express.static('public', {
    setHeaders: (res, path, stat) => {
      if (path.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      }
    }
  }));

// Route for serving the HTML form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'upload.html'));
});

const http = require('http');
const fs = require('fs');


const server = http.createServer((req, res) => {
    if (req.url === '/upload.html') {
        // Read the HTML file and send it as the response
        fs.readFile(path.join(__dirname, 'public', 'upload.html'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else {
        // Handle other requests (e.g., CSS, JavaScript, images)
        // You may need to add additional logic here to serve other files
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// Route for handling file uploads
app.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const file = req.files.file;
    const uploadPath = path.join(__dirname, 'uploads', file.name);

    file.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.sendStatus(200);
    });
});

app.get('/upload.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'upload.html'));
});

app.get('/style.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'style.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

