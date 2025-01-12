// app/api/auth/setup-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/mongo';
import { User } from '@/models/user';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  email: string;
  verificationToken: string;
}

export async function POST(request: NextRequest) {
  try {
    const { email, token, password } = await request.json();

    if (!email || !token || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Verify JWT
    let decoded: TokenPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    } catch (error) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find user with matching email and verification token
    const user = await User.findOne({
      email,
      verificationToken: decoded.verificationToken,
      verificationTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid or expired verification link' },
        { status: 400 }
      );
    }

    // Update user
    user.password = password;
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    user.name = email.split('@')[0]; // Set a default name (can be updated later)
    await user.save();

    return NextResponse.json({
      message: 'Password set successfully'
    });

  } catch (error) {
    console.error('Setup password error:', error);
    return NextResponse.json(
      { message: 'An error occurred while setting up password' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { message: 'This endpoint only supports POST requests' },
    { status: 405 }
  );
}