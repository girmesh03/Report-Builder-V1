/**
 * OAuth account model.
 *
 * Links a third-party OAuth provider account to a local user.
 *
 * @module models/oauthAccount
 */
import mongoose from 'mongoose';

const oauthAccountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    provider: {
      type: String,
      required: true,
      trim: true,
    },
    providerAccountId: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    displayName: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

oauthAccountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

const OAuthAccount = mongoose.model('OAuthAccount', oauthAccountSchema);

export default OAuthAccount;
