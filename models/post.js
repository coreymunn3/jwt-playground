const mongoose = require('mongoose');

const Post = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: String,
  private: Boolean,
});

module.exports = mongoose.model('post', Post);
