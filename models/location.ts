import mongoose, { Document, Model } from 'mongoose';
import generateUniqueCustomId from '@/utils/customIdGenerator';
import slugify from 'slugify';

export interface ILocation extends Document {
  locationId: string;
  city: string;
  slug: string;
  state?: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  isRemote?: boolean;
  zipCode?: string;
}

const locationSchema = new mongoose.Schema<ILocation>({
  locationId: {
    type: String,
    unique: true,
    required: true
  },
  city: { 
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
  state: { 
    type: String 
  },
  country: { 
    type: String,
    required: true,
    index: true
  },
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  isRemote: {
    type: Boolean,
    default: false
  },
  zipCode: {
    type: String
  }
}, {
  timestamps: true
});

locationSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('city') || this.isModified('country')) {
    // Create a slug from city and country
    const locationString = `${this.city} ${this.state || ''} ${this.country}`.trim();
    this.slug = slugify(locationString, { lower: true, strict: true });
  }
  if (!this.locationId) {
    this.locationId = "l" + generateUniqueCustomId();
  }
  next();
});

locationSchema.index({ 
  city: 'text', 
  state: 'text',
  country: 'text'
});

// Compound index for location-based queries
locationSchema.index({ 
  country: 1, 
  state: 1,
  city: 1
});

export const Location = mongoose.models.Location || mongoose.model<ILocation>('Location', locationSchema); 