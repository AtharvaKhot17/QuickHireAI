// Load environment variables first, before any other imports
const path = require('path');
const fs = require('fs');

// Use the same approach that worked in your scripts
try {
  const envPath = path.join(__dirname, '.env');
  console.log('Loading .env from:', envPath);
  
  // Read and parse .env file directly
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  for (const line of lines) {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  }

  // Verify the API key was loaded
  if (process.env.GEMINI_API_KEY) {
    console.log('GEMINI_API_KEY loaded successfully');
    console.log('Key starts with:', process.env.GEMINI_API_KEY.substring(0, 8));
  } else {
    throw new Error('GEMINI_API_KEY not found in .env file');
  }

} catch (error) {
  console.error('Error loading .env file:', error);
  process.exit(1); // Exit if we can't load the API key
}

// Now load other modules
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const interviewRoutes = require('./src/routes/interviewRoutes');

// Add detailed debugging
console.log('Final Environment Check:', {
  GEMINI_API_KEY_EXISTS: !!process.env.GEMINI_API_KEY,
  GEMINI_API_KEY_VALUE: process.env.GEMINI_API_KEY,
  NODE_ENV: process.env.NODE_ENV,
  PWD: process.cwd()
});

const app = express();
const port = 5000;

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// Apply multer middleware to specific routes
app.use('/api/interview/answer', upload.single('audioBlob'));
app.use('/api/interview/submit-all', upload.array('answer', 10));

// Routes
app.use('/api/interview', interviewRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ 
      error: 'File Upload Error',
      message: err.message 
    });
  }
  
  if (err.message.includes('Gemini')) {
    return res.status(500).json({ 
      error: 'AI Service Error',
      message: 'Error processing with Gemini API'
    });
  }
  
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
