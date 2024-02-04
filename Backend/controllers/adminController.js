import jwt from 'jsonwebtoken';
import Admin from "../models/admin.js";
import cookie from "cookie"

const adminController = {
    async login(req, res, next) {
        try {
            const { password } = req.body;

            const admin = await Admin.findOne({});

            if (!admin) {
                const error = {
                    status: 401,
                    message: "Admin not found",
                };
                return next(error);
            }

            // Check if the password is correct
            if (password === admin.password) {
                // Generate a JWT token
                const token = jwt.sign({ id: admin._id }, 'your-secret-key', { expiresIn: '1h' });


                // Set the token as a cookie
                res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                    httpOnly: true,
                    maxAge: 3600, // Set the expiration time in seconds (1 hour in this example)
                    sameSite: 'strict', // Adjust based on your security requirements
                    path: '/', // Adjust based on your application's path structure
                }));


                // Respond with a success message
                res.status(200).json({ message: "Admin logged in" });
            } else {
                const error = {
                    status: 401,
                    message: "Incorrect password",
                };

                next(error);
            }
        } catch (error) {
            next(error);
        }
    }
}

export default adminController;
