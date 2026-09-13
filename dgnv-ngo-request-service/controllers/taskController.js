const db = require("../config/db");

/*
|--------------------------------------------------------------------------
| Get All Tasks
|--------------------------------------------------------------------------
*/
exports.getAllTasks = (req, res) => {

    db.query(
        "SELECT * FROM tasks",
        (err, results) => {

            if (err) {
                return res.status(500).json(err);
            }

            return res.json(results);

        }
    );

};

/*
|--------------------------------------------------------------------------
| Accept Task
|--------------------------------------------------------------------------
*/
exports.acceptTask = (req, res) => {

    const taskId = req.params.id;

    db.query(
        `
        UPDATE tasks
        SET status='VOLUNTEER_ACCEPTED',
            accepted_at = NOW()
        WHERE id=?
        `,
        [taskId],
        (err) => {

            if (err) {
                return res.status(500).json(err);
            }
            db.query(
    `
    UPDATE ngo_requests
    SET status='VOLUNTEER_ACCEPTED'
    WHERE id = (
        SELECT request_id
        FROM tasks
        WHERE id=?
    )
    `,
    [taskId]
);
   
db.query(
    `
    UPDATE ngo_requests
    SET status='IN_PROGRESS'
    WHERE id = (
        SELECT request_id
        FROM tasks
        WHERE id=?
    )
    `,
    [req.params.id]
);
db.query(
    `
    UPDATE ngo_requests
    SET status='ARRIVED'
    WHERE id = (
        SELECT request_id
        FROM tasks
        WHERE id=?
    )
    `,
    [req.params.id]
);
db.query(
    `
    UPDATE ngo_requests
    SET status='SERVICE_PROVIDED'
    WHERE id = (
        SELECT request_id
        FROM tasks
        WHERE id=?
    )
    `,
    [req.params.id]
);

            return res.json({
                message: "Task Accepted"
            });

        }
    );

};

/*
|--------------------------------------------------------------------------
| Start Task
|--------------------------------------------------------------------------
*/
exports.startTask = (req, res) => {

    db.query(
        "UPDATE tasks SET status='IN_PROGRESS' WHERE id=?",
        [req.params.id],
        (err) => {

            if (err) {
                return res.status(500).json(err);
            }

            return res.json({
                message: "Task In Progress"
            });

        }
    );

};

/*
|--------------------------------------------------------------------------
| Arrived
|--------------------------------------------------------------------------
*/
exports.arrivedTask = (req, res) => {

    db.query(
        "UPDATE tasks SET status='ARRIVED' WHERE id=?",
        [req.params.id],
        (err) => {

            if (err) {
                return res.status(500).json(err);
            }

            return res.json({
                message: "Volunteer Arrived"
            });

        }
    );

};

/*
|--------------------------------------------------------------------------
| Service Provided
|--------------------------------------------------------------------------
*/
exports.serviceProvidedTask = (req, res) => {

    db.query(
        "UPDATE tasks SET status='SERVICE_PROVIDED' WHERE id=?",
        [req.params.id],
        (err) => {

            if (err) {
                return res.status(500).json(err);
            }

            return res.json({
                message: "Service Provided"
            });

        }
    );

};

/*
|--------------------------------------------------------------------------
| Complete Task
|--------------------------------------------------------------------------
*/
exports.completeTask = (req, res) => {

    db.query(
        `
        UPDATE tasks
        SET status='COMPLETED',
            completed_at = NOW()
        WHERE id=?
        `,
        [req.params.id],
        (err) => {

            if (err) {
                return res.status(500).json(err);
            }
            db.query(
    `
    UPDATE ngo_requests
    SET status='COMPLETED'
    WHERE id = (
        SELECT request_id
        FROM tasks
        WHERE id=?
    )
    `,
    [req.params.id]
);

            return res.json({
                message: "Task Completed"
            });

        }
    );

};