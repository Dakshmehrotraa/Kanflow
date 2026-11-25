import mongoose from 'mongoose';

/**
 * Card = a task living in one column of one workspace.
 * Cards are a separate collection (not embedded) because they are the
 * high-churn entity: created, moved and reordered constantly. Keeping them
 * flat makes status updates and per-column queries cheap and indexable.
 */
const cardSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
      index: true,
    },
    // References the embedded column _id on the parent workspace.
    column: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    title: { type: String, required: [true, 'Task title is required'], trim: true },
    description: { type: String, default: '' },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    due: { type: Date },
    assignee: { type: String, default: '' }, // initials or display tag
    tags: [{ type: String, trim: true }],
    // Fractional/integer rank used to order cards within a column.
    order: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('Card', cardSchema);
