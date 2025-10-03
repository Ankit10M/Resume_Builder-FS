import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { connectDB } from './config/db.js';
import userRouter from './routes/userRoutes.js';
import path from 'path'
import { fileURLToPath } from 'url';
import resumeRoutes from './routes/resumeRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
const app = express()
const PORT = process.env.PORT || 4000

const corsOptions = {
    // Specify the exact origin your frontend is running on
    origin: 'http://localhost:5173', 
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true, // Important for sending Authorization headers
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions))

// connect DB
connectDB();
//  Middleware
app.use(express.json())

app.use('/api/auth', userRouter)
app.use('/api/resume',resumeRoutes)
app.use('/uploads',express.static(path.join(__dirname,'uploads'))
)
//  Routes
app.get('/', (req, res) => {
    res.send('API is running....')
})

// Listening to server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})












