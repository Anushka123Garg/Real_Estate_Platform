import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
    console.log("Connected to MongoDB!");
    }).catch ((err) => {
        console.log(err);
    });

const __dirname= path.resolve();

const app = express();

// app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cors({ origin: true, credentials: true }));

app.use(express.static(path.join(__dirname, '/client/dist')));
app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, 'client','dist', 'index.html'));
})

app.use(express.json());  //allow the JSON as input to server, otherwise undefined will come
app.use(cookieParser());  //for getting info from  cookie

app.listen(3000, () => {
    console.log('Server is running on port 3000!!!');
}
);

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

//middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    });
});


