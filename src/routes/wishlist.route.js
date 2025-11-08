import express from 'express';
import {createAuthMiddleware} from '../middlewares/auth.middleware.js';
import { toggleWishlist, getWishlist } from '../controllers/wishlist.controller.js';
import { validateAddItem} from '../middlewares/validation.middleware.js';

const router = express.Router();

router.post('/items', createAuthMiddleware(['user', 'seller']), validateAddItem, toggleWishlist);
router.get('/', createAuthMiddleware(['user', 'seller']), getWishlist);

export default router;
