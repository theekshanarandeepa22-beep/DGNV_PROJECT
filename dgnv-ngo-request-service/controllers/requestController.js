const db = require("../config/db");
const { findVolunteer } = require("../services/assignmentService");

/*
|--------------------------------------------------------------------------
| Receive Request
|--------------------------------------------------------------------------
*/
exports.receiveRequest = (req, res) => {

    const {
        government_request_id,
        citizen_id,
        title,
        description,
        contact_number,
        whatsapp_number,
        category,
        priority,
        district,
        ds_division,
        gs_division
    } = req.body;

    const sql = `
        INSERT INTO ngo_requests
        (
            government_request_id,
            citizen_id,
            title,
            description,
            contact_number,
            whatsapp_number,
            category,
            priority,
            district,
            ds_division,
            gs_division,
            status
        )
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
    `;

    db.query(
        sql,
        [
            government_request_id,
            citizen_id,
            title,
            description,
            contact_number,
            whatsapp_number,
            category,
            priority,
            district,
            ds_division,
            gs_division,
            "NGO_RECEIVED"
        ],
        (err) => {

            if (err) {
                return res.status(500).json(err);
            }

            return res.status(201).json({
                message: "Request Received Successfully"
            });

        }
    );

};

/*
|--------------------------------------------------------------------------
| Get All Requests
|--------------------------------------------------------------------------
*/
exports.getAllRequests = (req, res) => {

    db.query(
        "SELECT * FROM ngo_requests",
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
| Assign Volunteer
|--------------------------------------------------------------------------
*/
exports.assignVolunteer = async (req, res) => {

    try {

        const requestId = req.params.id;

        db.query(
            "SELECT * FROM ngo_requests WHERE id = ?",
            [requestId],
            async (err, requests) => {

                if (err) {
                    return res.status(500).json(err);
                }

                if (requests.length === 0) {
                    return res.status(404).json({
                        message: "Request not found"
                    });
                }

                const request = requests[0];

                const volunteer =
                    await findVolunteer(request);

                if (!volunteer) {

                    return res.status(404).json({
                        message:
                        "No Available Volunteer Found"
                    });

                }

                db.query(
                    `
                    INSERT INTO tasks
                    (
                        request_id,
                        volunteer_id,
                        category,
                        priority,
                        district,
                        ds_division,
                        gs_division,
                        status,
                        assigned_at
                    )
                    VALUES (?,?,?,?,?,?,?,?,NOW())
                    `,
                    [
                        request.id,
                        volunteer.id,
                        request.category,
                        request.priority,
                        request.district,
                        request.ds_division,
                        request.gs_division,
                        "VOLUNTEER_ASSIGNED"
                    ],
                    (taskErr) => {

                        if (taskErr) {
                            return res.status(500).json(taskErr);
                        }

                        db.query(
                            `
                            UPDATE ngo_requests
                            SET status='VOLUNTEER_ASSIGNED'
                            WHERE id=?
                            `,
                            [request.id]
                        );

                        return res.json({
                            message:
                            "Volunteer Assigned Successfully",
                            volunteer
                        });

                    }
                );

            }
        );

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }

};