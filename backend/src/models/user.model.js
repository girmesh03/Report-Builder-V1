/**
 * User model.
 *
 * @module models/user
 */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import constants from '../utils/constants.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: constants.AUTH.NAME_MIN_LENGTH,
      maxlength: constants.AUTH.NAME_MAX_LENGTH,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: false,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      enum: Object.values(constants.ROLES),
      default: constants.ROLES.USER,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
      maxlength: constants.PHONE_MAX_LENGTH,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.index({ email: 1 }, { unique: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

/**
 * Compare a candidate password against the stored hash.
 *
 * @param {string} candidatePassword - Plain text password to compare
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

/**
 * Return a safe public profile object (excludes passwordHash).
 *
 * @returns {object}
 */
userSchema.methods.toPublicProfile = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    avatarUrl: this.avatarUrl,
    phone: this.phone,
    isActive: this.isActive,
    lastLoginAt: this.lastLoginAt,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const User = mongoose.model('User', userSchema);

export default User;
