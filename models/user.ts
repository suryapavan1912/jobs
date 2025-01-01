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
}

const userSchema = new mongoose.Schema<IUser>({
  userId: {
    type: String,
    unique: true,
    required: true
  },
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: false 
  },
  googleId: { 
    type: String, 
    required: false 
  },
  profilePicture: { 
    type: String 
  }
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