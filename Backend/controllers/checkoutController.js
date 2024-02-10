import { Cart } from "../models/cart.js";
import { Order } from "../models/order.js";
// import { PaymentGateway } from "./paymentGateway.js"; // Import your payment gateway module

const checkout = async (req, res, next) => {
    try {
        // Get the cart ID from the session
        const cartId = req.session.cartId;

        // Retrieve the cart from the database
        const cart = await Cart.findById(cartId).populate('products.product');

        // Ensure that the cart exists and is not empty
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Calculate the total price of the items in the cart
        let totalPrice = 0;
        for (const item of cart.products) {
            totalPrice += item.quantity * item.product.price;
        }



            // Create the order
            const order = new Order({
                user: req.user._id, // Assuming req.user contains user information
                items: cart.products,
                totalPrice: totalPrice,
                paymentDetails: paymentResult.paymentDetails // Save payment details in the order
            });

            // Save the order to the database
            await order.save();

            // Clear the user's cart
            await Cart.findByIdAndDelete(cartId);

            // Respond with success message and order details
            return res.status(200).json({ message: 'Order placed successfully', order: order });
    } catch (error) {
        next(error);
    }
};

export default checkout;
