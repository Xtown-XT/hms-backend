// // utils/token.js
// import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';

// dotenv.config();


// const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret';
// const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your_refresh_secret';
// const EXPIRES_IN = '2h'; 
// const REFRESH_EXPIRES_IN = '7d'; 
// /*
//  * Generate a JWT token with user payload
//  * @param {object} payload - user data to encode in token
//  * @returns {string} token
//  */
// export const generateToken = (payload) => {
//   return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
// };

// export const generateRefreshToken = (payload) => {
//   return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
// };

// export const decodeToken = (token) => {
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     return decoded;
//   } catch (err) {
//     throw new Error("Invalid or expired token");
//   }
// };

// export const decodeRefreshToken = (token) => {
//   try {
//     return jwt.verify(token, REFRESH_SECRET);
//   } catch (err) {
//     throw new Error("Invalid or expired refresh token");
//   }
// };


// // utils/token.js
// import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';

// dotenv.config();

// const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
// const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your_refresh_secret';
// const EXPIRES_IN = '2h';
// const REFRESH_EXPIRES_IN = '7d';

// export const generateToken = (payload) => {
//   // Include both role name and role_id if available
//   const tokenPayload = {
//     id: payload.id,
//     role: payload.role || null,
//     role_id: payload.role_id || null,
//     email: payload.email || null, // optional
//   };
//   return jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: EXPIRES_IN });
// };

// export const generateRefreshToken = (payload) => {
//   return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
// };

// export const decodeToken = (token) => {
//   try {
//     return jwt.verify(token, JWT_SECRET);
//   } catch (err) {
//     throw new Error("Invalid or expired token");
//   }
// };

// export const decodeRefreshToken = (token) => {
//   try {
//     return jwt.verify(token, REFRESH_SECRET);
//   } catch (err) {
//     throw new Error("Invalid or expired refresh token");
//   }
// };


import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret';
export const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your_refresh_secret';
const EXPIRES_IN = '365d';
const REFRESH_EXPIRES_IN = '365d';

export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
};

export const decodeToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
};

export const decodeRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_SECRET);
  } catch (err) {
    throw new Error('Invalid or expired refresh token');
  }
};
