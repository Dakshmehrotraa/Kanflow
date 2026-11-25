/**
 * Seed script — populates a demo user with two workspaces and sample cards.
 * Run with:  npm run seed
 * WARNING: clears existing Users, Workspaces and Cards.
 */
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Workspace from './models/Workspace.js';
import Card from './models/Card.js';

dotenv.config();

const run = async () => {
  await connectDB();
  await Promise.all([User.deleteMany(), Workspace.deleteMany(), Card.deleteMany()]);

  const user = await User.create({
    name: 'Demo User',
    email: 'demo@kanflow.app',
    password: 'demo123',
    role: 'admin',
  });

  const ws = await Workspace.create({
    name: 'Product Launch',
    color: '#6c5ce7',
    owner: user._id,
    members: [{ user: user._id, role: 'owner' }],
    columns: [
      { name: 'Backlog', color: '#8e8ea8', order: 0 },
      { name: 'In Progress', color: '#00b894', order: 1 },
      { name: 'Review', color: '#fdcb6e', order: 2 },
      { name: 'Done', color: '#6c5ce7', order: 3 },
    ],
  });

  const [backlog, inProgress, , done] = ws.columns;
  const day = (o) => { const d = new Date(); d.setDate(d.getDate() + o); return d; };

  await Card.create([
    { workspace: ws._id, column: backlog._id, title: 'Research competitor onboarding', priority: 'medium', due: day(5), assignee: 'ML', tags: ['research', 'ux'], order: 0, createdBy: user._id },
    { workspace: ws._id, column: inProgress._id, title: 'Build JWT auth middleware', priority: 'urgent', due: day(1), assignee: 'DK', tags: ['backend', 'security'], order: 0, createdBy: user._id },
    { workspace: ws._id, column: inProgress._id, title: 'Design the board canvas', priority: 'high', due: day(-1), assignee: 'AL', tags: ['design'], order: 1, createdBy: user._id },
    { workspace: ws._id, column: done._id, title: 'Set up MongoDB schemas', priority: 'medium', due: day(-3), assignee: 'DK', tags: ['db'], order: 0, createdBy: user._id },
  ]);

  console.log('✅  Seeded demo user (demo@kanflow.app / demo123) with sample board');
  process.exit(0);
};

run().catch((e) => { console.error(e); process.exit(1); });
