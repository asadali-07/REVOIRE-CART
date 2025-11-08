import Wishlist from "../models/whishlist.model.js";
import axios from "axios";

export const toggleWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        const product = await axios.get(`http://localhost:3001/api/products/${productId}`, {
            headers: {
                Authorization: `Bearer ${req.cookies.token}`
            }
        });
        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: userId, items: [] });
        }
        const existingItemIndex = wishlist.items.findIndex(item => item.productId.toString() === productId);
        if (existingItemIndex !== -1) {
            wishlist.items.splice(existingItemIndex, 1);
            await wishlist.save();
            return res.status(200).json({ message: "Item removed from wishlist", wishlist });
        }  
        wishlist.items.push({
            productId,
            title: product.data.product.title,
            category: product.data.product.category,
            price: {
                amount: product.data.product.price.amount,
                currency: product.data.product.price.currency
            },
            originalPrice: product.data.product.originalPrice,
            stock: product.data.product.stock,
            images: product.data.product.images,
        });
        await wishlist.save();
        res.status(200).json({ message: "Item added to wishlist", wishlist });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
export const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) {
            const newWishlist = await Wishlist.create({ user: userId, items: [] });
            return res.json({ message: 'Wishlist is empty', wishlist: newWishlist });
        }
        res.json({
            message: 'Wishlist fetched successfully',
            wishlist
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
