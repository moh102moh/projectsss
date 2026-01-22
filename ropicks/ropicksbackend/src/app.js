import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';

import authRoutes from './routes/auth.route.js';
import categoryRoutes from './routes/category.route.js';
import productRoutes from './routes/product.route.js';
import chehkoutRoutes from './routes/chechout.route.js';
import reviewRoutes from './routes/review.route.js';
import userRoutes from './routes/user.route.js';
import cartRoutes from './routes/cart.route.js';
import { sequelize } from './models/index.js';

await sequelize.sync({ alter: true });


const app = express();

app.use(express.json());        
app.use(express.urlencoded({ extended: true })); 
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 1000
});
app.use(limiter);


const uploadPath = path.join(process.cwd(), 'src/uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}


app.use('/uploads', express.static(uploadPath));


app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/product', productRoutes);
app.use('/api/checkout', chehkoutRoutes);

app.use('/api/reviews', reviewRoutes);


app.use('/api/users', userRoutes);

app.use('/api/cart', cartRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to Ropicks API');
});

export default app;

