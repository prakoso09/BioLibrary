import mongoose from 'mongoose';

const faunaSchema = new mongoose.Schema({
    namaIlmiah: {
        type: String,
        required: true,
        trim: true
    },
    namaLokal: {
        type: String,
        required: true
    },
    namaUmumLain: { 
        type: String,
        trim: true
    },
    image: {
        type: String,
        required: true
    },
    klasifikasiIlmiah: { 
        kingdom: {
            type: String,
            trim: true,
            default: 'Animalia'
        },
        filum: {
            type: String,
            trim: true
        },
        kelas: {
            type: String,
            trim: true
        },
        ordo: {
            type: String,
            trim: true
        },
        famili: {
            type: String,
            trim: true
        },
        subfamili: { 
            type: String,
            trim: true
        },
        genus: {
            type: String,
            trim: true
        },
        spesies: {
            type: String,
            trim: true
        },
        subspesies: [{
            nama: {
                type: String,
                trim: true
            },
            deskripsi: {
                type: String,
                trim: true
            }
        }]
    },
    habitat: {
        type: String,
        trim: true
    },
    sebaranGeografis: {
        type: String,
        trim: true
    },
    iklim: {
        type: String,
        trim: true
    },
    ukuranTubuh: { 
        panjangTubuh: {
            type: String,
            trim: true
        },
        panjangEkor: {
            type: String,
            trim: true
        },
        tinggiBahu: {
            type: String,
            trim: true
        },
        lebarSayap: {
            type: String,
            trim: true
        },
        beratBadan: {
            type: String,
            trim: true
        }
    },
    polaMakan: {
        type: String,
        trim: true 
    },
    makananUtama: {
        type: String,
        trim: true
    },
    caraBergerak: {
        type: String,
        trim: true
    },
    reproduksi: { 
        kematanganSeksual: {
            type: String,
            trim: true
        },
        masaKehamilan: {
            type: String,
            trim: true
        },
        jumlahAnak: {
            type: String,
            trim: true
        },
        warnaBayi: { 
            type: String,
            trim: true
        },
        perawatanAnak: { 
            type: String,
            trim: true
        },
        tempatBertelur: { 
            type: String,
            trim: true
        },
        fekunditasTinggi: { 
            type: String,
            trim: true
        },
        perkembangan: { 
            type: String,
            trim: true
        }
    },
    usiaRataRata: {
        type: String,
        trim: true
    },
    perilaku: { 
        aktivitas: { 
            type: String,
            trim: true
        },
        sosial: {
            type: String,
            trim: true
        },
        komunikasi: {
            type: String,
            trim: true
        },
        perilakuLain: { 
            type: String,
            trim: true
        },
        pertahanan: { 
            type: String,
            trim: true
        },
        peranEkologis: { 
            type: String,
            trim: true
        }
    },
    statusKepunahan: { 
        statusIUCNGlobal: {
            type: String,
            trim: true
        },
        ancaman: [{
            type: String,
            trim: true
        }],
        upayaKonservasi: [{
            type: String,
            trim: true
        }],
        alasan: { 
            type: String,
            trim: true
        },
        manajemenKonflik: { 
            type: String,
            trim: true
        },
        invasiIntroduksi: { 
            type: String,
            trim: true
        }
    },
    deskripsi: {
        type: String,
        required: true,
        trim: true
    },
    createdBy: {
        type: String,
    },
}, {
    timestamps: true
});

const Fauna = mongoose.model('Fauna', faunaSchema);

export default Fauna;