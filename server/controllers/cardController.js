import Card from '../models/Card.js';

// Confirm a column id actually exists on the parent workspace.
const columnExists = (ws, columnId) =>
  ws.columns.some((c) => c._id.toString() === columnId?.toString());

// @desc   List all cards in a workspace
// @route  GET /api/workspaces/:workspaceId/cards
// @access Private (member)
export const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({ workspace: req.workspace._id }).sort('order').lean();
    res.json(cards);
  } catch (err) {
    next(err);
  }
};

// @desc   Create a card
// @route  POST /api/workspaces/:workspaceId/cards
// @access Private (editor+)
export const createCard = async (req, res, next) => {
  try {
    const { title, column, description, priority, due, assignee, tags } = req.body;
    if (!title) return res.status(400).json({ message: 'Task title is required' });
    if (!columnExists(req.workspace, column)) {
      return res.status(400).json({ message: 'Target column does not exist in this workspace' });
    }
    const count = await Card.countDocuments({ workspace: req.workspace._id, column });
    const card = await Card.create({
      workspace: req.workspace._id,
      column,
      title,
      description: description || '',
      priority: priority || 'medium',
      due: due || null,
      assignee: assignee || '',
      tags: Array.isArray(tags) ? tags : [],
      order: count,
      createdBy: req.user._id,
    });
    res.status(201).json(card);
  } catch (err) {
    next(err);
  }
};

// @desc   Update a card's fields
// @route  PATCH /api/workspaces/:workspaceId/cards/:cardId
// @access Private (editor+)
export const updateCard = async (req, res, next) => {
  try {
    const card = await Card.findOne({
      _id: req.params.cardId,
      workspace: req.workspace._id,
    });
    if (!card) return res.status(404).json({ message: 'Card not found' });

    const fields = ['title', 'description', 'priority', 'due', 'assignee', 'tags', 'order'];
    for (const f of fields) if (req.body[f] !== undefined) card[f] = req.body[f];
    await card.save();
    res.json(card);
  } catch (err) {
    next(err);
  }
};

// @desc   Move a card to another column / position (drag & drop)
// @route  PATCH /api/workspaces/:workspaceId/cards/:cardId/move
// @access Private (editor+)
export const moveCard = async (req, res, next) => {
  try {
    const { column, order } = req.body;
    const card = await Card.findOne({
      _id: req.params.cardId,
      workspace: req.workspace._id,
    });
    if (!card) return res.status(404).json({ message: 'Card not found' });
    if (column !== undefined) {
      if (!columnExists(req.workspace, column)) {
        return res.status(400).json({ message: 'Target column does not exist' });
      }
      card.column = column;
    }
    if (order !== undefined) card.order = order;
    await card.save();
    res.json(card);
  } catch (err) {
    next(err);
  }
};

// @desc   Delete a card
// @route  DELETE /api/workspaces/:workspaceId/cards/:cardId
// @access Private (editor+)
export const deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findOneAndDelete({
      _id: req.params.cardId,
      workspace: req.workspace._id,
    });
    if (!card) return res.status(404).json({ message: 'Card not found' });
    res.json({ message: 'Card deleted' });
  } catch (err) {
    next(err);
  }
};
