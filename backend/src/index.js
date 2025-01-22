import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors' ;

// Load environment variables from .env file
dotenv.config();

// Intialize Express app
const app = express();

// Enable Json
app.use(express.json());
app.use(cors({origin:"*"}));
const Port = process.env.PORT || 3000;

// Routes
app.use('/',(req,res)=>{
    res.send('Hello World!');
})

// Start the server

app.listen(Port, () => {
    console.log(`Server running on port ${Port}`);
});
