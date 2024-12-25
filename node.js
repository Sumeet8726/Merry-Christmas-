const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// Storage configuration for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// API endpoint for uploading pictures
app.post('/upload', upload.single('picture'), (req, res) => {
    if (req.file) {
        res.status(200).json({ message: 'Picture uploaded successfully!', file: req.file.filename });
    } else {
        res.status(400).json({ message: 'Picture upload failed!' });
    }
});

// Array to store wishes
const wishes = [];

// API endpoint for saving wishes
app.post('/api/wishes', (req, res) => {
    const { wish } = req.body;
    if (wish) {
        wishes.push(wish);
        res.status(200).json({ message: 'Wish received successfully!', wishes });
    } else {
        res.status(400).json({ message: 'Wish is required!' });
    }
});

// API endpoint to get all wishes
app.get('/api/wishes', (req, res) => {
    res.status(200).json(wishes);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
