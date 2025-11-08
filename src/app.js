import express from 'express';
import cartRouter from './routes/cart.route.js';
import wishlistRouter from './routes/wishlist.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';



const app = express();

app.use(cors({
  origin: 'https://revoire.vercel.app',
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  credentials: true 
}));

app.use(express.json());
app.use(cookieParser());
app.use('/api/cart', cartRouter);
app.use('/api/wishlist', wishlistRouter);


app.get("/", (req, res) => {
    res.status(200).json({
        message: "Cart and Wishlist service is running"
    });
})


export default app;