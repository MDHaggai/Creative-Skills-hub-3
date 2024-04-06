require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import the student and editor routes
const studentRoutes = require('./student-auth-server');
const editorRoutes = require('./editor-auth-server');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/creative-hub-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Database connected'))
  .catch((err) => console.error('Database connection error:', err));

// Use the imported routes
app.use('/api/student', studentRoutes);
app.use('/api/editor', editorRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
