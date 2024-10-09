const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const fs = require("fs");

// Create the uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Create directory recursively
}

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set the view engine to EJS
app.set("view engine", "ejs");

// Multer configuration for storing files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); // Corrected path to store files inside 'public/uploads'
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  res.render('index', { imageUrl: null });
});

app.post('/upload', upload.single('image'), (req, res, next) => {
  console.log(req.file);

  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const imageUrl = `/uploads/${req.file.filename}`;  // File URL to be used in the frontend
  res.render('index', { imageUrl: imageUrl });  // Render the image in index view
});

app.listen(3000, () => console.log("Server is running on port 3000"));
