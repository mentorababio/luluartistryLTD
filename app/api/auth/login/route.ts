import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { generateToken } from '@/lib/api/auth';
import { getUserByEmail } from '@/lib/api/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return errorResponse('Email and password are required', 400);
    }

    // Check if user exists
    const user = getUserByEmail(email);
    if (!user) {
      return errorResponse('Invalid credentials', 401);
    }

    // Verify password (in production, use bcrypt)
    if (user.password !== password) {
      return errorResponse('Invalid credentials', 401);
    }

    // Generate token
    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    return successResponse(
      {
        user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone },
        token,
      },
      'Login successful'
    );
  } catch (error) {
    return errorResponse('Failed to login', 500);
  }
}
