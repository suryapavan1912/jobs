// app/api/auth/resend-otp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/mongo';
import { User } from '@/models/user';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // Set to false for better debugging
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  debug: true, // Enable debug logs
  logger: true // Enable logger
});

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ email, isVerified: false });
    if (!user) {
      return NextResponse.json(
        { message: 'User not found or already verified' },
        { status: 400 }
      );
    }

    // Generate new OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 30);

    // Update user with new OTP
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send new verification email
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'New Verification Code',
      html: `
        <h1>New Verification Code</h1>
        <p>Your new verification code is: <strong>${otp}</strong></p>
        <p>This code will expire in 30 minutes.</p>
      `,
    });

    return NextResponse.json({
      message: 'New verification code sent'
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    return NextResponse.json(
      { message: 'An error occurred while resending verification code' },
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