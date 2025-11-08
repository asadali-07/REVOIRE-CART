import Cart from '../models/cart.model.js';
import { publishToQueue } from '../broker/broker.js';
import axios from 'axios';

export const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            Cart.create({ user: userId, items: [] });
            return res.json({ message: 'Cart is empty', cart: { user: userId, items: [] } });
        }
        res.json({
            message: 'Cart fetched successfully',
            cart
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const addItemToCart = async (req, res) => {
    const { productId, qty = 1 } = req.body;
    const userId = req.user.id;
    try {
        const product = await axios.get(`https://revoire-product.onrender.com/api/products/${productId}`, {
            headers: {
                Authorization: `Bearer ${req.cookies.token}`
            }
        });
        if (product.data.product.stock <= 0) {
            return res.status(400).json({ message: 'Product is out of stock' });
        }
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }
        const existingItem = cart.items.find(item => item.productId.toString() === productId);
        if (existingItem) {
            existingItem.quantity += qty;
        } else {
            await publishToQueue('CART_NOTIFICATION.ITEM_ADDED', {
                username: req.user.username,
                itemName: product.data.product.title,
                email: req.user.email
            });
            cart.items.push({
                productId,
                title: product.data.product.title,
                category: product.data.product.category,
                price: {
                    amount: product.data.product.price.amount,
                    currency: product.data.product.price.currency
                },
                stock: product.data.product.stock,
                images: product.data.product.images,
                quantity: qty
            });
        }
        await cart.save();
        res.status(201).json({ message: 'Item added to cart successfully', cart });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const increaseItemQuantity = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.id;
    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            Cart.create({ user: userId, items: [] });
            return res.status(200).json({ message: 'No items found in cart', cart: { user: userId, items: [] } });
        }
        const item = cart.items.find(item => item.productId.toString() === productId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }
        if (item.stock <= item.quantity) {
            return res.status(400).json({ message: 'Product not have enough stock' });
        }
        item.quantity += 1;
        await cart.save();
        res.json({ message: 'Item quantity increased', cart });
    } catch (error) {
        console.error('Error updating item quantity:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const decreaseItemQuantity = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.id;
    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            Cart.create({ user: userId, items: [] });
            return res.status(200).json({ message: 'No items found in cart', cart: { user: userId, items: [] } });
        }
        const item = cart.items.find(item => item.productId.toString() === productId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }
        item.quantity -= 1;
        if (item.quantity <= 0) {
            cart.items = cart.items.filter(i => i.productId.toString() !== productId);
        }
        await cart.save();
        res.json({ message: 'Item quantity decreased', cart });
    } catch (error) {
        console.error('Error updating item quantity:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const removeItemFromCart = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.id;
    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            Cart.create({ user: userId, items: [] });
            return res.status(200).json({ message: 'No items found in cart', cart: { user: userId, items: [] } });
        }
        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        await cart.save();
        res.json({ message: 'Item removed from cart', cart });
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const clearCart = async (req, res) => {
    const userId = req.user.id;
    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            const cart = await Cart.create({ user: userId, items: [] });
            return res.status(200).json({ message: 'Already no items  in cart', cart });
        }
        cart.items = [];
        await cart.save();
        res.json({ message: 'Cart cleared successfully', cart });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
