import Flora from "../models/flora.model.js";
import Fauna from "../models/fauna.model.js";
import TamanNasional from "../models/taman_nasional.model.js";
import mongoose from "mongoose";
import { deleteFromCloudinary } from "../config/cloudinary.js"; 

// Helper untuk memilih model
const getModel = (collectionName) => {
    switch (collectionName.toLowerCase()) {
        case 'flora': return Flora;
        case 'fauna': return Fauna;
        case 'taman_nasional': return TamanNasional;
        default: return null;
    }
};

// GET semua data
export const getData = async (req, res) => {
    const { collectionName } = req.params;
    const Model = getModel(collectionName);

    if (!Model) return res.status(400).json({ message: "Nama koleksi tidak valid." });

    try {
        const data = await Model.find();
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error(`Error fetching ${collectionName}:`, error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// POST data baru
export const createData = async (req, res) => {
    const { collectionName } = req.params;
    const Model = getModel(collectionName);

    if (!Model) return res.status(400).json({ message: "Nama koleksi tidak valid." });

    let dataToInsert = req.body;
    let imagePath = null;

    console.log('Inside createData controller...');
    console.log('req.user:', req.user);
    console.log('req.user.gmail:', req.user?.gmail);
  
    // Upload ke Cloudinary jika ada file
    if (req.file) {
        imagePath = req.file.secure_url; // Mengambil secure_url dari Cloudinary
    }


    // Tambahkan image ke data
    if (imagePath) {
        dataToInsert.image = imagePath;
    } else if (!dataToInsert.image && ['flora', 'fauna', 'taman_nasional'].includes(collectionName)) {
        return res.status(400).json({ message: "Harap sertakan gambar ." });
    }

    // Validasi khusus
    if (collectionName === 'flora' || collectionName === 'fauna') {
        if (!dataToInsert.namaIlmiah || !dataToInsert.namaLokal || !dataToInsert.image || !dataToInsert.deskripsi) {
            return res.status(400).json({ message: "Please provide all necessarie field : Scientifit Name, Local Name, General Description and Main Image." });
        }
    } else if (collectionName === 'taman_nasional') {
        if (!dataToInsert.namaResmi || !dataToInsert.lokasi || !dataToInsert.image || !dataToInsert.luas) {
            return res.status(400).json({ message: "Please provide all necessarie field : Official Name, Location, Area, and Main Image." });
        }
    }


        if (!req.user || !req.user.gmail) {
        // Ini skenario kalo middleware `protect` atau `authorizeRoles` gagal
        return res.status(401).json({ message: "Unauthorized: User's gmail not found. Please ensure you are logged in and the authorization middleware is correctly applied." });
    }

    dataToInsert.createdBy =  req.user.gmail
    const newData = new Model(dataToInsert);

    try {
        await newData.save();
        res.status(201).json({ success: true, data: newData, message: `${collectionName} added successfully` });
    } catch (error) {
        console.error(`Error saving ${collectionName}:`, error.message);
        res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
    }
};

// PUT (update)
export const updateData = async (req, res) => {
    const { collectionName, id } = req.params;
    const Model = getModel(collectionName);

    if (!Model) return res.status(400).json({ message: "Nama koleksi tidak valid." });
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: "ID tidak valid." });

    let updateData = req.body;

    try {
        const existingData = await Model.findById(id);
        if (!existingData) return res.status(404).json({ message: "Data tidak ditemukan." });

        // Handle update image
        if (req.file) {
            // Hapus gambar lama
            if (existingData.image) {
                await deleteFromCloudinary(existingData.image);
            }
            // Ambil secure_url dari req.file setelah upload
            updateData.image = req.file.secure_url;
        } else if (updateData.image === '') {
            // Hapus gambar jika dikosongkan
            if (existingData.image) {
                await deleteFromCloudinary(existingData.image);
            }
            updateData.image = null;
        }


        const updatedDocument = await Model.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

        if (!updatedDocument) return res.status(404).json({ message: "Data tidak ditemukan setelah update." });

        res.status(200).json({ success: true, data: updatedDocument, message: `${collectionName} updated successfully` });

    } catch (error) {
        console.error(`Error updating ${collectionName}:`, error.message);
        res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
    }
};

// DELETE
export const deleteData = async (req, res) => {
    const { collectionName, id } = req.params;
    const Model = getModel(collectionName);

    if (!Model) return res.status(400).json({ message: "Nama koleksi tidak valid." });
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: "ID tidak valid." });

    try {
        const deletedData = await Model.findByIdAndDelete(id);
        if (!deletedData) return res.status(404).json({ message: "Data tidak ditemukan." });

        // Hapus gambar dari Cloudinary jika ada
        if (deletedData.image) {
            await deleteFromCloudinary(deletedData.image);
        }

        res.status(200).json({ success: true, data: deletedData, message: `${collectionName} deleted successfully` });
    } catch (error) {
        console.error(`Error deleting ${collectionName}:`, error.message);
        res.status(500).json({ success: false, message: `Server Error: ${error.message}` });
    }
};

// GET by ID
export const getDataById = async (req, res) => {
    const { collectionName, id } = req.params;
    const Model = getModel(collectionName);

    if (!Model) return res.status(400).json({ message: "Nama koleksi tidak valid." });
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: "ID tidak valid." });

    try {
        const data = await Model.findById(id);
        if (!data) return res.status(404).json({ message: "Data tidak ditemukan." });
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error(`Error getById ${collectionName}:`, error.message);
        res.status(500).json({ message: "Server Error" });
    }
};
