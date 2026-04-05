
export function requireAdmin(req, res, next) {
    if (req.user?.role !== "A") {
        return res.status(403).json({ error: "Admin access required" });
    }
    next();
}
