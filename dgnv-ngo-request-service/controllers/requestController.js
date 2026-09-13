const db = require("../config/db");
const { findVolunteer } = require("../services/assignmentService");

function getUserNgoId(req, callback) {
    if (req.user?.ngo_id) return callback(null, req.user.ngo_id);

    if (!req.user?.email) {
        return callback(new Error("NGO identity is missing from authentication token"));
    }

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

/*
|--------------------------------------------------------------------------
| Receive Request - automatic category routing
|--------------------------------------------------------------------------
| Government sends the request only once to this endpoint. The NGO Request
| Service finds every registered NGO whose category matches the officer's
| selected category and stores one NGO-owned request row for each match.
| No NGO is manually selected by the government officer.
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

    if (!government_request_id || !category) {
        return res.status(400).json({
            message: "government_request_id and category are required"
        });
    }

    const categoryName = String(category).trim();

    db.query(
        `SELECT DISTINCT ngo_id
         FROM ngo_auth_db.ngo_categories
         WHERE LOWER(TRIM(category_name)) = LOWER(TRIM(?))`,
        [categoryName],
        (matchErr, matches) => {
            if (matchErr) {
                return res.status(500).json({ message: matchErr.message });
            }

            if (!matches.length) {
                return res.status(404).json({
                    message: `No registered NGO found for category: ${categoryName}`,
                    category: categoryName
                });
            }

            let completed = 0;
            let firstError = null;
            let inserted = 0;

            matches.forEach(({ ngo_id }) => {
                db.query(
                    `SELECT id FROM ngo_requests
                     WHERE government_request_id = ? AND ngo_id = ?
                     LIMIT 1`,
                    [government_request_id, ngo_id],
                    (existsErr, existing) => {
                        if (existsErr) {
                            firstError = firstError || existsErr;
                            completed += 1;
                            if (completed === matches.length) finish();
                            return;
                        }

                        if (existing.length) {
                            completed += 1;
                            if (completed === matches.length) finish();
                            return;
                        }

                        const sql = `
                            INSERT INTO ngo_requests
                            (
                                ngo_id,
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
                            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
                        `;

                        db.query(
                            sql,
                            [
                                ngo_id,
                                government_request_id,
                                citizen_id,
                                title,
                                description,
                                contact_number,
                                whatsapp_number,
                                categoryName,
                                priority,
                                district,
                                ds_division,
                                gs_division,
                                "NGO_RECEIVED"
                            ],
                            (insertErr) => {
                                if (insertErr) firstError = firstError || insertErr;
                                else inserted += 1;

                                completed += 1;
                                if (completed === matches.length) finish();
                            }
                        );
                    }
                );
            });

            function finish() {
                if (firstError) {
                    return res.status(500).json({ message: firstError.message });
                }

                return res.status(201).json({
                    message: "Request routed to matching NGOs successfully",
                    category: categoryName,
                    matchedNgoCount: matches.length,
                    insertedCount: inserted
                });
            }
        }
    );
};

/*
|--------------------------------------------------------------------------
| Get Requests - only the logged-in NGO's requests
|--------------------------------------------------------------------------
*/
exports.getAllRequests = (req, res) => {
    getUserNgoId(req, (identityErr, ngoId) => {
        if (identityErr) {
            return res.status(403).json({ message: identityErr.message });
        }

        db.query(
            "SELECT * FROM ngo_requests WHERE ngo_id = ? ORDER BY id DESC",
            [ngoId],
            (err, results) => {
                if (err) {
                    return res.status(500).json({ message: err.message });
                }

                return res.json(results);
            }
        );
    });
};

/*
|--------------------------------------------------------------------------
| Assign Volunteer
|--------------------------------------------------------------------------
*/
exports.assignVolunteer = async (req, res) => {
    try {
        const requestId = req.params.id;

        getUserNgoId(req, async (identityErr, ngoId) => {
            if (identityErr) {
                return res.status(403).json({ message: identityErr.message });
            }

            db.query(
                "SELECT * FROM ngo_requests WHERE id = ? AND ngo_id = ?",
                [requestId, ngoId],
                async (err, requests) => {
                    if (err) {
                        return res.status(500).json({ message: err.message });
                    }

                    if (requests.length === 0) {
                        return res.status(404).json({ message: "Request not found" });
                    }

                    const request = requests[0];
                    const volunteer = await findVolunteer(request, ngoId);

                    if (!volunteer) {
                        return res.status(404).json({
                            message: "No Available Volunteer Found in the required location"
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
                                return res.status(500).json({ message: taskErr.message });
                            }

                            db.query(
                                `UPDATE ngo_requests SET status='VOLUNTEER_ASSIGNED' WHERE id=? AND ngo_id=?`,
                                [request.id, ngoId]
                            );

                            return res.json({
                                message: "Volunteer Assigned Successfully",
                                volunteer,
                                matchingPriority: "GS Division -> DS Division -> District"
                            });
                        }
                    );
                }
            );
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
