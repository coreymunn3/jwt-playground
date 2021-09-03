const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const connectDb = async () => {
  const uri = process.env.MONGO_URI;
  const connection = await mongoose.connect(uri);
};
connectDb();

app.get('/', (req, res) => {
  res.json({ message: 'Welcome' });
});
app.use(express.json());
app.use(cookieParser());
app.use('/auth', require('./routes/auth'));
app.use('/posts', require('./routes/posts'));

app.listen(5000, () => {
  console.log('App running on Port 5000');
});
