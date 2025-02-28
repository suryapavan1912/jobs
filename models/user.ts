// models/user.ts
import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import generateUniqueCustomId from '@/utils/customIdGenerator';
import slugify from 'slugify';

interface IUser extends Document {
  userId: string;
  name: string;
  slug: string;
  email: string;
  password?: string;
  googleId?: string;
  profilePicture?: string;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  otp?: string;
  otpExpiry?: Date;
  savedJobs?: mongoose.Schema.Types.ObjectId[]; // References to Job model
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
  slug: {
    type: String,
    unique: true,
    lowercase: true
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
  otpExpiry: Date,
  savedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }],
}, {
  timestamps: true
});

userSchema.pre('save', function(next) {
  // Generate userId if new
  if (this.isNew && !this.userId) {
    this.userId = "u" + generateUniqueCustomId();
  }
  
  // Generate slug if needed
  if ((this.isNew || this.isModified('name')) && this.name) {
    // Use name and part of userId for uniqueness
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  
  // Hash password if changed
  if (this.isModified('password') && this.password) {
    // Use bcrypt async
    return bcrypt.hash(this.password, 10)
      .then(hash => {
        this.password = hash;
        next();
      })
      .catch(err => next(err));
  }
  next();
});

userSchema.index({ 
  name: 'text', 
  email: 'text'
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);