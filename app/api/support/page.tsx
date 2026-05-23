import { NextRequest } from 'next/server';
import { successResponse, errorResponse, createdResponse } from '@/lib/api/response';
import { requireAuth } from '@/lib/api/auth';
import { db, generateId } from '@/lib/api/db';

interface Ticket {
  id: string;
  userId: string;
  subject: string;
  category: string;
  message: string;
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

// Add tickets map to db if not exists
if (!(db as any).tickets) {
  (db as any).tickets = new Map<string, Ticket>();
}

export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const { subject, category, message } = body;

    if (!subject || !category || !message) {
      return errorResponse('All fields are required', 400);
    }

    const id = generateId();
    const ticket: Ticket = {
      id,
      userId: user.id,
      subject,
      category,
      message,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (db as any).tickets.set(id, ticket);

    return createdResponse(ticket, 'Support ticket submitted successfully');
  } catch (error) {
    return errorResponse('Failed to submit ticket', 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    // Admin sees all tickets, user sees only their own
    const tickets = Array.from((db as any).tickets.values() as Ticket[]);
    const filtered = user.role === 'admin'
      ? tickets
      : tickets.filter((t: Ticket) => t.userId === user.id);

    return successResponse(filtered);
  } catch (error) {
    return errorResponse('Failed to fetch tickets', 500);
  }
}