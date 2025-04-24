require('dotenv').config();
require('express-async-errors');
const express = require('express');
const connectDB = require('./db/connectDB');
const mainRouters = require('./routes/todoRoute');
const authRouter = require('./routes/authRoute');
const userRouter = require('./routes/userRoute');
const genaiRouter = require('./routes/genaiRoute');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');
const authenticated = require('./middlewares/authentication');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Logging MongoDB URI for debugging
console.log("Loaded Mongo URI:", process.env.MONGO_URI);

// 🔧 CORS Configuration
const whitelist = [
  'http://localhost:3000',
  'https://localhost:3000',
  'https://todolist-views.vercel.app'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

// 🔌 Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// 🏠 Test Route
app.get('/', (req, res) => {
  res.send("<h1>Todo List App Running</h1>");
});

// 📦 Routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/todos', authenticated, mainRouters);
app.use('/api/v1/ai', authenticated, genaiRouter);

// ❌ 404 & Error Handling
app.use(notFound);
app.use(errorHandler);

// 🚀 Start Server
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
  }
};

start();

module.exports = app;
