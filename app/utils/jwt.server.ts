import jwt from 'jsonwebtoken';

interface JWTPayload {
  userId: string;
  email: string;
}

export async function createJWT(payload: JWTPayload): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.JWT_SECRET || '',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) reject(err);
        else if (token) resolve(token);
        else reject(new Error('Failed to create token'));
      }
    );
  });
}

export async function verifyJWT(token: string): Promise<JWTPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      process.env.JWT_SECRET || '',
      (err, decoded) => {
        if (err) reject(err);
        else if (decoded && typeof decoded === 'object') {
          resolve(decoded as JWTPayload);
        }
        else reject(new Error('Invalid token'));
      }
    );
  });
}
