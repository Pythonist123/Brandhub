import jwt from 'jsonwebtoken';
import cookie from "cookie";
import Store from '../models/store.js'; // Assuming you have a Store model
import Product from '../models/product.js';
import Category from '../models/category.js';
import JWT from '../middleware/JWT.js';

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
            // const token = jwt.sign({ id: newStore._id }, 'your-secret-key', { expiresIn: '1h' });
            const token = JWT(newStore._id,"store");

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
                // const token = jwt.sign({ id: store._id, role: 'store' }, 'your-secret-key', { expiresIn: '1h' });
                const token = JWT(store.id,'store');
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

    async addProduct(req, res, next){
        try {
            // Parse the incoming request body to extract product details
            const { name, description, price, category, size, color, image } = req.body;
    
            // Check if the specified category and store IDs exist in the database
            const categoryColl = await Category.findOne({ name: category });
            const brandID = req.user._id;

            const store = await Store.findById(brandID);
    
            if (!categoryColl || !store) {
                console.log("category",categoryColl,"\nstore",store);
                // If the category or store doesn't exist, return an error
                return res.status(404).json({ message: 'Category or store not found' });
            }
    
            // Create a new product
            const newProduct = new Product({
                name,
                description,
                price,
                categoryID:categoryColl._id,
                size,
                color,
                brandID,
                image,
            });
    
            // Save the newly created product to the database
            await newProduct.save();
    
            // Update the corresponding category document to include the newly added product
            categoryColl.products.push(newProduct._id);
            await categoryColl.save();
    
            // Update the corresponding store document to include the newly added product
            // store.products.push(newProduct._id);
            // await store.save();
    
            console.log('products',store.products);
            // Return a success response with the newly created product details
            res.status(201).json({ message: 'Product added successfully', product: newProduct });
        } catch (error) {
            // Handle any errors that may occur during the process
            next(error);
        }
    }
,
async addCategory(req, res, next) {
    try {
        // Extract category name from the request body
        const { name } = req.body;

        // Check if the category already exists
        const existingCategory = await Category.findOne({ name });

        // If the category already exists, return an error
        if (existingCategory) {
            const error = {
                status: 400,
                message: 'Category already exists',
            };
            return next(error);
        }

        // Create a new category
        const newCategory = new Category({
            name,
        });

        // Save the new category to the database
        await newCategory.save();

        // Return a success response
        res.status(201).json({
            message: 'Category added successfully',
            category: newCategory,
        });
    } catch (error) {
        // If an error occurs, pass it to the error handling middleware
        next(error);
    }
}

}

export default storeController;