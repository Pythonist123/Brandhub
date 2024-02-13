import User from '../models/user.js';
import Product from '../models/product.js';
import Whishlist from '../models/whishlist.js';

const whishListController = {
// add to whishlist
    async addToWhishList(req, res, next) {
        const { productId, userId } = req.body;
        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            const whishlist = await Whishlist.findOne({ product: productId, user: userId });
            if (whishlist) {
                return res.status(400).json({ message: 'Product already in whishlist' });
            }
            const newWhishlist = new Whishlist({
                product: productId,
                user: userId
            });
            await newWhishlist.save();
            res.status(200).json({ message: 'Product added to whishlist successfully' });
        } catch (error) {
            next(error);
        }
    }
}

export default whishListController;