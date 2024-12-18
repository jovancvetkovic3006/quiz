const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');
const tesseract = require('tesseract.js');

// Initialize the Express app
dotenv.config();

// Initialize the Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB (replace with your actual connection string]
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define the Quiz model
const quizSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  questions: [
    {
      question: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctAnswer: { type: String, required: true },
    },
  ],
});

const Quiz = mongoose.model('Quiz', quizSchema);
// Set up OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Set up Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Routes
app.post('/api/quizzes', async (req, res) => {
  try {
    const { name, description, questions } = req.body;
    const newQuiz = new Quiz({ name, description, questions });

    await newQuiz.save();
    res.status(201).json(newQuiz);
  } catch (err) {
    console.error('Error saving quiz:', err);
    res.status(500).json({ message: 'Failed to save quiz' });
  }
});

// Route to handle image upload and quiz creation
app.post('/api/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const imagePath = path.join(__dirname, req.file.path);

    // Extract text from the image using OCR (Optical Character Recognition)
    const extractedText = await extractTextFromImage(imagePath);

    // Generate quiz questions from the extracted text
    const quizQuestions = await generateQuizFromText(extractedText);

    // Save the quiz to the database
    const quiz = new Quiz({
      name: 'Generated Quiz from Image',
      description: 'A quiz created from extracted text.',
      questions: quizQuestions,
    });

    await quiz.save();

    // Delete the image file after processing
    fs.unlinkSync(imagePath);

    res.status(200).json(quiz);
  } catch (error) {
    console.error('Error uploading image:', error);
    res
      .status(500)
      .json({ message: 'Failed to upload image and generate quiz' });
  }
});

// Function to extract text from an image (use OCR tool like Tesseract)
async function extractTextFromImage(imagePath) {
  try {
    const {
      data: { text },
    } = await tesseract.recognize(imagePath, 'eng', {
      logger: (m) => console.log(m), // Optional: to log progress
    });
    return text;
  } catch (error) {
    console.error('Error with Tesseract.js OCR:', error);
    throw new Error('Text extraction failed');
  }
}

// Function to generate quiz questions using OpenAI's API
async function generateQuizFromText(text) {
  const prompt = `Generate a quiz from the following text: \n\n${text}\n\nPlease create multiple choice questions with one correct answer.`;

  const response = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful assistant that generates quizzes from text.',
      },
      { role: 'user', content: prompt },
    ],
    model: 'gpt-4', // or the desired model
  });

  const generatedQuizText = response.choices[0].message.content;

  // Convert the generated text into quiz questions format
  return parseQuizText(generatedQuizText);
}

// Function to parse the generated quiz text into a question format
function parseQuizText(text) {
  const lines = text.split('\n');
  const questions = [];

  for (let i = 0; i < lines.length; i++) {
    const questionLine = lines[i].trim();
    if (questionLine) {
      const parts = questionLine.split(' '); // assuming the correct format is "question? A. option B. option ..."
      const question = parts[0];
      const options = parts.slice(1);
      const correctAnswer = options[0]; // This would need to be adjusted based on the structure of OpenAI's response
      questions.push({
        question: question,
        options: options,
        correctAnswer: correctAnswer,
      });
    }
  }
  return questions;
}

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
