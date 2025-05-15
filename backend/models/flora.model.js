import mongoose from 'mongoose';

const floraSchema = new mongoose.Schema({
    namaIlmiah: {
        type: String,
        required: true,
        trim: true,
        unique: true 
    },
    namaIlmiahLengkap: {
        type: String,
        trim: true,
    },
    namaLokal: { 
        type: String,
        required: true,
        trim: true
    },
    namaLokalLain: { 
        type: [String],
        trim: true
    },
    namaKeluarga: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        required: true
    },
    urlGambarLain: { 
        type: [String],
        trim: true
    },
    kingdom: {
        type: String,
        trim: true,
        default: 'Plantae'
    },
    divisi: {
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
    genus: {
        type: String,
        trim: true
    },
    spesies: {
        type: String,
        trim: true
    },
    varietas: { 
        type: String,
        trim: true
    },
    jenisTumbuhan: { 
        type: String,
        trim: true
    },
    tipePertumbuhan: { 
        type: String,
        trim: true
    },
    kategoriFungsional: { 
        type: [String],
        trim: true
    },
    tinggiMaksimal: { 
        type: String,
        trim: true
    },
    diameterBatangMaksimal: { 
        type: String,
        trim: true
    },
    deskripsiBatang: { 
        type: String,
        trim: true
    },
    deskripsiKulitBatang: { 
        type: String,
        trim: true
    },
    deskripsiCabang: { 
        type: String,
        trim: true
    },
    bentukTajuk: { 
        type: String,
        trim: true
    },
    jenisDaunSejati: { 
        type: String,
        trim: true
    },
    deskripsiDaunSejati: { 
        type: String,
        trim: true
    },
    jenisRantingFotosintetik: { 
        type: String,
        trim: true
    },
    deskripsiRantingFotosintetik: { 
        type: String,
        trim: true
    },
    tipeSistemPerakaran: { 
        type: String,
        trim: true
    },
    deskripsiSistemPerakaran: { 
        type: String,
        trim: true
    },
    morfologiBunga: {
        tipeKelamin: { type: String, trim: true }, 
        deskripsiBungaJantan: { type: String, trim: true },
        deskripsiBungaBetina: { type: String, trim: true },
        waktuBerbunga: { type: String, trim: true }, 
        warnaBunga: { type: String, trim: true } 
    },
    morfologiBuah: {
        tipeBuah: { type: String, trim: true }, 
        deskripsiBuah: { type: String, trim: true },
        ukuranBuah: { type: String, trim: true }, 
        warnaBuah: { type: String, trim: true }, 
        waktuBerbuah: { type: String, trim: true } 
    },
    morfologiBiji: {
        deskripsiBiji: { type: String, trim: true },
        ukuranBiji: { type: String, trim: true }, 
        warnaBiji: { type: String, trim: true }, 
        bentukBiji: { type: String, trim: true }, 
        mekanismePenyebaranBiji: { type: [String], trim: true } 
    },
    metodeReproduksi: { 
        type: [String],
        trim: true
    },
    musimTumbuhOptimal: { 
        type: String,
        trim: true
    },
    habitatAlami: { 
        type: String,
        trim: true
    },
    kondisiTanahIdeal: { 
        type: String,
        trim: true
    },
    pHTanahOptimal: { 
        type: String,
        trim: true
    },
    drainaseTanahIdeal: { 
        type: String,
        trim: true
    },
    kondisiIklimOptimal: { 
        type: String,
        trim: true
    },
    toleransiKekeringan: { 
        type: String,
        trim: true
    },
    toleransiSalinitas: { 
        type: String,
        trim: true
    },
    toleransiAngin: { 
        type: String,
        trim: true
    },
    toleransiSuhu: { 
        type: String,
        trim: true
    },
    sebaranGeografis: { 
        type: String,
        trim: true
    },
    ketinggianOptimal: { 
        type: String,
        trim: true
    },
    lajuPertumbuhan: { 
        type: String,
        trim: true
    },
    kegunaanUtama: { 
        type: [String]
    },
    deskripsiKegunaan: { 
        type: String,
        trim: true
    },
    komponenBioaktif: { 
        type: [String],
        trim: true
    },
    potensiAncamanInvasif: { 
        type: String,
        trim: true
    },
    statusKonservasi: { 
        type: String,
        trim: true
    },
    sumberDataStatusKonservasi: { 
        type: String,
        trim: true
    },
    nilaiEkologis: { 
        type: String,
        trim: true
    },
    sifatKimia: { 
        type: String,
        trim: true
    },
    kerentananPenyakitHama: { 
        type: String,
        trim: true
    },
    referensiIlmiah: { 
        type: [String],
        trim: true
    },
    tanggalPenelitian: { 
        type: Date
    },
    peneliti: { 
        type: String,
        trim: true
    },
    lokasiObservasi: { 
        type: String,
        trim: true
    },
    deskripsi: {
        type: String,
        required: true,
        trim: true
    },
    catatanTambahan: { 
        type: String,
        trim: true
    },
    createdBy: {
        type: String,
    },
}, {
    timestamps: true
});

const Flora = mongoose.model('Flora', floraSchema);

export default Flora;