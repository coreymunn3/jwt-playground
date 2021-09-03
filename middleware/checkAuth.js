const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const checkAuth = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(400)
      .json({ errors: [{ msg: 'No Token, Please Log In' }] });
  }

  try {
    const user = await jwt.verify(token, jwtSecret);
    req.user = user.email;
    next();
  } catch (error) {
    return res.status(400).json({ errors: [{ msg: 'Token Invalid' }] });
  }
};

module.exports = checkAuth;
