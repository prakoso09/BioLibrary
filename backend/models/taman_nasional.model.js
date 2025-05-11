import mongoose from 'mongoose';

const tamanNasionalSchema = new mongoose.Schema({
    namaResmi: {
        type: String,
        required: true,
        trim: true,
        unique: true // Nama resmi sebaiknya unik untuk identifikasi
    },
    lokasi: {
        type: String,
        required: true,
        trim: true
    },
    wilayahAdministratif: {
        type: [String], // Array of strings for multiple administrative regions (Kabupaten/Kota)
        required: true
    },
    image: {
        type: String, // URL gambar
        required: true,
        trim: true
    },
    koordinatGeografis: {
        lintang: {
            type: String, // Contoh: "7°32′ – 7°42′ LS"
            trim: true
        },
        bujur: {
            type: String, // Contoh: "110°22′ – 110°32′ BT"
            trim: true
        }
    },
    luas: {
        value: {
            type: Number, // Contoh: 6410
            required: true
        },
        unit: {
            type: String, // Contoh: "Hektar"
            default: "Hektar"
        },
        referensi: {
            type: String, // Contoh: "Keputusan Menteri Kehutanan Nomor SK.653/Menhut-II/2004"
            trim: true
        }
    },
    ketinggian: {
        min: {
            type: Number, // Contoh: 600
            required: true
        },
        max: {
            type: Number, // Contoh: 2930
            required: true
        },
        unit: {
            type: String, // Contoh: "mdpl"
            default: "mdpl"
        }
    },
    topografi: {
        type: String,
        trim: true
    },
    geologi: {
        type: String,
        trim: true
    },
    iklim: {
        tipe: {
            type: String, // Contoh: "Tipe iklim B (basah) dan C (sedang) menurut klasifikasi Schmidt-Ferguson."
            trim: true
        },
        curahHujanRataRata: {
            value: {
                type: String, // Contoh: "2.500 – 3.500" (string karena rentang)
                trim: true
            },
            unit: {
                type: String, // Contoh: "mm/tahun"
                default: "mm/tahun"
            }
        },
        suhuRataRata: {
            kakiGunung: {
                type: String, // Contoh: "20°C – 28°C"
                trim: true
            },
            puncak: {
                type: String, // Contoh: "di bawah 10°C"
                trim: true
            }
        },
        kelembabanUdaraRataRata: {
            value: {
                type: String, // Contoh: "Tinggi, seringkali di atas 80%"
                trim: true
            },
            unit: {
                type: String, // Contoh: "%"
                default: "%"
            }
        }
    },
    ekosistemHabitat: [{ // Array of objects for different habitat types
        nama: {
            type: String, // Contoh: "Kawasan Puncak dan Lereng Atas"
            trim: true
        },
        deskripsi: {
            type: String,
            trim: true
        }
    }],
    flora: {
        jumlahJenis: {
            type: String, // Contoh: "Diperkirakan lebih dari 500 jenis tumbuhan berpembuluh."
            trim: true
        },
        pohonDominan: [{
            namaLokal: { type: String, trim: true },
            namaIlmiah: { type: String, trim: true },
            keterangan: { type: String, trim: true } // Opsional, untuk detail tambahan
        }],
        tumbuhanBawahSemak: [{
            namaLokal: { type: String, trim: true },
            namaIlmiah: { type: String, trim: true },
            keterangan: { type: String, trim: true }
        }],
        tumbuhanPionir: [{
            namaLokal: { type: String, trim: true },
            namaIlmiah: { type: String, trim: true },
            keterangan: { type: String, trim: true }
        }],
        tumbuhanKhasEndemik: [{
            namaLokal: { type: String, trim: true },
            namaIlmiah: { type: String, trim: true },
            keterangan: { type: String, trim: true }
        }]
    },
    fauna: {
        jumlahJenis: {
            burung: { type: String, trim: true }, // Contoh: "lebih dari 100 jenis burung"
            mamalia: { type: String, trim: true },
            reptil: { type: String, trim: true },
            amfibi: { type: String, trim: true }
        },
        mamalia: [{ // Array of objects, grouped by category (Primata, Rodentia, etc.)
            kategori: { type: String, trim: true },
            jenis: [{ // Array of objects for each species in the category
                namaLokal: { type: String, trim: true },
                namaIlmiah: { type: String, trim: true },
                keterangan: { type: String, trim: true }
            }]
        }],
        burung: [{ // Array of objects, grouped by category
            kategori: { type: String, trim: true },
            jenis: [{
                namaLokal: { type: String, trim: true },
                namaIlmiah: { type: String, trim: true },
                keterangan: { type: String, trim: true }
            }]
        }]
    },
    sejarahSingkat: [{ // Array of strings for each historical point
        type: String,
        trim: true
    }],
    aktivitasPengelolaan: [{
        nama: {
            type: String, // Contoh: "Konservasi", "Penelitian", "Ekowisata"
            trim: true
        },
        deskripsi: {
            type: String,
            trim: true
        },
        detail: [{ // Array of strings for sub-activities, especially useful for Ekowisata
            type: String,
            trim: true
        }]
    }],
    fasilitasPendukung: [{
        type: String,
        trim: true
    }],
    ancamanKonservasi: [{
        type: String,
        trim: true
    }],
    upayaKonservasi: [{
        type: String,
        trim: true
    }],
    createdBy: {
        type: String,
        // required: true, // Bisa diaktifkan jika ingin memastikan ada pembuatnya
    },
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

const TamanNasional = mongoose.model('TamanNasional', tamanNasionalSchema, 'taman_nasional'); // 'taman_nasional' adalah nama koleksi di MongoDB

export default TamanNasional;