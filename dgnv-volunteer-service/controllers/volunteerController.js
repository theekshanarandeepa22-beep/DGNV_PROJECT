const db = require("../config/db");

let bcrypt;
try {
    bcrypt = require("bcryptjs");
} catch (error) {
    bcrypt = require("../../dgnv-ngo-auth-service/node_modules/bcryptjs");
}

/*
|--------------------------------------------------------------------------
| Add Volunteer
|--------------------------------------------------------------------------
*/
exports.addVolunteer = async (req, res) => {

    const {
        ngo_id,
        full_name,
        fullName,
        email,
        phone,
        district,
        ds_division,
        gs_division,
        password
    } = req.body;

    const volunteerName = fullName || full_name;

    if (!volunteerName || !email || !phone || !district || !password) {
        return res.status(400).json({
            message: "fullName, email, phone, district and password are required"
        });
    }

    db.query(
        "SELECT id FROM ngo_auth_db.users WHERE email = ? LIMIT 1",
        [email],
        (userCheckErr, users) => {

            if (userCheckErr) {
                return res.status(500).json(userCheckErr);
            }

            if (users.length > 0) {
                return res.status(400).json({
                    message: "Volunteer email already exists"
                });
            }

            db.query(
                "SELECT id FROM volunteers WHERE email = ? LIMIT 1",
                [email],
                async (volunteerCheckErr, volunteers) => {

                    if (volunteerCheckErr) {
                        return res.status(500).json(volunteerCheckErr);
                    }

                    if (volunteers.length > 0) {
                        return res.status(400).json({
                            message: "Volunteer email already exists"
                        });
                    }

                    try {

                        const hashedPassword =
                            await bcrypt.hash(password, 10);

                        db.beginTransaction((transactionErr) => {

                            if (transactionErr) {
                                return res.status(500).json(transactionErr);
                            }

                            const volunteerSql = `
                                INSERT INTO volunteers
                                (
                                    ngo_id,
                                    full_name,
                                    email,
                                    phone,
                                    district,
                                    ds_division,
                                    gs_division
                                )
                                VALUES (?,?,?,?,?,?,?)
                            `;

                            db.query(
                                volunteerSql,
                                [
                                    ngo_id,
                                    volunteerName,
                                    email,
                                    phone,
                                    district,
                                    ds_division,
                                    gs_division
                                ],
                                (volunteerErr) => {

                                    if (volunteerErr) {
                                        return db.rollback(() => {
                                            return res.status(500).json(volunteerErr);
                                        });
                                    }

                                    const userSql = `
                                        INSERT INTO ngo_auth_db.users
                                        (
                                            full_name,
                                            email,
                                            password,
                                            role,
                                            active
                                        )
                                        VALUES (?,?,?,?,?)
                                    `;

                                    db.query(
                                        userSql,
                                        [
                                            volunteerName,
                                            email,
                                            hashedPassword,
                                            "VOLUNTEER",
                                            1
                                        ],
                                        (userErr) => {

                                            if (userErr) {
                                                return db.rollback(() => {
                                                    return res.status(500).json(userErr);
                                                });
                                            }

                                            db.commit((commitErr) => {

                                                if (commitErr) {
                                                    return db.rollback(() => {
                                                        return res.status(500).json(commitErr);
                                                    });
                                                }

                                                return res.status(201).json({
                                                    message:
                                                    "Volunteer Added Successfully"
                                                });

                                            });

                                        }
                                    );

                                }
                            );

                        });

                    } catch (error) {

                        return res.status(500).json({
                            message: error.message
                        });

                    }

                }
            );

        }
    );

};

/*
|--------------------------------------------------------------------------
| Get Volunteer By ID
|--------------------------------------------------------------------------
*/
exports.getVolunteerById = (req, res) => {

    db.query(
        "SELECT * FROM volunteers WHERE id = ?",
        [req.params.id],
        (err, results) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: "Volunteer not found"
                });
            }

            return res.json(results[0]);

        }
    );

};

