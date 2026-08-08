import mongoose from 'mongoose';

const credentialSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    siteName: {
      type: String,
      required: true,
    },
    siteUrl: {
      type: String,
      default: '',
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Credential = mongoose.model('Credential', credentialSchema);

export default Credential;
