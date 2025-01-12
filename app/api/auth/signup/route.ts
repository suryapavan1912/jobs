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
    // Log environment variables (remove in production!)
    console.log('SMTP Config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER ? 'Set' : 'Not set',
      pass: process.env.SMTP_PASS ? 'Set' : 'Not set',
    });

    const { email } = await request.json();
    console.log('Received email:', email);

    if (!email) {
      console.log('Email missing in request');
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    console.log('Connecting to database...');
    await connectToDatabase();
    console.log('Database connected successfully');

    // Check if user exists
    console.log('Checking for existing user...');
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      console.log('User already exists and is verified');
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Generate OTP
    console.log('Generating OTP...');
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 30);

    // Create or update user
    console.log('Creating/updating user in database...');
    if (existingUser) {
      console.log('Updating existing unverified user');
      existingUser.otp = otp;
      existingUser.otpExpiry = otpExpiry;
      await existingUser.save();
    } else {
      console.log('Creating new user');
      await User.create({
        email,
        otp,
        otpExpiry,
        userId: "u" + crypto.randomBytes(8).toString('hex')
      });
    }

    console.log('Preparing to send email...');
    // Verify SMTP connection before sending
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (smtpError) {
      console.error('SMTP verification failed:', smtpError);
      throw new Error('SMTP connection failed');
    }

    
    // Get and prepare email template
    console.log('Getting email template...');
    const template = await getEmailTemplate('verify-email');
    const emailHtml = replaceTemplateVariables(template, { otp });

    // Send verification email
    console.log('Sending verification email...');
    try {
      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@example.com',
        to: email,
        subject: 'Verify your email',
        html: emailHtml,
      });
      console.log('Email sent successfully:', info);
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      throw new Error('Email sending failed');
    }

    console.log('Signup process completed successfully');
    return NextResponse.json(
      { message: 'Verification code sent' },
      { status: 200 }
    );

  } catch (error) {
    // Detailed error logging
    console.error('Signup error details:', {
      name: (error as Error).name,
      message: (error as Error).message,
      stack: (error as Error).stack,
    });

    // Return more specific error message
    return NextResponse.json(
      { 
        message: 'An error occurred during signup',
        details: (error as Error).message // Remove in production!
      },
      { status: 500 }
    );
  }
}