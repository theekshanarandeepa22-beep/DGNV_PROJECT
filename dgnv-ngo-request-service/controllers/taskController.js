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

function getAuthorizedTask(req, callback) {
    const taskId = req.params.id;

    if (req.user?.role === "VOLUNTEER") {
        if (!req.user.email) return callback(new Error("Volunteer identity is missing"), null);
        return db.query(
            `SELECT t.*
             FROM tasks t
             JOIN volunteers v ON v.id = t.volunteer_id
             WHERE t.id = ? AND v.email = ?
             LIMIT 1`,
            [taskId, req.user.email],
            (err, results) => {
                if (err) return callback(err, null);
                if (!results.length) return callback(null, null);
                callback(null, results[0]);
            }
        );
    }

    getNgoId(req, (identityErr, ngoId) => {
        if (identityErr) return callback(identityErr, null);
        db.query(
            `SELECT t.*
             FROM tasks t
             JOIN ngo_requests r ON r.id = t.request_id
             WHERE t.id = ? AND r.ngo_id = ?
             LIMIT 1`,
            [taskId, ngoId],
            (err, results) => {
                if (err) return callback(err, null);
                if (!results.length) return callback(null, null);
                callback(null, results[0]);
            }
        );
    });
}

exports.getAllTasks = (req, res) => {
    if (req.user?.role === "VOLUNTEER") {
        if (!req.user?.email) return res.status(403).json({ message: "Volunteer identity is missing" });
        return db.query(
            `SELECT t.*
             FROM tasks t
             JOIN volunteers v ON v.id = t.volunteer_id
             WHERE v.email = ?
             ORDER BY t.id DESC`,
            [req.user.email],
            (err, results) => {
                if (err) return res.status(500).json({ message: err.message });
                return res.json(results);
            }
        );
    }

    getNgoId(req, (identityErr, ngoId) => {
        if (identityErr) return res.status(403).json({ message: identityErr.message });
        db.query(
            `SELECT t.* FROM tasks t
             JOIN ngo_requests r ON r.id=t.request_id
             WHERE r.ngo_id = ? ORDER BY t.id DESC`,
            [ngoId],
            (err, results) => {
                if (err) return res.status(500).json({ message: err.message });
                return res.json(results);
            }
        );
    });
};

exports.acceptTask = (req, res) => {
    getAuthorizedTask(req, (authErr, task) => {
        if (authErr) return res.status(500).json({ message: authErr.message });
        if (!task) return res.status(404).json({ message: "Task not found or not assigned to you" });
        if (task.status !== "VOLUNTEER_ASSIGNED") return res.status(409).json({ message: `Task cannot be accepted from ${task.status}` });

        db.query(
            "UPDATE tasks SET status='VOLUNTEER_ACCEPTED', accepted_at=NOW() WHERE id=?",
            [task.id],
            (err) => {
                if (err) return res.status(500).json({ message: err.message });
                db.query(
                    "UPDATE ngo_requests SET status='VOLUNTEER_ACCEPTED' WHERE id=?",
                    [task.request_id],
                    (requestErr) => {
                        if (requestErr) return res.status(500).json({ message: requestErr.message });
                        return res.json({ message: "Task Accepted" });
                    }
                );
            }
        );
    });
};

exports.startTask = (req, res) => {
    getAuthorizedTask(req, (authErr, task) => {
        if (authErr) return res.status(500).json({ message: authErr.message });
        if (!task) return res.status(404).json({ message: "Task not found or not assigned to you" });
        if (task.status !== "VOLUNTEER_ACCEPTED") return res.status(409).json({ message: `Task cannot be started from ${task.status}` });

        db.query("UPDATE tasks SET status='IN_PROGRESS' WHERE id=?", [task.id], (err) => {
            if (err) return res.status(500).json({ message: err.message });
            db.query("UPDATE ngo_requests SET status='IN_PROGRESS' WHERE id=?", [task.request_id], (requestErr) => {
                if (requestErr) return res.status(500).json({ message: requestErr.message });
                return res.json({ message: "Task In Progress" });
            });
        });
    });
};

exports.arrivedTask = (req, res) => {
    getAuthorizedTask(req, (authErr, task) => {
        if (authErr) return res.status(500).json({ message: authErr.message });
        if (!task) return res.status(404).json({ message: "Task not found or not assigned to you" });
        if (task.status !== "IN_PROGRESS") return res.status(409).json({ message: `Task cannot be marked arrived from ${task.status}` });

        db.query("UPDATE tasks SET status='ARRIVED' WHERE id=?", [task.id], (err) => {
            if (err) return res.status(500).json({ message: err.message });
            db.query("UPDATE ngo_requests SET status='ARRIVED' WHERE id=?", [task.request_id], (requestErr) => {
                if (requestErr) return res.status(500).json({ message: requestErr.message });
                return res.json({ message: "Volunteer Arrived" });
            });
        });
    });
};

exports.serviceProvidedTask = (req, res) => {
    getAuthorizedTask(req, (authErr, task) => {
        if (authErr) return res.status(500).json({ message: authErr.message });
        if (!task) return res.status(404).json({ message: "Task not found or not assigned to you" });
        if (task.status !== "ARRIVED") return res.status(409).json({ message: `Service cannot be provided from ${task.status}` });

        db.query("UPDATE tasks SET status='SERVICE_PROVIDED' WHERE id=?", [task.id], (err) => {
            if (err) return res.status(500).json({ message: err.message });
            db.query("UPDATE ngo_requests SET status='SERVICE_PROVIDED' WHERE id=?", [task.request_id], (requestErr) => {
                if (requestErr) return res.status(500).json({ message: requestErr.message });
                return res.json({ message: "Service Provided" });
            });
        });
    });
};

exports.completeTask = (req, res) => {
    getAuthorizedTask(req, (authErr, task) => {
        if (authErr) return res.status(500).json({ message: authErr.message });
        if (!task) return res.status(404).json({ message: "Task not found or not assigned to you" });
        if (task.status !== "SERVICE_PROVIDED") return res.status(409).json({ message: `Task cannot be completed from ${task.status}` });

        db.query("UPDATE tasks SET status='COMPLETED', completed_at=NOW() WHERE id=?", [task.id], (err) => {
            if (err) return res.status(500).json({ message: err.message });
            db.query("UPDATE ngo_requests SET status='COMPLETED' WHERE id=?", [task.request_id], (requestErr) => {
                if (requestErr) return res.status(500).json({ message: requestErr.message });
                return res.json({ message: "Task Completed" });
            });
        });
    });
};
