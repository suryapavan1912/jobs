import mongoose, { Document, Model } from 'mongoose';
import generateUniqueCustomId from '@/utils/customIdGenerator';
import slugify from 'slugify';

export interface ICompany extends Document {
  companyId: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  industry?: string;
  size?: string; // e.g., "1-10", "11-50", "51-200", "201-500", "500+"
  founded?: number; // year
  headquarters?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  verified: boolean;
  about?: string;
  benefits?: string[];
}

const companySchema = new mongoose.Schema<ICompany>({
  companyId: {
    type: String,
    unique: true,
    required: true
  },
  name: { 
    type: String, 
    required: true,
    index: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: { 
    type: String 
  },
  logo: { 
    type: String 
  },
  website: { 
    type: String 
  },
  industry: { 
    type: String,
    index: true
  },
  size: { 
    type: String 
  },
  founded: { 
    type: Number 
  },
  headquarters: { 
    type: String 
  },
  socialLinks: {
    linkedin: String,
    twitter: String,
    facebook: String,
    instagram: String
  },
  verified: {
    type: Boolean,
    default: false
  },
  about: {
    type: String
  },
  benefits: {
    type: [String]
  }
}, {
  timestamps: true
});

companySchema.pre('save', function(next) {
  if (this.isNew || this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  if (!this.companyId) {
    this.companyId = "c" + generateUniqueCustomId();
  }
  next();
});

companySchema.index({ 
  name: 'text', 
  description: 'text',
  industry: 'text'
});

export const Company = mongoose.models.Company || mongoose.model<ICompany>('Company', companySchema); 