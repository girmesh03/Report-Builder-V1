/**
 * Report model.
 *
 * @module models/report
 */
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import constants from '../utils/constants.js';

const audioClipSchema = new mongoose.Schema(
  {
    filename: { type: String, default: '' },
    originalName: { type: String, default: '' },
    mimeType: { type: String, default: '' },
    size: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    storagePath: { type: String, default: '' },
  },
  { _id: false }
);

const transcriptionSchema = new mongoose.Schema(
  {
    text: { type: String, default: '' },
    confidence: { type: Number, default: 0 },
    languageCode: { type: String, default: '' },
    requestId: { type: String, default: '' },
    billedDuration: { type: Number, default: 0 },
    status: {
      type: String,
      enum: Object.values(constants.TASK_STATUS),
      default: constants.TASK_STATUS.PENDING,
    },
    errorMessage: { type: String, default: '' },
  },
  { _id: false }
);

const generationSchema = new mongoose.Schema(
  {
    text: { type: String, default: '' },
    modelVersion: { type: String, default: '' },
    promptVersion: { type: String, default: '' },
    finishReason: { type: String, default: '' },
    inputTokens: { type: Number, default: 0 },
    outputTokens: { type: Number, default: 0 },
    status: {
      type: String,
      enum: Object.values(constants.TASK_STATUS),
      default: constants.TASK_STATUS.PENDING,
    },
    errorMessage: { type: String, default: '' },
  },
  { _id: false }
);

const exportEntrySchema = new mongoose.Schema(
  {
    format: { type: String, default: '' },
    exportedAt: { type: Date, default: null },
    filename: { type: String, default: '' },
  },
  { _id: false }
);

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    reportDate: {
      type: Date,
      required: [true, 'Report date is required'],
    },
    branches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
      },
    ],
    status: {
      type: String,
      enum: Object.values(constants.REPORT_STATUS),
      default: constants.REPORT_STATUS.DRAFT,
    },
    languageMode: {
      type: String,
      default: 'am',
    },
    supervisorName: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    audioClips: [audioClipSchema],
    transcription: {
      type: transcriptionSchema,
      default: () => ({}),
    },
    reviewedTranscription: {
      type: String,
      default: '',
    },
    generatedReport: {
      type: generationSchema,
      default: () => ({}),
    },
    editedReport: {
      type: String,
      default: '',
    },
    exportHistory: [exportEntrySchema],
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ user: 1, reportDate: -1 });
reportSchema.index({ user: 1, status: 1 });
reportSchema.index({ branches: 1 });

reportSchema.plugin(mongoosePaginate);

const Report = mongoose.model('Report', reportSchema);

export default Report;
