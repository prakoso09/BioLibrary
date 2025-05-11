import mongoose from 'mongoose';

const floraSchema = new mongoose.Schema({
    namaIlmiah: {
        type: String,
        required: true,
        trim: true,
        unique: true // Nama ilmiah seharusnya unik
    },
    namaIlmiahLengkap: {
        type: String,
        trim: true,
        // Contoh: Casuarina equisetifolia L.
    },
    namaLokal: { // Tetap String tunggal sesuai permintaan
        type: String,
        required: true,
        trim: true
    },
    namaLokalLain: { // Atribut baru untuk nama lokal lain (jika ada)
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
    urlGambarLain: { // Atribut baru untuk menyimpan URL gambar lain
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
    varietas: { // Atribut baru untuk varietas atau sub-spesies
        type: String,
        trim: true
    },
    jenisTumbuhan: { // Contoh: Pohon tahunan, Semak, Herbal, dll.
        type: String,
        trim: true
    },
    tipePertumbuhan: { // Contoh: Tegak, Menjalar, Memanjat, Menggantung
        type: String,
        trim: true
    },
    kategoriFungsional: { // Contoh: Pohon peneduh, pelindung, penghasil kayu, obat
        type: [String],
        trim: true
    },
    // --- Morfologi Vegetatif ---
    tinggiMaksimal: { // Atribut baru, bisa dalam meter
        type: String,
        trim: true
    },
    diameterBatangMaksimal: { // Atribut baru, bisa dalam cm
        type: String,
        trim: true
    },
    deskripsiBatang: { // Atribut baru
        type: String,
        trim: true
    },
    deskripsiKulitBatang: { // Atribut baru
        type: String,
        trim: true
    },
    deskripsiCabang: { // Atribut baru
        type: String,
        trim: true
    },
    bentukTajuk: { // Atribut baru
        type: String,
        trim: true
    },
    jenisDaunSejati: { // Contoh: Sisik kecil, Tidak ada, Jarum, Lebar
        type: String,
        trim: true
    },
    deskripsiDaunSejati: { // Atribut baru
        type: String,
        trim: true
    },
    jenisRantingFotosintetik: { // Contoh: Silindris, pipih, beruas
        type: String,
        trim: true
    },
    deskripsiRantingFotosintetik: { // Atribut baru
        type: String,
        trim: true
    },
    tipeSistemPerakaran: { // Contoh: Tunggang, Serabut, Menyebar luas
        type: String,
        trim: true
    },
    deskripsiSistemPerakaran: { // Atribut baru
        type: String,
        trim: true
    },
    // --- Morfologi Generatif ---
    morfologiBunga: {
        tipeKelamin: { type: String, trim: true }, // Contoh: Monoecious, Dioecious, Hermaprodit
        deskripsiBungaJantan: { type: String, trim: true },
        deskripsiBungaBetina: { type: String, trim: true },
        waktuBerbunga: { type: String, trim: true }, // Atribut baru
        warnaBunga: { type: String, trim: true } // Atribut baru
    },
    morfologiBuah: {
        tipeBuah: { type: String, trim: true }, // Contoh: Kerucut, Buni, Kapsul
        deskripsiBuah: { type: String, trim: true },
        ukuranBuah: { type: String, trim: true }, // Atribut baru
        warnaBuah: { type: String, trim: true }, // Atribut baru
        waktuBerbuah: { type: String, trim: true } // Atribut baru
    },
    morfologiBiji: {
        deskripsiBiji: { type: String, trim: true },
        ukuranBiji: { type: String, trim: true }, // Atribut baru
        warnaBiji: { type: String, trim: true }, // Atribut baru
        bentukBiji: { type: String, trim: true }, // Atribut baru
        mekanismePenyebaranBiji: { type: [String], trim: true } // Atribut baru, e.g., angin, hewan, air
    },
    metodeReproduksi: { // Contoh: Biji, Stek, Cangkok, Tunas Akar
        type: [String],
        trim: true
    },
    // --- Ekologi dan Kondisi Pertumbuhan ---
    musimTumbuhOptimal: { // Contoh: Sepanjang tahun, Musim hujan, Musim kemarau
        type: String,
        trim: true
    },
    habitatAlami: { // Contoh: Zona litoral, Bukit pasir, Hutan mangrove
        type: String,
        trim: true
    },
    kondisiTanahIdeal: { // Contoh: Berpasir, Lempung, Subur, Kurang subur, Salin
        type: String,
        trim: true
    },
    pHTanahOptimal: { // Atribut baru
        type: String,
        trim: true
    },
    drainaseTanahIdeal: { // Atribut baru
        type: String,
        trim: true
    },
    kondisiIklimOptimal: { // Contoh: Tropis, Subtropis, Hangat, Lembab, Curah hujan sedang-tinggi
        type: String,
        trim: true
    },
    toleransiKekeringan: { // Atribut baru
        type: String,
        trim: true
    },
    toleransiSalinitas: { // Atribut baru
        type: String,
        trim: true
    },
    toleransiAngin: { // Atribut baru
        type: String,
        trim: true
    },
    toleransiSuhu: { // Atribut baru
        type: String,
        trim: true
    },
    sebaranGeografis: { // Bisa juga Array of String jika lebih dari satu lokasi spesifik
        type: String,
        trim: true
    },
    ketinggianOptimal: { // Contoh: 0-500 mdpl
        type: String,
        trim: true
    },
    lajuPertumbuhan: { // Contoh: Cepat, Sedang, Lambat
        type: String,
        trim: true
    },
    // --- Kegunaan dan Status ---
    kegunaanUtama: { // Contoh: Konservasi pantai, Kayu bakar, Obat tradisional, Peneduh
        type: [String]
    },
    deskripsiKegunaan: { // Atribut baru untuk detail kegunaan
        type: String,
        trim: true
    },
    komponenBioaktif: { // Atribut baru, jika digunakan sebagai obat/tanaman pangan
        type: [String],
        trim: true
    },
    potensiAncamanInvasif: { // Contoh: Di beberapa daerah invasif karena...
        type: String,
        trim: true
    },
    statusKonservasi: { // Contoh: NE (Not Evaluated), LC (Least Concern), EN (Endangered)
        type: String,
        trim: true
    },
    sumberDataStatusKonservasi: { // Atribut baru
        type: String,
        trim: true
    },
    nilaiEkologis: { // Contoh: Fiksasi nitrogen, Habitat satwa, Stabilisasi tanah
        type: String,
        trim: true
    },
    sifatKimia: { // Contoh: Mengandung tanin, alkaloid, dll.
        type: String,
        trim: true
    },
    kerentananPenyakitHama: { // Contoh: Relatif tahan, Rentan terhadap ...
        type: String,
        trim: true
    },
    // --- Metadata dan Referensi ---
    referensiIlmiah: { // Atribut baru untuk sumber referensi
        type: [String],
        trim: true
    },
    tanggalPenelitian: { // Atribut baru
        type: Date
    },
    peneliti: { // Atribut baru
        type: String,
        trim: true
    },
    lokasiObservasi: { // Atribut baru
        type: String,
        trim: true
    },
    deskripsi: {
        type: String,
        required: true,
        trim: true
    },
    catatanTambahan: { // Atribut baru untuk catatan umum
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