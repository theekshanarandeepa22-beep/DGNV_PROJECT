const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/*
|--------------------------------------------------------------------------
| NGO Registration
|--------------------------------------------------------------------------
*/
exports.registerNgo = async (req, res) => {
    try {
        const { ngoName, email, password, phone, district, categories } = req.body;

        if (!ngoName || !email || !password || !phone || !district) {
            return res.status(400).json({
                message: "ngoName, email, password, phone and district are required"
            });
        }

        const cleanCategories = Array.isArray(categories)
            ? [...new Set(categories.map((category) => String(category).trim()).filter(Boolean))]
            : [];

        if (!cleanCategories.length) {
            return res.status(400).json({
                message: "At least one NGO category is required"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
            "SELECT id FROM ngos WHERE email = ? LIMIT 1",
            [email],
            (existingNgoErr, existingNgos) => {
                if (existingNgoErr) {
                    return res.status(500).json({ message: existingNgoErr.message });
                }

                if (existingNgos.length > 0) {
                    return res.status(409).json({ message: "NGO email already exists" });
                }

                db.query(
                    "SELECT id FROM users WHERE email = ? LIMIT 1",
                    [email],
                    (existingUserErr, existingUsers) => {
                        if (existingUserErr) {
                            return res.status(500).json({ message: existingUserErr.message });
                        }

                        if (existingUsers.length > 0) {
                            return res.status(409).json({ message: "Email already exists" });
                        }

                        db.beginTransaction((transactionErr) => {
                            if (transactionErr) {
                                return res.status(500).json({ message: transactionErr.message });
                            }

                            db.query(
                                `INSERT INTO ngos (ngo_name, email, phone, district) VALUES (?, ?, ?, ?)`,
                                [ngoName, email, phone, district],
                                (ngoErr, ngoResult) => {
                                    if (ngoErr) {
                                        return db.rollback(() => res.status(500).json({ message: ngoErr.message }));
                                    }

                                    const ngoId = ngoResult.insertId;

                                    db.query(
                                        `INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)`,
                                        [ngoName, email, hashedPassword, "NGO_ADMIN"],
                                        (userErr) => {
                                            if (userErr) {
                                                return db.rollback(() => res.status(500).json({ message: userErr.message }));
                                            }

                                            let remaining = cleanCategories.length;
                                            let categoryError = null;

                                            cleanCategories.forEach((category) => {
                                                db.query(
                                                    `INSERT INTO ngo_categories (ngo_id, category_name) VALUES (?, ?)`,
                                                    [ngoId, category],
                                                    (categoryErr) => {
                                                        if (categoryErr && !categoryError) categoryError = categoryErr;
                                                        remaining -= 1;

                                                        if (remaining === 0) {
                                                            if (categoryError) {
                                                                return db.rollback(() => res.status(500).json({ message: categoryError.message }));
                                                            }

                                                            db.commit((commitErr) => {
                                                                if (commitErr) {
                                                                    return db.rollback(() => res.status(500).json({ message: commitErr.message }));
                                                                }

                                                                return res.status(201).json({
                                                                    message: "NGO Registered Successfully",
                                                                    ngoId,
                                                                    categories: cleanCategories
                                                                });
                                                            });
                                                        }
                                                    }
                                                );
                                            });
                                        }
                                    );
                                }
                            );
                        });
                    }
                );
            }
        );
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

/*
|--------------------------------------------------------------------------
| NGO Login
|--------------------------------------------------------------------------
*/
exports.login = (req, res) => {
    const { email, password } = req.body;

    db.query(
        `SELECT u.*, n.id AS ngo_id, n.ngo_name, n.phone AS ngo_phone, n.district AS ngo_district
         FROM users u
         LEFT JOIN ngos n ON n.email = u.email
         WHERE u.email = ?
         LIMIT 1`,
        [email],
        async (err, results) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: "Invalid Email" });
            }

            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({ message: "Invalid Password" });
            }

            const tokenPayload = {
                id: user.id,
                email: user.email,
                role: user.role,
                ngo_id: user.ngo_id || null
            };

            const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
                expiresIn: "1d"
            });

            return res.status(200).json({
                message: "Login Successful",
                token,
                role: user.role,
                ngo_id: user.ngo_id || null,
                ngo: user.ngo_id
                    ? {
                        id: user.ngo_id,
                        name: user.ngo_name,
                        phone: user.ngo_phone,
                        district: user.ngo_district
                    }
                    : null
            });
        }
    );
};
