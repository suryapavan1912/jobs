// models/user.ts
import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import generateUniqueCustomId from '@/utils/customIdGenerator';

interface IUser extends Document {
  userId: string;
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  profilePicture?: string;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  otp?: string;
  otpExpiry?: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  userId: {
    type: String,
    unique: true,
    required: true
  },
  name: { 
    type: String, 
    required: function() {
      return this.isVerified; // Only required after verification
    }
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: function() {
      return this.isVerified && !this.googleId; // Required after verification unless Google auth
    }
  },
  googleId: { 
    type: String, 
    required: false 
  },
  profilePicture: { 
    type: String 
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  verificationTokenExpiry: Date,
  otp: String,
  otpExpiry: Date
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (this.isNew && !this.userId) {
    this.userId = "u" + generateUniqueCustomId();
  }
  
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.index({ 
  name: 'text', 
  email: 'text' 
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);