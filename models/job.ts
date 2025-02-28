import mongoose, { Document, Model, Schema } from 'mongoose';
import generateUniqueCustomId from '@/utils/customIdGenerator';
import slugify from 'slugify';

export interface IJob extends Document {
  jobId: string;
  title: string;
  slug: string;
  description: string;
  company: Schema.Types.ObjectId; // Reference to Company model
  location: Schema.Types.ObjectId; // Reference to Location model
  categories: Schema.Types.ObjectId[]; // References to Category model
  employmentType: string; // full-time, part-time, contract, etc.
  workplaceType: string; // on-site, remote, hybrid
  experienceLevel?: string; // entry, mid, senior
  educationLevel?: string;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
    period?: string; // hourly, monthly, annual
  };
  applicationLink?: string; // External application URL
  applicationDeadline?: Date;
  applicationEmail?: string;
  postedDate: Date;
  isActive: boolean;
  isFeatured: boolean;
  isRemote: boolean;
  skills: string[];
  responsibilities?: string[];
  requirements?: string[];
  benefits?: string[];
  views: number;
  externalSource?: string; // where the job was scraped from
  externalId?: string; // original ID from the source
  lastScraped?: Date; // when the job was last scraped/updated
}

const jobSchema = new mongoose.Schema<IJob>({
  jobId: {
    type: String,
    unique: true,
    required: true
  },
  title: { 
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
    type: String,
    required: true
  },
  company: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  location: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true,
    index: true
  },
  categories: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    index: true
  }],
  employmentType: { 
    type: String,
    required: true,
    enum: ['full-time', 'part-time', 'contract', 'temporary', 'internship', 'freelance'],
    index: true
  },
  workplaceType: {
    type: String,
    required: true,
    enum: ['on-site', 'remote', 'hybrid'],
    index: true
  },
  experienceLevel: { 
    type: String,
    enum: ['entry', 'mid-level', 'senior', 'executive'],
    index: true
  },
  educationLevel: {
    type: String,
    enum: ['high-school', 'bachelor', 'master', 'phd', 'none']
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    period: {
      type: String,
      enum: ['hourly', 'monthly', 'annual'],
      default: 'annual'
    }
  },
  applicationLink: { 
    type: String 
  },
  applicationDeadline: { 
    type: Date 
  },
  applicationEmail: {
    type: String
  },
  postedDate: { 
    type: Date,
    default: Date.now,
    index: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  isRemote: {
    type: Boolean,
    default: false,
    index: true
  },
  skills: [{
    type: String,
    index: true
  }],
  responsibilities: [String],
  requirements: [String],
  benefits: [String],
  views: {
    type: Number,
    default: 0
  },
  externalSource: {
    type: String,
    index: true
  },
  externalId: {
    type: String
  },
  lastScraped: {
    type: Date
  }
}, {
  timestamps: true
});

jobSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  if (!this.jobId) {
    this.jobId = "j" + generateUniqueCustomId();
  }
  next();
});

// Text search indexes
jobSchema.index({ 
  title: 'text', 
  description: 'text',
  skills: 'text',
  responsibilities: 'text',
  requirements: 'text'
}, {
  weights: {
    title: 10,
    skills: 5,
    description: 3,
    responsibilities: 2,
    requirements: 2
  }
});

// Compound indexes for common queries
jobSchema.index({ isActive: 1, postedDate: -1 }); // Recent active jobs
jobSchema.index({ isActive: 1, isFeatured: 1, postedDate: -1 }); // Featured jobs
jobSchema.index({ company: 1, isActive: 1, postedDate: -1 }); // Jobs by company
jobSchema.index({ "salary.min": 1, "salary.max": 1 }); // Salary range searches

export const Job = mongoose.models.Job || mongoose.model<IJob>('Job', jobSchema); 