/*
|--------------------------------------------------------------------------
| Update Volunteer
|--------------------------------------------------------------------------
*/
exports.updateVolunteer = async (req, res) => {

    const volunteerId = req.params.id;

    const {
        ngo_id,
        full_name,
        fullName,
        email,
        phone,
        district,
        ds_division,
        gs_division,
        password
    } = req.body;

    const volunteerName = fullName || full_name;

    if (!volunteerName || !email || !phone || !district) {
        return res.status(400).json({
            message: "fullName, email, phone and district are required"
        });
    }

    db.query(
        "SELECT * FROM volunteers WHERE id = ?",
        [volunteerId],
        async (findErr, volunteers) => {

            if (findErr) {
                return res.status(500).json(findErr);
            }

            if (volunteers.length === 0) {
                return res.status(404).json({
                    message: "Volunteer not found"
                });
            }

            const existingVolunteer = volunteers[0];
            const oldEmail = existingVolunteer.email;
            const emailChanged = oldEmail !== email;

            db.query(
                "SELECT id FROM volunteers WHERE email = ? AND id <> ? LIMIT 1",
                [email, volunteerId],
                (volunteerCheckErr, duplicateVolunteers) => {

                    if (volunteerCheckErr) {
                        return res.status(500).json(volunteerCheckErr);
                    }

                    if (duplicateVolunteers.length > 0) {
                        return res.status(400).json({
                            message: "Volunteer email already exists"
                        });
                    }

                    db.query(
                        "SELECT id FROM ngo_auth_db.users WHERE email = ? AND email <> ? LIMIT 1",
                        [email, oldEmail],
                        async (userCheckErr, duplicateUsers) => {

                            if (userCheckErr) {
                                return res.status(500).json(userCheckErr);
                            }

                            if (duplicateUsers.length > 0) {
                                return res.status(400).json({
                                    message: "Volunteer email already exists"
                                });
                            }

                            try {

                                const hashedPassword = password
                                    ? await bcrypt.hash(password, 10)
                                    : null;

                                db.beginTransaction((transactionErr) => {

                                    if (transactionErr) {
                                        return res.status(500).json(transactionErr);
                                    }

                                    const volunteerSql = `
                                        UPDATE volunteers
                                        SET
                                            ngo_id = ?,
                                            full_name = ?,
                                            email = ?,
                                            phone = ?,
                                            district = ?,
                                            ds_division = ?,
                                            gs_division = ?
                                        WHERE id = ?
                                    `;

                                    db.query(
                                        volunteerSql,
                                        [
                                            ngo_id || existingVolunteer.ngo_id,
                                            volunteerName,
                                            email,
                                            phone,
                                            district,
                                            ds_division,
                                            gs_division,
                                            volunteerId
                                        ],
                                        (volunteerErr) => {

                                            if (volunteerErr) {
                                                return db.rollback(() => {
                                                    return res.status(500).json(volunteerErr);
                                                });
                                            }

                                            const userFields = [
                                                "full_name = ?",
                                                "email = ?"
                                            ];
                                            const userValues = [
                                                volunteerName,
                                                email
                                            ];

                                            if (hashedPassword) {
                                                userFields.push("password = ?");
                                                userValues.push(hashedPassword);
                                            }

                                            userValues.push(oldEmail);

                                            const userSql = `
                                                UPDATE ngo_auth_db.users
                                                SET ${userFields.join(", ")}
                                                WHERE email = ?
                                                AND role = 'VOLUNTEER'
                                            `;

                                            db.query(
                                                userSql,
                                                userValues,
                                                (userErr) => {

                                                    if (userErr) {
                                                        return db.rollback(() => {
                                                            return res.status(500).json(userErr);
                                                        });
                                                    }

                                                    db.commit((commitErr) => {

                                                        if (commitErr) {
                                                            return db.rollback(() => {
                                                                return res.status(500).json(commitErr);
                                                            });
                                                        }

                                                        return res.json({
                                                            message:
                                                            "Volunteer Updated Successfully",
                                                            emailChanged
                                                        });

                                                    });

                                                }
                                            );

                                        }
                                    );

                                });

                            } catch (error) {

                                return res.status(500).json({
                                    message: error.message
                                });

                            }

                        }
                    );

                }
            );

        }
    );

};

/*
|--------------------------------------------------------------------------
| Delete Volunteer
|--------------------------------------------------------------------------
*/
exports.deleteVolunteer = (req, res) => {

    const volunteerId = req.params.id;

    db.query(
        "SELECT * FROM volunteers WHERE id = ?",
        [volunteerId],
        (findErr, volunteers) => {

            if (findErr) {
                return res.status(500).json(findErr);
            }

            if (volunteers.length === 0) {
                return res.status(404).json({
                    message: "Volunteer not found"
                });
            }

            const volunteer = volunteers[0];

            db.beginTransaction((transactionErr) => {

                if (transactionErr) {
                    return res.status(500).json(transactionErr);
                }

                db.query(
                    "DELETE FROM volunteers WHERE id = ?",
                    [volunteerId],
                    (volunteerErr) => {

                        if (volunteerErr) {
                            return db.rollback(() => {
                                return res.status(500).json(volunteerErr);
                            });
                        }

                        db.query(
                            `
                            DELETE FROM ngo_auth_db.users
                            WHERE email = ?
                            AND role = 'VOLUNTEER'
                            `,
                            [volunteer.email],
                            (userErr) => {

                                if (userErr) {
                                    return db.rollback(() => {
                                        return res.status(500).json(userErr);
                                    });
                                }

                                db.commit((commitErr) => {

                                    if (commitErr) {
                                        return db.rollback(() => {
                                            return res.status(500).json(commitErr);
                                        });
                                    }

                                    return res.json({
                                        message:
                                        "Volunteer Deleted Successfully"
                                    });

                                });

                            }
                        );

                    }
                );

            });

        }
    );

};

/*
|--------------------------------------------------------------------------
| Get All Volunteers
|--------------------------------------------------------------------------
*/
exports.getAllVolunteers = (req, res) => {

    const ngoId = req.query.ngo_id;
    const sql = ngoId
        ? "SELECT * FROM volunteers WHERE ngo_id = ? ORDER BY id DESC"
        : "SELECT * FROM volunteers ORDER BY id DESC";
    const params = ngoId ? [ngoId] : [];

    db.query(sql, params, (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }

        return res.json(results);
    });

};

/*
|--------------------------------------------------------------------------
| Get Available Volunteers
|--------------------------------------------------------------------------
*/
exports.getAvailableVolunteers = (req, res) => {

    const ngoId = req.query.ngo_id;
    const sql = ngoId
        ? "SELECT * FROM volunteers WHERE availability='AVAILABLE' AND ngo_id = ?"
        : "SELECT * FROM volunteers WHERE availability='AVAILABLE'";
    const params = ngoId ? [ngoId] : [];

    db.query(sql, params, (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }

        return res.json(results);
    });

};
