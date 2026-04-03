/**
 * Use after verifyAuth. Only users with role 'A' (administrator, role_id 0) may proceed.
 */
export function requireAdmin(req, res, next) {
    if (req.user?.role !== "A") {
        return res.status(403).json({ error: "Admin access required" });
    }
    next();
}
