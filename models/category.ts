import mongoose, { Document, Model, Schema } from 'mongoose';
import generateUniqueCustomId from '@/utils/customIdGenerator';
import slugify from 'slugify';

export interface ICategory extends Document {
  categoryId: string;
  name: string;
  slug: string;
  parentCategory?: Schema.Types.ObjectId; // Reference to parent category for hierarchical structure
  description?: string;
  iconUrl?: string;
  isActive: boolean;
  order?: number; // For custom ordering in UI
}

const categorySchema = new mongoose.Schema<ICategory>({
  categoryId: {
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
  parentCategory: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  description: { 
    type: String 
  },
  iconUrl: { 
    type: String 
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

categorySchema.pre('save', function(next) {
  if (this.isNew || this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  if (!this.categoryId) {
    this.categoryId = "cat" + generateUniqueCustomId();
  }
  next();
});

categorySchema.index({ 
  name: 'text', 
  description: 'text'
});

export const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema); 