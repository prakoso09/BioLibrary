import mongoose from 'mongoose';

const tamanNasionalSchema = new mongoose.Schema({
    namaResmi: {
        type: String,
        required: true,
        trim: true,
        unique: true 
    },
    lokasi: {
        type: String,
        required: true,
        trim: true
    },
    wilayahAdministratif: {
        type: [String], 
        required: true
    },
    image: {
        type: String, 
        required: true,
        trim: true
    },
    koordinatGeografis: {
        lintang: {
            type: String, 
            trim: true
        },
        bujur: {
            type: String, 
            trim: true
        }
    },
    luas: {
        value: {
            type: Number, 
            required: true
        },
        unit: {
            type: String, 
            default: "Hektar"
        },
        referensi: {
            type: String, 
            trim: true
        }
    },
    ketinggian: {
        min: {
            type: Number, 
            required: true
        },
        max: {
            type: Number, 
            required: true
        },
        unit: {
            type: String, 
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
            type: String, 
            trim: true
        },
        curahHujanRataRata: {
            value: {
                type: String, 
                trim: true
            },
            unit: {
                type: String, 
                default: "mm/tahun"
            }
        },
        suhuRataRata: {
            kakiGunung: {
                type: String, 
                trim: true
            },
            puncak: {
                type: String, 
                trim: true
            }
        },
        kelembabanUdaraRataRata: {
            value: {
                type: String, 
                trim: true
            },
            unit: {
                type: String, 
                default: "%"
            }
        }
    },
    ekosistemHabitat: [{ 
        nama: {
            type: String, 
            trim: true
        },
        deskripsi: {
            type: String,
            trim: true
        }
    }],
    flora: {
        jumlahJenis: {
            type: String, 
            trim: true
        },
        pohonDominan: [{
            namaLokal: { type: String, trim: true },
            namaIlmiah: { type: String, trim: true },
            keterangan: { type: String, trim: true } 
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
            burung: { type: String, trim: true }, 
            mamalia: { type: String, trim: true },
            reptil: { type: String, trim: true },
            amfibi: { type: String, trim: true }
        },
        mamalia: [{ 
            kategori: { type: String, trim: true },
            jenis: [{ 
                namaLokal: { type: String, trim: true },
                namaIlmiah: { type: String, trim: true },
                keterangan: { type: String, trim: true }
            }]
        }],
        burung: [{ 
            kategori: { type: String, trim: true },
            jenis: [{
                namaLokal: { type: String, trim: true },
                namaIlmiah: { type: String, trim: true },
                keterangan: { type: String, trim: true }
            }]
        }]
    },
    sejarahSingkat: [{ 
        type: String,
        trim: true
    }],
    aktivitasPengelolaan: [{
        nama: {
            type: String, 
            trim: true
        },
        deskripsi: {
            type: String,
            trim: true
        },
        detail: [{ 
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
    },
}, {
    timestamps: true 
});

const TamanNasional = mongoose.model('TamanNasional', tamanNasionalSchema, 'taman_nasional'); 

export default TamanNasional;