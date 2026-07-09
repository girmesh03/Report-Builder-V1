/**
 * Branch model.
 *
 * @module models/branch
 */
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import constants from '../utils/constants.js';

const branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Branch name is required'],
      trim: true,
      enum: {
        values: constants.BRANCH_NAMES,
        message: 'Branch name must be one of the predefined branches',
      },
    },
    code: {
      type: String,
      required: [true, 'Branch code is required'],
      trim: true,
      uppercase: true,
      minlength: constants.BRANCH.CODE_MIN_LENGTH,
      maxlength: constants.BRANCH.CODE_MAX_LENGTH,
    },
    branch: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    managerName: {
      type: String,
      trim: true,
      default: '',
    },
    managerPhone: {
      type: String,
      trim: true,
      default: '',
      maxlength: constants.PHONE_MAX_LENGTH,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

branchSchema.index({ code: 1 }, { unique: true });
branchSchema.index({ name: 1 });

branchSchema.plugin(mongoosePaginate);

const Branch = mongoose.model('Branch', branchSchema);

export default Branch;
