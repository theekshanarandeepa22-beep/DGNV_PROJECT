const db = require("../config/db");

exports.getDashboardSummary = async (req, res) => {

    try {

        db.query(
            `
            SELECT
            (SELECT COUNT(*) FROM ngo_requests) AS totalRequests,
            (SELECT COUNT(*) FROM tasks) AS totalTasks,
            (SELECT COUNT(*) FROM tasks WHERE status='COMPLETED') AS completedTasks
            `,
            (err, results) => {

                if (err) {
                    return res.status(500).json(err);
                }

                return res.json(results[0]);

            }
        );

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }

};