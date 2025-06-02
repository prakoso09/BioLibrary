import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import cors from 'cors';
import path from "path";
import { fileURLToPath } from 'url'; 
import dataRoute from './routes/data.route.js';
import { v2 as cloudinary } from 'cloudinary';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Dapatkan __filename dan __dirname yang akurat untuk ES Modules, dirname tuh direktori?
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 
const FRONTEND_URL = process.env.FRONTEND_URL 
// Konfigurasi CORS
app.use(cors({
    origin: FRONTEND_URL, 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));


app.use(express.json()); // Mengizinkan Express untuk menerima data JSON di req.body


console.log('DEBUG: __dirname (directory of server.js):', __dirname);
console.log('DEBUG: Intended static path for uploads (assuming uploads is in project root):', path.join(__dirname, '..', 'uploads'));



app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));


app.use("/api/data", dataRoute);

console.log(process.env.MONGO_URI);

if(process.env.NODE_ENV === "production"){
    const pathToFrontendDist = path.join(__dirname, "..", "frontend", "dist");
    console.log(`Serving static files from: ${pathToFrontendDist}`);
    app.use(express.static(pathToFrontendDist));

    app.get("*", (req,res) => {
        res.sendFile(path.resolve(pathToFrontendDist, "index.html"));
    });
} else {
    console.log('Backend is running in development mode. Frontend should be run separately.');
}

app.listen(PORT, () => {
    connectDB();
    console.log('Server started at http://localhost:' + PORT);
});