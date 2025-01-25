// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/mongo';
import { User } from '@/models/user';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { getEmailTemplate, replaceTemplateVariables } from '@/utils/email';

// Configure email transport with more detailed logs
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

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 30);

    // Create or update user
    if (existingUser) {
      existingUser.otp = otp;
      existingUser.otpExpiry = otpExpiry;
      await existingUser.save();
    } else {
      await User.create({
        email,
        otp,
        otpExpiry,
        userId: "u" + crypto.randomBytes(8).toString('hex')
      });
    }

    // Verify SMTP connection before sending
    try {
      await transporter.verify();
    } catch (smtpError) {
      console.error('SMTP verification failed:', smtpError);
      throw new Error('SMTP connection failed');
    }

    
    // Get and prepare email template
    const template = await getEmailTemplate('verify-email');
    const emailHtml = replaceTemplateVariables(template, { otp });

    // Send verification email
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@example.com',
        to: email,
        subject: 'Verify your email',
        html: emailHtml,
      });
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      throw new Error('Email sending failed');
    }

    return NextResponse.json(
      { message: 'Verification code sent' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Signup error details:', {
      name: (error as Error).name,
      message: (error as Error).message,
      stack: (error as Error).stack,
    });

    return NextResponse.json(
      { 
        message: 'An error occurred during signup',
        details: (error as Error).message // Remove in production!
      },
      { status: 500 }
    );
  }
}