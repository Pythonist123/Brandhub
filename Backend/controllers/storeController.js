import jwt from 'jsonwebtoken';
import Store from '../models/store.js'; // Assuming you have a Store model

const storeController = {
    async register(req, res, next) {
        try {
            const { storeName, email, password } = req.body;

            // Check if store with the same name or email already exists
            const existingStore = await Store.findOne({ $or: [{ storeName }, { email }] });

            if (existingStore) {
                const error = {
                    status: 400,
                    message: 'Store with the same name or email already exists',
                };
                return next(error);
            }

            // Create a new store
            const newStore = new Store({
                storeName,
                email,
                password, // In a real-world scenario, you should hash the password before storing it
            });

            // Save the store to the database
            await newStore.save();

            // Generate a JWT token for the newly registered store
            const token = jwt.sign({ id: newStore._id }, 'your-secret-key', { expiresIn: '1h' });

            // Set the token as a cookie
            res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                httpOnly: true,
                maxAge: 3600, // Set the expiration time in seconds (1 hour in this example)
                sameSite: 'strict', // Adjust based on your security requirements
                path: '/', // Adjust based on your application's path structure
            }));

            // Respond with a success message and token
            res.status(201).json({
                message: 'Store registered successfully',
                token,
            });
        } catch (error) {
            next(error);
        }
    },

    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            // Find the store by email
            const store = await Store.findOne({ email });

            if (!store) {
                const error = {
                    status: 401,
                    message: "Store not found",
                };
                return next(error);
            }

            // Check if the password is correct
            if (password === store.password) {
                // Generate a JWT token
                const token = jwt.sign({ id: store._id, role: 'store' }, 'your-secret-key', { expiresIn: '1h' });

                // Set the token as a cookie
                res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                    httpOnly: true,
                    maxAge: 3600, // Set the expiration time in seconds (1 hour in this example)
                    sameSite: 'strict', // Adjust based on your security requirements
                    path: '/', // Adjust based on your application's path structure
                }));

                // Respond with a success message
                res.status(200).json({ message: "Store logged in" });
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
    },

}

export default storeController;