import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import { connectPostgre } from './config/postgresql.js'
import userRouter from './routes/userRoutes.js'
import connectCloudinary from './config/cloudinary.js'
import addressRouter from './routes/addressRoutes.js'
import productRouter from './routes/productRoutes.js'
import cartRouter from './routes/cartRoutes.js'
import orderRouter from './routes/orderRoutes.js'

//App Config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectPostgre()
connectCloudinary()

//middleware
app.use(express.json())
app.use(cors({
    origin: [
        'http://localhost:5173', //user
        'http://localhost:5174' //admin
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

//api endpoint
app.use('/api/user', userRouter)
app.use('/api/products', productRouter)
app.use('/api/address', addressRouter)
app.use('/api/carts', cartRouter);
app.use('/api/orders', orderRouter);

app.get('/', (req,res) => {
    res.send("API Working")
})

app.listen(port, ()=> console.log('Server started on PORT: ' + port))