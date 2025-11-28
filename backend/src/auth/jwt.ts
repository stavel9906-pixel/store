import * as jwt from 'jsonwebtoken';

const secretKey = process.env.SECRET_KEY || 'default_secret';

export function verifyToken(token: string) {
  try {
    const payload = jwt.verify(token, secretKey);
    return payload; // מחזיר את המידע מהטוקן (למשל: { name, role, iat, exp })
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}
