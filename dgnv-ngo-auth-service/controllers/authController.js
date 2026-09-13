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

        const {
            ngoName,
            email,
            password,
            phone,
            district,
            categories
        } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const ngoSql = `
            INSERT INTO ngos
            (ngo_name, email, phone, district)
            VALUES (?, ?, ?, ?)
        `;

        db.query(
            ngoSql,
            [ngoName, email, phone, district],
            (ngoErr, ngoResult) => {

                if (ngoErr) {
                    return res.status(500).json({
                        message: ngoErr.message
                    });
                }

                const ngoId = ngoResult.insertId;

                const userSql = `
                    INSERT INTO users
                    (full_name, email, password, role)
                    VALUES (?, ?, ?, ?)
                `;

                db.query(
                    userSql,
                    [
                        ngoName,
                        email,
                        hashedPassword,
                        "NGO_ADMIN"
                    ],
                    (userErr) => {

                        if (userErr) {
                            return res.status(500).json({
                                message: userErr.message
                            });
                        }

                        if (
                            categories &&
                            categories.length > 0
                        ) {

                            categories.forEach((category) => {

                                db.query(
                                    `
                                    INSERT INTO ngo_categories
                                    (ngo_id, category_name)
                                    VALUES (?, ?)
                                    `,
                                    [ngoId, category]
                                );

                            });

                        }

                        return res.status(201).json({
                            message: "NGO Registered Successfully"
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

/*
|--------------------------------------------------------------------------
| NGO Login
|--------------------------------------------------------------------------
*/
exports.login = (req, res) => {

    const { email, password } = req.body;

    const sql =
        "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, results) => {

        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }

        if (results.length === 0) {

            return res.status(401).json({
                message: "Invalid Email"
            });

        }

        const user = results[0];

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {

            return res.status(401).json({
                message: "Invalid Password"
            });

        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        return res.status(200).json({
            message: "Login Successful",
            token,
            role: user.role
        });

    });

};