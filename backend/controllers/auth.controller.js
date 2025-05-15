import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js"; 
import mongoose from "mongoose"; 
import Flora from "../models/flora.model.js"; 

export const registerUser = async (req, res) => {
  const { usn, password, gmail, name, institusi, role, nidn, nim, nooFpark, parkName } = req.body;

  // Validasi input
  if (!name) {
    return res.status(400).json({ message: "Nama lengkap wajib diisi!" });
  }
  if (!usn) {
    return res.status(400).json({ message: "Username wajib diisi!" });
  }
  if (!password) {
    return res.status(400).json({ message: "Password wajib diisi!" });
  }
  if (!gmail) {
    return res.status(400).json({ message: "Email wajib diisi!" });
  }

  if (!role) {
    return res.status(400).json({ message: "Role wajib diisi!" });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "Password harus berisi minimal 8 karakter!" });
  }

  console.log("Request Body: ", req.body); // debugging: print  request body

  try {
    // Cek apakah email sudah ada di database
    const existingGmail = await User.findOne({ gmail });
    const existingUsn = await User.findOne({ usn });
    const emailRegex = /.+@gmail\.com$/;

    if (!emailRegex.test(gmail)) {
      return res.status(400).json({ message: "Email harus menggunakan domain @gmail.com!" });
    }

    if (existingUsn) {
      return res.status(400).json({ message: "Usn sudah terdaftar!" });
    }
    if (existingGmail) {
      return res.status(400).json({ message: "Gmail sudah terdaftar!" });
    }

    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    // Menyimpan user baru ke database
    const newUser = new User({
      usn,
      password: hashedPassword,
      gmail,
      name,
      institusi,
      role,
      nidn,
      nim,
      nooFpark,
      parkName,
    });

    await newUser.save();

    // Generate token JWT 
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role, gmail: newUser.gmail },  
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );


    // Mengirim response
    res.status(201).json({ message: "User berhasil terdaftar!", token });
  } catch (error) {
    console.error("Error registrasi: ", error.message); // Cek error message
    console.log(req.body); // Debugging: Print request body
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};


export const loginUser = async (req, res) => {
  const { gmail, password } = req.body;

  if (!gmail || !password) {
    return res.status(400).json({ message: "Email dan password harus diisi!" });
  }

  try {

    // Cek apakah pengguna ada
    const user = await User.findOne({ gmail });
    if (!user) {
      return res.status(400).json({ message: "Email atau password salah!" });
    }

    // Bandingkan password yang dimasukkan dengan password yang sudah di-hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Email atau password salah!" });
    }

    // Generate token JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role, gmail: user.gmail }, 
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login berhasil!", token });
  } catch (error) {
    console.error("Error login: ", error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
  console.log(req.body);
};