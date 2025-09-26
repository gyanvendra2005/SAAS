// lib/middleware.js
import { verifyToken } from "./auth.js";

export function withAuth(handler, roleRequired = null) {
  return async (req, res) => {
    try {
      const decoded = verifyToken(req);
      req.user = decoded; // { userId, tenantId, role }

      if (roleRequired && req.user.role !== roleRequired) {
        return res.status(403).json({ error: "Forbidden" });
      }

      return handler(req, res);
    } catch (err) {
      return res.status(401).json({ error: err.message });
    }
  };
}
