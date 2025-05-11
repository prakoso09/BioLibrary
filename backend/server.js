import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import cors from 'cors';
import path from "path";
import { fileURLToPath } from 'url'; // <-- PENTING: Tambahkan import ini!
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

// Dapatkan __filename dan __dirname yang akurat untuk ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // <-- Ini adalah __dirname yang benar!

// Konfigurasi CORS
app.use(cors({
    origin: 'http://localhost:5173', // Ganti dengan alamat frontend Anda yang benar
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// app.use(express.urlencoded({ extended: true })); // Opsional: Jika Anda juga menerima form-data non-file
app.use(express.json()); // Mengizinkan Express untuk menerima data JSON di req.body

// --- PENTING: Debugging Path Statis ---
// Ini akan mencetak path absolut yang digunakan oleh Express.js untuk mencari folder 'uploads'.
// Silakan periksa output di terminal Anda saat server dijalankan!
console.log('DEBUG: __dirname (directory of server.js):', __dirname);
console.log('DEBUG: Intended static path for uploads (assuming uploads is in project root):', path.join(__dirname, '..', 'uploads'));
// Jika folder 'uploads' Anda berada di dalam folder 'backend' (bersamaan dengan server.js),
// maka Anda akan menggunakan console.log dan path.join yang ini:
// console.log('DEBUG: Intended static path for uploads (assuming uploads is inside backend folder):', path.join(__dirname, 'uploads'));

// --- Melayani file statis dari folder 'uploads' ---
// Ini akan membuat file di folder 'uploads' dapat diakses melalui URL '/uploads/'.
// Berdasarkan struktur folder yang Anda tunjukkan (uploads sejajar dengan backend),
// path.join(__dirname, '..', 'uploads') adalah yang benar.
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Jika folder 'uploads' ada di dalam folder 'backend', gunakan baris ini sebagai gantinya:
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use("/api/data", dataRoute);

console.log(process.env.MONGO_URI);

if(process.env.NODE_ENV === "production"){
    // Path ini juga harus diperbaiki dengan __dirname yang akurat
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