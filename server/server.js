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
const { type } = require('os');

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  questions: [
    {
      question: { type: String, required: true },
      options: {
        a: { type: String, required: true },
        b: { type: String, required: true },
        c: { type: String, required: true },
        d: { type: String, required: true },
      },
      answer: { type: String, required: true },
    },
  ],
});

const Quiz = mongoose.model('Quiz', quizSchema);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'server/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const Logger = {
  log: (text, message = '') => {
    console.log(`[INFO]`);
    console.log(`[INFO] ${text}`, message);
  },
  error: (text, message = '') => {
    console.log(`[INFO]`);
    console.log(`[ERROR] ${text}`, message);
  },
};

app.get('/api/quizzes', async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (error) {
    res.status(500).send('Error reading quizzes: ' + error.message);
  }
});

app.post('/api/quizzes', async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    if (!title || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    // Create a new quiz
    const quiz = new Quiz({ title, description, questions });
    const savedQuiz = await quiz.save();

    res.status(201).json(savedQuiz);
  } catch (err) {
    Logger.error('Error saving quiz:', err);
    res.status(500).json({ message: 'Failed to save quiz' });
  }
});

app.post(
  '/api/upload-image',
  upload.array('file'),
  async (request, response) => {
    const files = request.files;
    try {
      if (!files?.length) {
        return response.status(400).json({ message: 'No images uploaded' });
      }

      const filePaths = files.map((file) =>
        path.join(__dirname, '../', file.path),
      );

      const allTexts = await Promise.all(
        filePaths.map((path) => extractText(path)),
      );
      Logger.log(`Length: ################`);
      Logger.log('LENGTH', allTexts.join(' ').length);
      const textChunks = allTexts
        .join(' ')
        .replace(/\s+/g, ' ')
        .replace('\n', ' ')
        .match(/.{1,3500}/g)
        .filter((text) => text.length > 30);
      textChunks.forEach((text, i) => {
        Logger.log(`${i} ################`);
        Logger.log(text);
      });
      const allJsons = await Promise.all(
        textChunks.map((text) => generateQuiz(text)),
      );
      Logger.log('Quiz chunks: ', allJsons);
      const quizJson = allJsons.reduce((quiz, json) => {
        if (json) {
          if (!quiz.title) {
            quiz = { ...json };
          } else {
            quiz = {
              ...quiz,
              questions: [...quiz.questions, ...json.questions],
            };
          }
        }
        return quiz;
      }, {});

      filePaths.forEach((path) => {
        fs.unlinkSync(path);
      });

      Logger.log('Quiz question: ', quizJson);
      response.status(200).json(quizJson);
    } catch (error) {
      Logger.error(error);
      response
        .status(500)
        .json({ message: 'Failed to upload image and generate quiz' });
    }
  },
);

app.delete('/api/quizzes/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Quiz.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res
      .status(200)
      .json({ message: 'Quiz deleted successfully', deletedQuiz: result });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Failed to delete quiz', error: error.message });
  }
});

async function extractText(imagePath) {
  try {
    Logger.log('Text extraction in progress... Please wait...');

    const {
      data: { text },
    } = await tesseract.recognize(imagePath, 'srp', {
      // logger: (m) => console.log(m),
      tessedit_pageseg_mode: '12',
    });

    return text;
  } catch (error) {
    Logger.error('Text extraction failed');
    throw new Error('Text extraction failed');
  }
}

async function generateQuiz(text) {
  let quizJson = null;
  try {
    const prompt = `Направи квиз од следећег текста: "${text}"`;

    Logger.log('Extracted text\n', prompt);
    Logger.log('------------------------------------------------');
    Logger.log('Test creation in progress... Please wait...');

    const messages = [
      {
        role: 'system',
        content:
          "You are an assistant that generates educational quizzes. Respond in JSON format. The JSON should include a 'title' field for the quiz title, and a 'questions' array. Each question object in the array should have 'question' (string), 'options' (object with keys a, b, c, d), and 'answer' (the correct option key). Create as many questions as possible.",
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      max_tokens: 2000,
      temperature: 0.7,
    });

    let quizContent = response.choices?.[0]?.message?.content?.trim() || '{}';
    if (typeof response.choices === 'string') {
      quizContent = '{}';
    }
    quizJson = JSON.parse(quizContent);
  } catch (error) {
    Logger.error('Quiz generation failed.', error);
  }
  return quizJson;
}

const stringChop = function (str, size) {
  // Check if the input string is null; if so, return an empty array.
  if (str == null) return [];
  // Convert the input string to a string if it's not already.
  str = String(str);
  // Convert the size parameter to an integer using the bitwise NOT operator.
  size = ~~size;
  // Check if the size is greater than 0; if so, split the string into chunks of the specified size using a regular expression and return the result as an array.
  return size > 0 ? str.match(new RegExp('.{1,' + size + '}', 'g')) : [str];
};

const localIp = '192.168.1.9';
const PORT = 5000;
app.listen(PORT, localIp, () => {
  Logger.log(`Server is running on port ${PORT}`);
});
