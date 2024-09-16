const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const getVideoDurationInSeconds = require('get-video-duration').getVideoDurationInSeconds;

const app = express();

app.use(express.json());  // Add this line to your server setup

let uploadedVideos = [];

// Load the uploaded video details from the JSON file at startup
const loadVideoDetails = () => {
    const filePath = path.join(__dirname, 'public', 'videoDetails.json');
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        try {
            uploadedVideos = JSON.parse(data);
        } catch (err) {
            console.error('Error parsing JSON:', err);
        }
    }
};

// Save the uploaded video details to the JSON file
const saveVideoDetails = () => {
    const filePath = path.join(__dirname, 'public', 'videoDetails.json');
    fs.writeFile(filePath, JSON.stringify(uploadedVideos, null, 2), (err) => {
        if (err) {
            console.error('Error writing file', err);
        }
    });
};

// Load the video details when the server starts
loadVideoDetails();

// Set storage engine
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000000 }, // Limit file size to 1GB
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('video');

// Check file type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /mp4|avi|mkv|mov/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Videos Only!');
    }
}


// Upload endpoint
app.post('/upload', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            res.status(400).send(err);
        } else {
            if (req.file == undefined) {
                res.status(400).send('No file selected!');
            } else if (!req.body.videoName || req.body.videoName.trim() === '') {
                res.status(400).json('Missing Video Name\n\nPlease enter a name for your video before uploading.');
            }
             else {
                const videoId = req.file.filename;
                const videoPath = path.join(__dirname, 'uploads', videoId);
                const videoLength = await getVideoDurationInSeconds(videoPath);
                const uploadDate = new Date().toISOString();
                const videoName = req.body.videoName;
                const viewsCount = 0;
                const likesCount = 0;
                const comment = '';
                const videoDetails = {
                    id: videoId,
                    length: videoLength,
                    date: uploadDate,
                    name: videoName,
                    views: viewsCount,
                    likes: likesCount,
                    comments: comment
                };

                uploadedVideos.push(videoDetails);
                saveVideoDetails();
                res.json('Video uploaded!\n\n refresh your page to see result');
            }
        }
    });
});


// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Make uploads folder static
app.use('/uploads', express.static('uploads'));

// Set the port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Endpoint to get uploaded video details
app.get('/videos', (req, res) => {
    res.json(uploadedVideos);
});
// Endpoint to update video views
app.post('/update-views', (req, res) => {
    const videoId = req.body.id;

    // Find the video by its ID
    const video = uploadedVideos.find(video => video.id === videoId);

    if (video) {
        video.views += 1; // Increment the view count
        saveVideoDetails(); // Save the updated video details to the JSON file
        res.json({ success: true, views: video.views });
    } else {
        res.status(404).json({ success: false, message: 'Video not found' });
    }
});

app.post('/update-likes', (req, res) => {
    const videoId2 = req.body.id;

    // Find the video by its ID
    const video = uploadedVideos.find(video => video.id === videoId2);

    if (video) {
        video.likes += 1; // Increment the view count
        saveVideoDetails(); // Save the updated video details to the JSON file
        res.json({ success: true, likes: video.likes });     
    } else {
        res.status(404).json({ success: false, message: 'Video not found' });
    }
});

app.post('/remove-likes', (req, res) => {
    const videoId2 = req.body.id;

    // Find the video by its ID
    const video = uploadedVideos.find(video => video.id === videoId2);

    if (video) {
        video.likes -= 1; 
        saveVideoDetails(); 
        res.json({ success: true, likes: video.likes }); 
    } else {
        res.status(404).json({ success: false, message: 'Video not found' });
    }
});

app.post('/update-comments', (req, res) => {
    const videoId = req.body.id;
    const commentInput = req.body.comment;
    const video = uploadedVideos.find(video => video.id === videoId);
    if (video) {
        if (!video.comments) {
            video.comments = [];
        }
        video.comments.push({ text: commentInput, date: new Date() });
        saveVideoDetails(); 
        res.json({ success: true, comments: video.comments });     
    } else {
        res.status(404).json({ success: false, message: 'Video not found' });
    }
});