import mongoose from 'mongoose';

const WishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
            },
            title: {
                type: String,
                required: true,
                trim: true,
            },
            category: {
                type: String,
                required: true,
            },
            price: {
                amount: {
                    type: Number,
                    required: true,
                    min: 0
                },
                currency: {
                    type: String,
                    enum: ['USD', 'INR'],
                    default: 'INR'
                }
            },
            stock: {
                type: Number,
                min: 0,
                required: true,
            },
            images: [
                {
                    url: String,
                    thumbnail: String,
                    fileId: String
                }
            ],
            originalPrice: {
                type: Number,
                min: 0,
                required: true,
            },
        },
    ],
}, { timestamps: true });


const Wishlist = mongoose.model('Wishlist', WishlistSchema);

export default Wishlist;