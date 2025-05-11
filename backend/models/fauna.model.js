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
    namaUmumLain: { // Tambahan untuk nama umum lain
        type: String,
        trim: true
    },
    image: {
        type: String,
        required: true
    },
    klasifikasiIlmiah: { // Objek untuk klasifikasi ilmiah
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
        subfamili: { // Tambahan untuk subfamili
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
        subspesies: [{ // Array untuk subspesies, jika ada
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
    ukuranTubuh: { // Objek untuk ukuran tubuh
        panjangTubuh: {
            type: String,
            trim: true
        },
        panjangEkor: {
            type: String,
            trim: true
        },
        tinggiBahu: { // Tambahan untuk tinggi bahu jika relevan
            type: String,
            trim: true
        },
        lebarSayap: { // Tambahan untuk lebar sayap jika relevan
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
        trim: true // Herbivora, Karnivora, Omnivora, Frugivora, Folivora
    },
    makananUtama: {
        type: String,
        trim: true
    },
    caraBergerak: {
        type: String,
        trim: true
    },
    reproduksi: { // Objek untuk reproduksi
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
        warnaBayi: { // Tambahan untuk warna bayi jika relevan
            type: String,
            trim: true
        },
        perawatanAnak: { // Tambahan untuk perawatan anak jika relevan
            type: String,
            trim: true
        },
        tempatBertelur: { // Tambahan untuk tempat bertelur jika relevan
            type: String,
            trim: true
        },
        fekunditasTinggi: { // Tambahan untuk fekunditas tinggi jika relevan
            type: String,
            trim: true
        },
        perkembangan: { // Tambahan untuk perkembangan jika relevan
            type: String,
            trim: true
        }
    },
    usiaRataRata: {
        type: String,
        trim: true
    },
    perilaku: { // Objek untuk perilaku
        aktivitas: { // Diurnal, Nokturnal, Krepuskular
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
        perilakuLain: { // Tambahan untuk perilaku spesifik
            type: String,
            trim: true
        },
        pertahanan: { // Tambahan untuk pertahanan jika relevan
            type: String,
            trim: true
        },
        peranEkologis: { // Tambahan untuk peran ekologis jika relevan
            type: String,
            trim: true
        }
    },
    statusKepunahan: { // Objek untuk status kepunahan
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
        alasan: { // Tambahan untuk alasan status IUCN
            type: String,
            trim: true
        },
        manajemenKonflik: { // Tambahan untuk manajemen konflik jika relevan
            type: String,
            trim: true
        },
        invasiIntroduksi: { // Tambahan untuk invasi/introduksi jika relevan
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