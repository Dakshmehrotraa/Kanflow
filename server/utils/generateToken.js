import jwt from 'jsonwebtoken';

/**
 * Sign a stateless JWT carrying the user id.
 * The token is self-contained — no server-side session store is needed.
 */
const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });

export default generateToken;
