import Workspace from '../models/Workspace.js';
import Card from '../models/Card.js';

const DEFAULT_COLUMNS = [
  { name: 'Backlog', color: '#8e8ea8', order: 0 },
  { name: 'In Progress', color: '#00b894', order: 1 },
  { name: 'Review', color: '#fdcb6e', order: 2 },
  { name: 'Done', color: '#6c5ce7', order: 3 },
];

// @desc   List workspaces the user belongs to
// @route  GET /api/workspaces
// @access Private
export const getWorkspaces = async (req, res, next) => {
  try {
    const workspaces = await Workspace.find({ 'members.user': req.user._id })
      .sort('-updatedAt')
      .lean();
    res.json(workspaces);
  } catch (err) {
    next(err);
  }
};

// @desc   Create a workspace (creator becomes owner)
// @route  POST /api/workspaces
// @access Private
export const createWorkspace = async (req, res, next) => {
  try {
    const { name, color } = req.body;
    if (!name) return res.status(400).json({ message: 'Workspace name is required' });
    const workspace = await Workspace.create({
      name,
      color: color || '#6c5ce7',
      owner: req.user._id,
      members: [{ user: req.user._id, role: 'owner' }],
      columns: DEFAULT_COLUMNS,
    });
    res.status(201).json(workspace);
  } catch (err) {
    next(err);
  }
};

// @desc   Get a single workspace (with its cards)
// @route  GET /api/workspaces/:id
// @access Private (member) — enforced by workspaceAccess
export const getWorkspace = async (req, res, next) => {
  try {
    const cards = await Card.find({ workspace: req.workspace._id }).sort('order').lean();
    res.json({ ...req.workspace.toObject(), cards });
  } catch (err) {
    next(err);
  }
};

// @desc   Update workspace meta / columns
// @route  PATCH /api/workspaces/:id
// @access Private (editor+)
export const updateWorkspace = async (req, res, next) => {
  try {
    const { name, color, columns } = req.body;
    const ws = req.workspace;
    if (name !== undefined) ws.name = name;
    if (color !== undefined) ws.color = color;
    if (Array.isArray(columns)) ws.columns = columns;
    await ws.save();
    res.json(ws);
  } catch (err) {
    next(err);
  }
};

// @desc   Delete a workspace and all its cards
// @route  DELETE /api/workspaces/:id
// @access Private (owner only)
export const deleteWorkspace = async (req, res, next) => {
  try {
    await Card.deleteMany({ workspace: req.workspace._id });
    await req.workspace.deleteOne();
    res.json({ message: 'Workspace deleted' });
  } catch (err) {
    next(err);
  }
};

// @desc   Add a member by email (owner only)
// @route  POST /api/workspaces/:id/members
// @access Private (owner only)
export const addMember = async (req, res, next) => {
  try {
    const { userId, role = 'editor' } = req.body;
    const ws = req.workspace;
    if (ws.roleOf(userId)) {
      return res.status(409).json({ message: 'User is already a member' });
    }
    ws.members.push({ user: userId, role });
    await ws.save();
    res.status(201).json(ws);
  } catch (err) {
    next(err);
  }
};
