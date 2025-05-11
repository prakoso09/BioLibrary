import express from 'express';
import mongoose, { get } from 'mongoose';
import multer from 'multer'; // <--- TAMBAH INI: Import Multer
import path from 'path';    // <--- TAMBAH INI: Import Path untuk menangani lokasi file

import { getData, createData, updateData, deleteData, getDataById } from '../controllers/data.controller.js';
import { registerUser, loginUser } from '../controllers/auth.controller.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinary } from '../config/cloudinary.js';



const router = express.Router();

// --- KONFIGURASI MULTER UNTUK RUTE INI ---
// Ini adalah konfigurasi penyimpanan untuk Multer.
// diskStorage memungkinkan kita untuk mengontrol destinasi dan nama file.
const uploadStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'uploads', // folder di cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }], // opsional
  },
});


// Middleware Multer yang akan digunakan pada rute.
// .single('image') berarti Multer akan mengharapkan satu file yang diunggah
// dengan nama field formulir 'image'. Informasi file ini akan tersedia di req.file.
const upload = multer({
    storage: uploadStorage,
    // Opsi tambahan untuk keamanan dan performa (opsional tapi disarankan):
    limits: { fileSize: 5 * 1024 * 1024 }, // Batas ukuran file 5MB (dalam bytes)
    fileFilter: (req, file, cb) => { // Filter jenis file yang diizinkan
        const filetypes = /jpeg|jpg|png|gif/; // Regex untuk jenis file yang diizinkan
        const mimetype = filetypes.test(file.mimetype); // Cek MIME type
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // Cek ekstensi file

        if (mimetype && extname) {
            return cb(null, true); // Izinkan upload
        } else {
            cb(new Error('Error: Hanya file gambar (jpeg, jpg, png, gif) yang diizinkan!')); // Tolak upload
        }
    }
});
// --- AKHIR KONFIGURASI MULTER ---

// Route untuk registrasi user
router.post("/register", registerUser);
// Route untuk login user
router.post("/login", loginUser);

// Rute yang lebih spesifik harus didefinisikan di atas rute yang lebih umum!
router.get("/:collectionName/:id", getDataById);
router.get("/:collectionName", getData);

// Untuk flora, fauna, taman_nasional:
// Rute CREATE data.
// Middleware `upload.single('image')` disisipkan di sini. Ini akan memproses file
// sebelum `createData` controller dijalankan. Jika upload berhasil, `req.file` akan tersedia.
router.post("/:collectionName", protect, upload.single('image'), createData);

// Rute UPDATE data (hanya Dosen yang bisa mengedit).
// Middleware `upload.single('image')` juga disisipkan di sini.
// Ini akan menangani kasus di mana pengguna ingin mengupdate gambar atau menggantinya.
router.put("/:collectionName/:id", protect, upload.single('image'), updateData);

// Rute DELETE data (hanya Dosen yang bisa menghapus).
// Tidak perlu middleware Multer di sini karena tidak ada file yang diupload.
router.delete("/:collectionName/:id", protect, deleteData);

export default router;