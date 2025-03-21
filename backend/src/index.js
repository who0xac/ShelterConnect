import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors' ;
import connectDB from './config/db.js';
import route from './routes/route.js';
import { fileURLToPath } from "url";
import path from 'path';
// Load environment variables from .env file
dotenv.config();

// Intialize Express app
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enable Json
app.use(express.json());
app.use(cors({origin:"*"}));
const Port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();


app.use('/',route);
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Start the server
app.listen(Port, () => {
    console.log(`Server running on port ${Port}`);
});
