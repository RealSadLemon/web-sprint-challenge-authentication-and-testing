const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'shhhhh!';

module.exports = (req, res, next) => {
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
  if(!req.headers.authorization){
    res.status(401).json({ message: 'Token required' });
  };
  jwt.verify(req.headers.authorization, JWT_SECRET, (err, token) => {
    if(err) {
      res.status(401).json({ message: 'Token invalid' });
      return;
    };
    next();
  });
};
