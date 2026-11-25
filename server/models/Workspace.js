import mongoose from 'mongoose';

/**
 * A column is embedded in its workspace — columns are structural and
 * always loaded together with the board, so embedding avoids extra round-trips.
 */
const columnSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    color: { type: String, default: '#8e8ea8' },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

/**
 * Workspace = a project board shared by a set of members.
 * `members` drives workspace-level resource isolation and role-based access:
 * only listed members can read, and only owner/editor can mutate.
 */
const workspaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Workspace name is required'], trim: true },
    color: { type: String, default: '#6c5ce7' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        role: { type: String, enum: ['owner', 'editor', 'viewer'], default: 'editor' },
      },
    ],
    columns: [columnSchema],
  },
  { timestamps: true }
);

// Helper: resolve a given user's role within this workspace (or null).
workspaceSchema.methods.roleOf = function (userId) {
  const m = this.members.find((x) => x.user.toString() === userId.toString());
  return m ? m.role : null;
};

export default mongoose.model('Workspace', workspaceSchema);
