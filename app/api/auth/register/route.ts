import { NextRequest } from 'next/server';
import { successResponse, errorResponse, createdResponse } from '@/lib/api/response';
import { generateToken } from '@/lib/api/auth';
import { createUser, getUserByEmail } from '@/lib/api/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Helpful debug log to confirm the endpoint is being called
    // Check terminal running Next dev server for this output
    // (Remove or lower log level in production)
    // eslint-disable-next-line no-console
    console.log('[api/auth/register] POST request received:', { url: request.url, body });
    const { firstName, lastName, email, phone, password } = body;

    // Validation
    if (!firstName || !lastName || !email || !phone || !password) {
      return errorResponse('All fields are required', 400);
    }

    // Check if user already exists
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return errorResponse('User already exists', 409);
    }

    // Create user (in production, hash the password)
    const user = createUser({
      firstName,
      lastName,
      email,
      phone,
      password, // Should be hashed with bcrypt in production
      role: 'user',
    });

    // Generate token
    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    return createdResponse(
      {
        user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone },
        token,
      },
      'User registered successfully'
    );
  } catch (error) {
    return errorResponse('Failed to register user', 500);
  }
}
