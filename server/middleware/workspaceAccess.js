import Workspace from '../models/Workspace.js';

/**
 * Workspace-level resource isolation + role-based access control.
 *
 * Loads the workspace named by :workspaceId (or :id), confirms the
 * authenticated user is a member, and attaches both the workspace and the
 * user's role to the request. A non-member gets a 404 — we don't reveal that
 * a workspace they can't access even exists.
 *
 * `minRole` enforces capability: owner > editor > viewer.
 */
const RANK = { viewer: 1, editor: 2, owner: 3 };

export const workspaceAccess = (minRole = 'viewer') => async (req, res, next) => {
  try {
    const id = req.params.workspaceId || req.params.id;
    const workspace = await Workspace.findById(id);
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    const role = workspace.roleOf(req.user._id);
    if (!role) {
      // Member isolation: hide existence from outsiders.
      return res.status(404).json({ message: 'Workspace not found' });
    }

    if (RANK[role] < RANK[minRole]) {
      return res
        .status(403)
        .json({ message: `Forbidden — requires ${minRole} access to this workspace` });
    }

    req.workspace = workspace;
    req.workspaceRole = role;
    next();
  } catch (err) {
    next(err);
  }
};
