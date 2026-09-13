const db = require("../config/db");

function getNgoId(req, callback) {
    if (req.user?.ngo_id) return callback(null, req.user.ngo_id);

    if (!req.user?.email) return callback(new Error("NGO identity is missing"));

    db.query(
        "SELECT id FROM ngo_auth_db.ngos WHERE email = ? LIMIT 1",
        [req.user.email],
        (err, results) => {
            if (err) return callback(err);
            if (!results.length) return callback(new Error("NGO account not found"));
            callback(null, results[0].id);
        }
    );
}

exports.getDashboardSummary = (req, res) => {
    getNgoId(req, (identityErr, ngoId) => {
        if (identityErr) return res.status(403).json({ message: identityErr.message });

        db.query(
            `
            SELECT
                (SELECT COUNT(*) FROM ngo_requests WHERE ngo_id = ?) AS totalRequests,
                (SELECT COUNT(*) FROM tasks t JOIN ngo_requests r ON r.id=t.request_id WHERE r.ngo_id = ?) AS totalTasks,
                (SELECT COUNT(*) FROM tasks t JOIN ngo_requests r ON r.id=t.request_id WHERE r.ngo_id = ? AND t.status='COMPLETED') AS completedTasks
            `,
            [ngoId, ngoId, ngoId],
            (err, results) => {
                if (err) return res.status(500).json({ message: err.message });
                return res.json(results[0]);
            }
        );
    });
};
