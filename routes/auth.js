const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

router.post(
  '/signup',
  [
    check('email', 'Please provide a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);

    // validate the input
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // validate that user doesn't already exist
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return res.status(403).json({
        errors: [{ msg: 'This user already exists', param: 'email' }],
      });
    }

    // hash the password
    const hashedPw = await bcrypt.hash(password, 10);
    const newUser = await new User({ email, password: hashedPw }).save();

    const token = await jwt.sign({ email }, jwtSecret, {
      expiresIn: 60000,
    });

    res.json({ token });
  }
);

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (!userExists) {
    return res.json({ errors: [{ msg: 'Incorrect Email', param: 'email' }] });
  }

  const passwordMatches = await bcrypt.compare(password, userExists.password);
  if (!passwordMatches) {
    return res.json({
      errors: [{ msg: 'Incorrect Password', param: 'password' }],
    });
  }

  // generate the token
  const token = await jwt.sign({ email }, 'secret', {
    expiresIn: 60000,
  });

  res.cookie('token', token, { httpOnly: true });
  res.status(200).json({ token });
});

router.get('/logout', async (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'you are logged out' });
});

module.exports = router;
