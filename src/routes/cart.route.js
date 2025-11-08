import express from 'express';
import { getCart, addItemToCart, increaseItemQuantity, decreaseItemQuantity,removeItemFromCart, clearCart } from '../controllers/cart.controller.js';
import { createAuthMiddleware } from '../middlewares/auth.middleware.js';
import { validateAddItem, validateItem} from '../middlewares/validation.middleware.js';


const router = express.Router();

router.get("/", createAuthMiddleware(["user","seller"]), getCart);
router.post("/items", createAuthMiddleware(["user","seller"]), validateAddItem, addItemToCart);
router.patch("/items/:productId/increase", createAuthMiddleware(["user","seller"]), validateItem, increaseItemQuantity);
router.patch("/items/:productId/decrease", createAuthMiddleware(["user","seller"]), validateItem, decreaseItemQuantity);
router.delete("/items/:productId", createAuthMiddleware(["user","seller"]), validateItem, removeItemFromCart);
router.delete("/clear", createAuthMiddleware(["user","seller"]), clearCart);

export default router;