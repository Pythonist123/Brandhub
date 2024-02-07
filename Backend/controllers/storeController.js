import jwt from 'jsonwebtoken';
import cookie from "cookie";
import Store from '../models/store.js'; // Assuming you have a Store model
import Product from '../models/product.js';
import Category from '../models/category.js';
import JWT from '../middleware/JWT.js';
import ProductDTO from '../DTO/productDTO.js';

const storeController = {
    async register(req, res, next) {
        try {
            const { storeName, email, password } = req.body;
            console.log(storeName, email);

            // Check if store with the same name or email already exists
            const existingStore = await Store.findOne({ $or: [{ storeName }, { email }] });

            if (existingStore) {
                console.log(existingStore);
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
                categories:[]
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


    // Add Product
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
                availableSizes:size,
                color,
                brandID,
                image,
            });
    
            // Save the newly created product to the database
            await newProduct.save();
    
            // add category to store if it doesn't exist
            if (!store.categories.includes(categoryColl._id)){
                store.categories.push(categoryColl._id);
            }
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
    },
// Delete Product
async deleteProduct(req, res, next) {
    try {
        // Fetch the product ID from the request parameters
        const { productId } = req.params;

        // Find the product by its ID and delete it
        const deletedProduct = await Product.findByIdAndDelete(productId);

        // If the product doesn't exist, return a 404 error
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Remove the deleted product ID from all categories that contain it
        await Category.updateMany(
            { products: productId }, // Find categories that contain the product
            { $pull: { products: productId } } // Pull the product ID from the products array
        );

        // Return a success response with the deleted product details
        res.json({ message: 'Product deleted successfully', product: deletedProduct });
    } catch (error) {
        // Handle any errors that may occur during the process
        next(error);
    }
}
,

    // Update Product
async updateProduct(req, res, next) {
    try {
        // Fetch the product ID from the request parameters
        const { productId } = req.params;
        // Extract updated product details from the request body
        const { name, description, price, category, size, color, image } = req.body;

        // Find the product by its ID
        const product = await Product.findById(productId);

        // If the product doesn't exist, return a 404 error
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update the product details
        product.name = name;
        product.description = description;
        product.price = price;
        product.category = category;
        product.size = size;
        product.color = color;
        product.image = image;

        // Save the updated product to the database
        await product.save();

        // Return a success response with the updated product details
        res.json({ message: 'Product updated successfully', product });
    } catch (error) {
        // Handle any errors that may occur during the process
        next(error);
    }
},

        // Get Product
    async getProduct(req, res, next) {
    try {
        // Fetch the product ID from the request parameters
        const { productId } = req.params;

        // Find the product by its ID
        const product = await Product.findById(productId);

        // If the product doesn't exist, return a 404 error
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Return the product details
        const productDto = new ProductDTO(
            product._id,
            product.name,
            product.description,
            product.price,
            product.categoryID,
            product.availableSizes,
            product.color,
            product.image,
            product.inStock

        )
        res.status(200).json({ productDto });
    } catch (error) {
        // Handle any errors that may occur during the process
        next(error);
    }
}
,
    async getProductsByCategory(req, res, next) {
    try {
        const { storeName, categoryName } = req.params;

        // Find the store by name
        const store = await Store.findOne({ name: storeName });

        // If the store doesn't exist, return an error
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        // Find the category by name
        const category = await Category.findOne({ name: categoryName });

        // If the category doesn't exist, return an error
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Fetch products belonging to the category and associated with the store
        const products = await Product.find({
            categoryID: category._id,
            brandID: store._id // Assuming brandID represents the store's ID in the Product model
        });

        const productsArr = products.map((product)=>{
            const productDto = new ProductDTO(
                product._id,
                product.name,
                product.description,
                product.price,
                product.categoryID,
                product.availableSizes,
                product.color,
                product.image,
                product.inStock
    
            )

            return productDto
        })
        // Return the products belonging to the category and associated with the store
        res.json({ products:productsArr });
    } catch (error){
        next(error);
    }
}

,
    async addCategory(req, res, next) {
    try {
        // Extract category name from the request body
        const { name } = req.body;
        const storeId = req.user._id;


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

        const store = await Store.findOne(storeId);
        store.categories.push(newCategory._id);

        await store.save();

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