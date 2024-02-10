import {Cart, CartItem} from "../models/cart.js";
// import cart from "../models/cart.js";


const cartController = {
    // async addTocart(req, res, next) {
    //     const { cartId, productId, quantity } = req.body;
    
    //     try {
    //         let cart = await Cart.findById(cartId);
    
    //         if (!cart) {
    //             // If cart does not exist, create a new one
    //             cart = new Cart({ products: [], user: req.user._id });
    //         }
    
    //         // Check if the product is already in the cart
    //         const existingItem = cart.products.find(item => item.product.equals(productId));
    
    //         if (existingItem) {
    //             // If the product already exists in the cart, update the quantity
    //             existingItem.quantity += quantity;
    //         } else {
    //             // If the product is not in the cart, add it as a new item
    //             cart.products.push({ product: productId, quantity });
    //         }
    
    //         await cart.save();
    
    //         res.status(201).json({ message: 'Item added to cart successfully', cart });
    //     } catch (error) {
    //         next(error);
    //     }
    // },

    async addToCart(req, res, next) {
        const { productId, quantity } = req.body;
        let cartId = req.session.cartId;

        

        try {
            // If user doesn't have a cart ID in the session, create a new cart
            if (!cartId) {
                const newCart = new Cart({ products: [] });
                await newCart.save();
           
                cartId = newCart._id;
                req.session.cartId = cartId; // Store the cart ID in the session
            }
            console.log(req.session)
            // Find the cart by ID
            let cart = await Cart.findById(cartId);

            // Check if the product already exists in the cart
            const existingItemIndex = cart.products.findIndex(item => item.product.equals(productId));

            if (existingItemIndex !== -1) {
                // If the product exists, update the quantity
                cart.products[existingItemIndex].quantity += quantity;
            } else {
                // If the product doesn't exist, add it to the cart
                cart.products.push({
                    product: productId,
                    quantity: quantity
                });
            }

            // Update the cart
            await cart.save();

            res.status(200).json({ message: 'Item added to cart successfully' });
        } catch (error) {
            next(error);
        }
    }
    ,
    async deleteFromCart(req, res, next) {
        const { cartId, itemId } = req.body;
    
        try {
            const cart = await Cart.findById(cartId);
    
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }
    
            // Remove the item from the cart
            cart.products = cart.products.filter(item => !item._id.equals(itemId));
            await cart.save();
    
            res.json({ message: 'Item deleted from cart successfully', cart });
        } catch (error) {
            next(error);
        }
    },
    async increaseQuantity(req, res, next) {
        const { cartId, itemId } = req.body;

        try {
            // Find the cart by ID
            const cart = await Cart.findById(cartId);

            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }

            // Find the item in the cart
            const item = cart.products.find(item => item._id.equals(itemId));

            if (!item) {
                return res.status(404).json({ message: 'Item not found in cart' });
            }

            // Increase the quantity
            item.quantity++;

            // Update the cart
            await cart.save();

            res.status(200).json({ message: 'Quantity increased successfully' });
        } catch (error) {
            next(error);
        }
    },

    async decreaseQuantity(req, res, next) {
        const { cartId, itemId } = req.body;

        try {
            // Find the cart by ID
            const cart = await Cart.findById(cartId);

            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }

            // Find the item in the cart
            const item = cart.products.find(item => item._id.equals(itemId));

            if (!item) {
                return res.status(404).json({ message: 'Item not found in cart' });
            }

            // Decrease the quantity
            if (item.quantity > 1) {
                item.quantity--;
            }

            // Update the cart
            await cart.save();

            res.status(200).json({ message: 'Quantity decreased successfully' });
        } catch (error) {
            next(error);
        }
    },

    async deleteCart(req, res, next) {
        // const  cartId  = req.session.cartId;
        const {cartId} = req.body;
        
        // console.log(req.session.cartId);


        try {
            // Find and delete the cart by ID
            const cart = await Cart.findByIdAndDelete(cartId);
            // await cart.save();
            res.status(200).json({ message: 'Cart deleted successfully',cart });
        } catch (error) {
            next(error);
        }
    }
    
    
    


}

export default cartController;