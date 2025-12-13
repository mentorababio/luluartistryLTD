import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface TokenPayload {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

export const extractToken = (request: NextRequest): string | null => {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};

export const authenticateRequest = (request: NextRequest): TokenPayload | null => {
  const token = extractToken(request);
  if (!token) {
    return null;
  }
  return verifyToken(token);
};

export const requireAuth = (request: NextRequest): TokenPayload | null => {
  return authenticateRequest(request);
};

export const requireAdmin = (user: TokenPayload | null): boolean => {
  return user?.role === 'admin';
};
