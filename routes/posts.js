const router = require('express').Router();
const Post = require('../models/post');
const checkAuth = require('../middleware/checkAuth');

router.post('/create', async (req, res) => {
  const { title, content, private } = req.body;

  if (!title || !content || !private) {
    return res.status(400).json({ error: 'Missing Data!' });
  }

  const newPost = await new Post({ title, content, private }).save();

  res.status(200).json(newPost);
});

router.get('/public', async (req, res) => {
  const publicPosts = await Post.find({
    private: false,
  });

  res.json(publicPosts);
});

router.get('/private', checkAuth, async (req, res) => {
  const privatePosts = await Post.find({
    private: true,
  });

  res.json(privatePosts);
});

module.exports = router;
