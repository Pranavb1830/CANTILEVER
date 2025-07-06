const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
const path = require('path');


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads'));


app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.get('/', (req, res) => {
  res.send('Welcome to my blog API!');
});


const PORT = process.env.PORT || 5000;
connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
