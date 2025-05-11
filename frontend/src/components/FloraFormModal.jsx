import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Image,
  Box,
  Text,
  useToast,
  Spinner,
  HStack, // Ditambahkan untuk tata letak horizontal
} from '@chakra-ui/react';
import axios from 'axios';

const FloraFormModal = ({ isOpen, onClose, flora, onSubmit, isEdit }) => {
  const [formData, setFormData] = useState({
    namaIlmiah: '',
    namaIlmiahLengkap: '', // Baru
    namaLokal: '',
    namaLokalLain: [], // Baru, array of strings
    namaKeluarga: '',
    image: null, // Will hold File object or URL string
    urlGambarLain: [], // Baru, array of strings
    kingdom: 'Plantae',
    divisi: '',
    kelas: '',
    ordo: '',
    famili: '',
    genus: '',
    spesies: '', // Baru
    varietas: '', // Baru
    jenisTumbuhan: '',
    tipePertumbuhan: '', // Baru
    kategoriFungsional: [], // Baru, array of strings
    
    // Morfologi Vegetatif
    tinggiMaksimal: '', // Baru
    diameterBatangMaksimal: '', // Baru
    deskripsiBatang: '', // Baru
    deskripsiKulitBatang: '', // Baru
    deskripsiCabang: '', // Baru
    bentukTajuk: '', // Baru
    jenisDaunSejati: '', // Nama field disesuaikan
    deskripsiDaunSejati: '', // Baru
    jenisRantingFotosintetik: '', // Baru
    deskripsiRantingFotosintetik: '', // Baru
    tipeSistemPerakaran: '', // Baru
    deskripsiSistemPerakaran: '', // Baru

    // Morfologi Generatif (nested objects)
    morfologiBunga: {
      tipeKelamin: '',
      deskripsiBungaJantan: '',
      deskripsiBungaBetina: '',
      waktuBerbunga: '', // Baru
      warnaBunga: '', // Baru
    },
    morfologiBuah: {
      tipeBuah: '',
      deskripsiBuah: '',
      ukuranBuah: '', // Baru
      warnaBuah: '', // Baru
      waktuBerbuah: '', // Baru
    },
    morfologiBiji: {
      deskripsiBiji: '',
      ukuranBiji: '', // Baru
      warnaBiji: '', // Baru
      bentukBiji: '', // Baru
      mekanismePenyebaranBiji: [], // Baru, array of strings
    },
    metodeReproduksi: [], // Baru, array of strings

    // Ekologi dan Kondisi Pertumbuhan
    musimTumbuhOptimal: '', // Nama field disesuaikan
    habitatAlami: '', // Nama field disesuaikan
    kondisiTanahIdeal: '', // Baru
    pHTanahOptimal: '', // Baru
    drainaseTanahIdeal: '', // Baru
    kondisiIklimOptimal: '', // Baru
    toleransiKekeringan: '', // Baru
    toleransiSalinitas: '', // Baru
    toleransiAngin: '', // Baru
    toleransiSuhu: '', // Baru
    sebaranGeografis: '',
    ketinggianOptimal: '', // Baru
    lajuPertumbuhan: '', // Baru

    // Kegunaan dan Status Konservasi
    kegunaanUtama: [], // Nama field disesuaikan
    deskripsiKegunaan: '', // Baru
    komponenBioaktif: [], // Baru, array of strings
    potensiAncamanInvasif: '', // Baru
    statusKonservasi: '',
    sumberDataStatusKonservasi: '', // Baru
    nilaiEkologis: '', // Baru
    sifatKimia: '', // Baru
    kerentananPenyakitHama: '', // Baru

    // Metadata dan Referensi
    referensiIlmiah: [], // Baru, array of strings
    tanggalPenelitian: null, // Baru, Date type
    peneliti: '', // Baru
    lokasiObservasi: '', // Baru
    deskripsi: '',
    catatanTambahan: '', // Baru
    createdBy: '',
  });

  const fileInputRef = useRef(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const toast = useToast();

  const initialFloraState = useRef(null);

  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  useEffect(() => {
    if (flora) {
      initialFloraState.current = flora;
    }
  }, [flora]);

  useEffect(() => {
    if (isEdit && flora) {
      setFormData({
        ...flora,
        // Penanganan array ke string untuk Textarea (pisahkan dengan newline)
        namaLokalLain: Array.isArray(flora.namaLokalLain) ? flora.namaLokalLain.join('\n') : '',
        urlGambarLain: Array.isArray(flora.urlGambarLain) ? flora.urlGambarLain.join('\n') : '',
        kategoriFungsional: Array.isArray(flora.kategoriFungsional) ? flora.kategoriFungsional.join('\n') : '',
        kegunaanUtama: Array.isArray(flora.kegunaanUtama) ? flora.kegunaanUtama.join('\n') : '',
        komponenBioaktif: Array.isArray(flora.komponenBioaktif) ? flora.komponenBioaktif.join('\n') : '',
        mekanismePenyebaranBiji: Array.isArray(flora.morfologiBiji?.mekanismePenyebaranBiji) ? flora.morfologiBiji.mekanismePenyebaranBiji.join('\n') : '',
        metodeReproduksi: Array.isArray(flora.metodeReproduksi) ? flora.metodeReproduksi.join('\n') : '',
        referensiIlmiah: Array.isArray(flora.referensiIlmiah) ? flora.referensiIlmiah.join('\n') : '',
        
        // Pastikan objek bersarang ada sebelum mengakses propertinya
        morfologiBunga: {
            tipeKelamin: flora.morfologiBunga?.tipeKelamin || '',
            deskripsiBungaJantan: flora.morfologiBunga?.deskripsiBungaJantan || '',
            deskripsiBungaBetina: flora.morfologiBunga?.deskripsiBungaBetina || '',
            waktuBerbunga: flora.morfologiBunga?.waktuBerbunga || '',
            warnaBunga: flora.morfologiBunga?.warnaBunga || '',
        },
        morfologiBuah: {
            tipeBuah: flora.morfologiBuah?.tipeBuah || '',
            deskripsiBuah: flora.morfologiBuah?.deskripsiBuah || '',
            ukuranBuah: flora.morfologiBuah?.ukuranBuah || '',
            warnaBuah: flora.morfologiBuah?.warnaBuah || '',
            waktuBerbuah: flora.morfologiBuah?.waktuBerbuah || '',
        },
        morfologiBiji: {
            deskripsiBiji: flora.morfologiBiji?.deskripsiBiji || '',
            ukuranBiji: flora.morfologiBiji?.ukuranBiji || '',
            warnaBiji: flora.morfologiBiji?.warnaBiji || '',
            bentukBiji: flora.morfologiBiji?.bentukBiji || '',
            mekanismePenyebaranBiji: Array.isArray(flora.morfologiBiji?.mekanismePenyebaranBiji) ? flora.morfologiBiji.mekanismePenyebaranBiji.join('\n') : '',
        },
        tanggalPenelitian: flora.tanggalPenelitian ? new Date(flora.tanggalPenelitian).toISOString().split('T')[0] : '', // Format tanggal untuk input type="date"
      });

      if (flora.image && typeof flora.image === 'string') {
        setImagePreviewUrl(flora.image);
      } else {
        setImagePreviewUrl(null);
      }
    } else {
      // Reset form data and preview for 'Add' mode or when modal closes
      setFormData({
        namaIlmiah: '',
        namaIlmiahLengkap: '',
        namaLokal: '',
        namaLokalLain: [],
        namaKeluarga: '',
        image: null,
        urlGambarLain: [],
        kingdom: 'Plantae',
        divisi: '',
        kelas: '',
        ordo: '',
        famili: '',
        genus: '',
        spesies: '',
        varietas: '',
        jenisTumbuhan: '',
        tipePertumbuhan: '',
        kategoriFungsional: [],
        
        // Morfologi Vegetatif
        tinggiMaksimal: '',
        diameterBatangMaksimal: '',
        deskripsiBatang: '',
        deskripsiKulitBatang: '',
        deskripsiCabang: '',
        bentukTajuk: '',
        jenisDaunSejati: '',
        deskripsiDaunSejati: '',
        jenisRantingFotosintetik: '',
        deskripsiRantingFotosintetik: '',
        tipeSistemPerakaran: '',
        deskripsiSistemPerakaran: '',

        // Morfologi Generatif (nested objects)
        morfologiBunga: {
            tipeKelamin: '',
            deskripsiBungaJantan: '',
            deskripsiBungaBetina: '',
            waktuBerbunga: '',
            warnaBunga: '',
        },
        morfologiBuah: {
            tipeBuah: '',
            deskripsiBuah: '',
            ukuranBuah: '',
            warnaBuah: '',
            waktuBerbuah: '',
        },
        morfologiBiji: {
            deskripsiBiji: '',
            ukuranBiji: '',
            warnaBiji: '',
            bentukBiji: '',
            mekanismePenyebaranBiji: [],
        },
        metodeReproduksi: [],

        // Ekologi dan Kondisi Pertumbuhan
        musimTumbuhOptimal: '',
        habitatAlami: '',
        kondisiTanahIdeal: '',
        pHTanahOptimal: '',
        drainaseTanahIdeal: '',
        kondisiIklimOptimal: '',
        toleransiKekeringan: '',
        toleransiSalinitas: '',
        toleransiAngin: '',
        toleransiSuhu: '',
        sebaranGeografis: '',
        ketinggianOptimal: '',
        lajuPertumbuhan: '',

        // Kegunaan dan Status Konservasi
        kegunaanUtama: [],
        deskripsiKegunaan: '',
        komponenBioaktif: [],
        potensiAncamanInvasif: '',
        statusKonservasi: '',
        sumberDataStatusKonservasi: '',
        nilaiEkologis: '',
        sifatKimia: '',
        kerentananPenyakitHama: '',

        // Metadata dan Referensi
        referensiIlmiah: [],
        tanggalPenelitian: null,
        peneliti: '',
        lokasiObservasi: '',
        deskripsi: '',
        catatanTambahan: '',
        createdBy: '',
      });
      setImagePreviewUrl(null);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the selected file from input
    }

    return () => {
      if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [isEdit, flora]);


  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    // Handle nested objects for morphology
    if (name.startsWith('morfologiBunga.') || name.startsWith('morfologiBuah.') || name.startsWith('morfologiBiji.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else if (type === 'file' && files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        [name]: file, // Ini akan menyimpan objek File
      }));
      if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    setIsUploadingImage(true);

    let finalImageUrl = formData.image;

    if (formData.image instanceof File) {
      try {
        const cloudinaryFormData = new FormData();
        cloudinaryFormData.append('file', formData.image);
        cloudinaryFormData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        const cloudinaryAxios = axios.create();
        delete cloudinaryAxios.defaults.headers.common['Authorization'];

        const cloudinaryResponse = await cloudinaryAxios.post(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          cloudinaryFormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        finalImageUrl = cloudinaryResponse.data.secure_url;
        toast({
          title: "Upload Berhasil",
          description: "Gambar berhasil diunggah ke Cloudinary.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } catch (uploadError) {
        setIsUploadingImage(false);
        console.error('Error uploading image to Cloudinary:', uploadError.response?.data || uploadError.message);
        toast({
          title: "Upload Gagal",
          description: uploadError.response?.data?.error?.message || "Gagal mengunggah gambar ke Cloudinary.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
    } else if (formData.image === null || formData.image === '') {
      finalImageUrl = null;
    }
    
    setIsUploadingImage(false);

    // Map string textarea values back to arrays
    const dataToSubmit = {
      ...formData,
      image: finalImageUrl,
      namaLokalLain: formData.namaLokalLain.split('\n').map(line => line.trim()).filter(Boolean),
      urlGambarLain: formData.urlGambarLain.split('\n').map(line => line.trim()).filter(Boolean),
      kategoriFungsional: formData.kategoriFungsional.split('\n').map(line => line.trim()).filter(Boolean),
      kegunaanUtama: formData.kegunaanUtama.split('\n').map(line => line.trim()).filter(Boolean),
      komponenBioaktif: formData.komponenBioaktif.split('\n').map(line => line.trim()).filter(Boolean),
      metodeReproduksi: formData.metodeReproduksi.split('\n').map(line => line.trim()).filter(Boolean),
      referensiIlmiah: formData.referensiIlmiah.split('\n').map(line => line.trim()).filter(Boolean),
      morfologiBiji: {
        ...formData.morfologiBiji,
        mekanismePenyebaranBiji: formData.morfologiBiji.mekanismePenyebaranBiji.split('\n').map(line => line.trim()).filter(Boolean),
      },
      // Pastikan tanggal dikonversi jika perlu
      tanggalPenelitian: formData.tanggalPenelitian ? new Date(formData.tanggalPenelitian) : null,
    };

    // Clean up empty string values from nested objects if they are not required
    if (dataToSubmit.morfologiBunga.deskripsiBungaJantan === '') dataToSubmit.morfologiBunga.deskripsiBungaJantan = undefined;
    if (dataToSubmit.morfologiBunga.deskripsiBungaBetina === '') dataToSubmit.morfologiBunga.deskripsiBungaBetina = undefined;
    // Lakukan ini untuk semua field opsional di nested object

    console.log('Final data to submit from Modal (including image URL):', dataToSubmit);
    onSubmit(dataToSubmit);
    onClose();
  };

  const handleChooseImage = () => {
    fileInputRef.current?.click();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEdit ? 'Edit Flora' : 'Tambah Flora Baru'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* Identifikasi Taksonomi & Nama */}
            <Text fontSize="lg" fontWeight="bold" mt={4}>Identifikasi Taksonomi & Nama</Text>
            <FormControl id="namaIlmiah" isRequired>
              <FormLabel>Nama Ilmiah</FormLabel>
              <Input
                name="namaIlmiah"
                value={formData.namaIlmiah}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="namaIlmiahLengkap">
              <FormLabel>Nama Ilmiah Lengkap</FormLabel>
              <Input
                name="namaIlmiahLengkap"
                value={formData.namaIlmiahLengkap}
                onChange={handleChange}
                placeholder="Contoh: Casuarina equisetifolia L."
              />
            </FormControl>
            <FormControl id="namaLokal" isRequired>
              <FormLabel>Nama Lokal</FormLabel>
              <Input
                name="namaLokal"
                value={formData.namaLokal}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="namaLokalLain">
              <FormLabel>Nama Lokal Lain (Pisahkan dengan baris baru)</FormLabel>
              <Textarea
                name="namaLokalLain"
                value={Array.isArray(formData.namaLokalLain) ? formData.namaLokalLain.join('\n') : formData.namaLokalLain}
                onChange={handleChange}
                placeholder="Contoh: Cemara Laut (Indonesia)\nRu (Malaysia)"
              />
            </FormControl>
            <FormControl id="namaKeluarga">
              <FormLabel>Nama Keluarga</FormLabel>
              <Input
                name="namaKeluarga"
                value={formData.namaKeluarga}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="divisi">
              <FormLabel>Divisi</FormLabel>
              <Input
                name="divisi"
                value={formData.divisi}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="kelas">
              <FormLabel>Kelas</FormLabel>
              <Input
                name="kelas"
                value={formData.kelas}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="ordo">
              <FormLabel>Ordo</FormLabel>
              <Input
                name="ordo"
                value={formData.ordo}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="famili">
              <FormLabel>Famili</FormLabel>
              <Input
                name="famili"
                value={formData.famili}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="genus">
              <FormLabel>Genus</FormLabel>
              <Input
                name="genus"
                value={formData.genus}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="spesies">
              <FormLabel>Spesies</FormLabel>
              <Input
                name="spesies"
                value={formData.spesies}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="varietas">
              <FormLabel>Varietas/Sub-spesies</FormLabel>
              <Input
                name="varietas"
                value={formData.varietas}
                onChange={handleChange}
              />
            </FormControl>

            {/* Visual & Tipe Tumbuhan */}
            <Text fontSize="lg" fontWeight="bold" mt={4}>Visual & Tipe Tumbuhan</Text>
            <FormControl id="image">
              <FormLabel>Gambar Utama</FormLabel>
              <Box>
                {imagePreviewUrl && (
                  <Image
                    src={imagePreviewUrl}
                    alt="Flora Image Preview"
                    maxH="200px"
                    objectFit="contain"
                    mb={2}
                  />
                )}
                {formData.image && typeof formData.image !== 'string' && (
                  <Text fontSize="sm" color="gray.500" mb={2}>File Terpilih: {formData.image.name}</Text>
                )}
                {!imagePreviewUrl && !formData.image && (
                    <Text fontSize="sm" color="gray.500" mb={2}>Belum ada gambar dipilih</Text>
                )}
                <Button onClick={handleChooseImage} size="sm" colorScheme="blue" isLoading={isUploadingImage}>
                  {isUploadingImage ? <Spinner size="sm" mr={2} /> : null}
                  Pilih Gambar
                </Button>
                <Input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  accept="image/*"
                />
              </Box>
            </FormControl>
            <FormControl id="urlGambarLain">
              <FormLabel>URL Gambar Lain (Pisahkan dengan baris baru)</FormLabel>
              <Textarea
                name="urlGambarLain"
                value={Array.isArray(formData.urlGambarLain) ? formData.urlGambarLain.join('\n') : formData.urlGambarLain}
                onChange={handleChange}
                placeholder="https://example.com/img1.jpg\nhttps://example.com/img2.png"
              />
            </FormControl>
            <FormControl id="jenisTumbuhan">
              <FormLabel>Jenis Tumbuhan</FormLabel>
              <Input
                name="jenisTumbuhan"
                value={formData.jenisTumbuhan}
                onChange={handleChange}
                placeholder="Contoh: Pohon tahunan, Semak, Herbal"
              />
            </FormControl>
            <FormControl id="tipePertumbuhan">
              <FormLabel>Tipe Pertumbuhan</FormLabel>
              <Input
                name="tipePertumbuhan"
                value={formData.tipePertumbuhan}
                onChange={handleChange}
                placeholder="Contoh: Tegak, Menjalar, Memanjat"
              />
            </FormControl>
            <FormControl id="kategoriFungsional">
              <FormLabel>Kategori Fungsional (Pisahkan dengan baris baru)</FormLabel>
              <Textarea
                name="kategoriFungsional"
                value={Array.isArray(formData.kategoriFungsional) ? formData.kategoriFungsional.join('\n') : formData.kategoriFungsional}
                onChange={handleChange}
                placeholder="Contoh: Pohon peneduh\nPohon penghasil kayu\nTanaman obat"
              />
            </FormControl>

            {/* Morfologi Vegetatif */}
            <Text fontSize="lg" fontWeight="bold" mt={4}>Morfologi Vegetatif</Text>
            <FormControl id="tinggiMaksimal">
              <FormLabel>Tinggi Maksimal</FormLabel>
              <Input
                name="tinggiMaksimal"
                value={formData.tinggiMaksimal}
                onChange={handleChange}
                placeholder="Contoh: 20-25 meter"
              />
            </FormControl>
            <FormControl id="diameterBatangMaksimal">
              <FormLabel>Diameter Batang Maksimal</FormLabel>
              <Input
                name="diameterBatangMaksimal"
                value={formData.diameterBatangMaksimal}
                onChange={handleChange}
                placeholder="Contoh: 1-2 meter"
              />
            </FormControl>
            <FormControl id="deskripsiBatang">
              <FormLabel>Deskripsi Batang</FormLabel>
              <Textarea
                name="deskripsiBatang"
                value={formData.deskripsiBatang}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="deskripsiKulitBatang">
              <FormLabel>Deskripsi Kulit Batang</FormLabel>
              <Textarea
                name="deskripsiKulitBatang"
                value={formData.deskripsiKulitBatang}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="deskripsiCabang">
              <FormLabel>Deskripsi Cabang</FormLabel>
              <Textarea
                name="deskripsiCabang"
                value={formData.deskripsiCabang}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="bentukTajuk">
              <FormLabel>Bentuk Tajuk</FormLabel>
              <Input
                name="bentukTajuk"
                value={formData.bentukTajuk}
                onChange={handleChange}
                placeholder="Contoh: Payung, Kubah, Kerucut"
              />
            </FormControl>
            <FormControl id="jenisDaunSejati">
              <FormLabel>Jenis Daun Sejati</FormLabel>
              <Input
                name="jenisDaunSejati"
                value={formData.jenisDaunSejati}
                onChange={handleChange}
                placeholder="Contoh: Majemuk bipinnatus, Tunggal, Jarum"
              />
            </FormControl>
            <FormControl id="deskripsiDaunSejati">
              <FormLabel>Deskripsi Daun Sejati</FormLabel>
              <Textarea
                name="deskripsiDaunSejati"
                value={formData.deskripsiDaunSejati}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="jenisRantingFotosintetik">
              <FormLabel>Jenis Ranting Fotosintetik</FormLabel>
              <Input
                name="jenisRantingFotosintetik"
                value={formData.jenisRantingFotosintetik}
                onChange={handleChange}
                placeholder="Contoh: Silindris, Pipih"
              />
            </FormControl>
            <FormControl id="deskripsiRantingFotosintetik">
              <FormLabel>Deskripsi Ranting Fotosintetik</FormLabel>
              <Textarea
                name="deskripsiRantingFotosintetik"
                value={formData.deskripsiRantingFotosintetik}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="tipeSistemPerakaran">
              <FormLabel>Tipe Sistem Perakaran</FormLabel>
              <Input
                name="tipeSistemPerakaran"
                value={formData.tipeSistemPerakaran}
                onChange={handleChange}
                placeholder="Contoh: Tunggang, Serabut, Menyebar luas"
              />
            </FormControl>
            <FormControl id="deskripsiSistemPerakaran">
              <FormLabel>Deskripsi Sistem Perakaran</FormLabel>
              <Textarea
                name="deskripsiSistemPerakaran"
                value={formData.deskripsiSistemPerakaran}
                onChange={handleChange}
              />
            </FormControl>

            {/* Morfologi Generatif */}
            <Text fontSize="lg" fontWeight="bold" mt={4}>Morfologi Generatif</Text>
            <Box p={4} borderWidth="1px" borderRadius="md">
              <Text fontSize="md" fontWeight="semibold">Morfologi Bunga</Text>
              <FormControl id="morfologiBunga.tipeKelamin" mt={2}>
                <FormLabel>Tipe Kelamin Bunga</FormLabel>
                <Input
                  name="morfologiBunga.tipeKelamin"
                  value={formData.morfologiBunga.tipeKelamin}
                  onChange={handleChange}
                  placeholder="Contoh: Hermafrodit, Monoecious, Dioecious"
                />
              </FormControl>
              <FormControl id="morfologiBunga.deskripsiBungaJantan" mt={2}>
                <FormLabel>Deskripsi Bunga Jantan</FormLabel>
                <Textarea
                  name="morfologiBunga.deskripsiBungaJantan"
                  value={formData.morfologiBunga.deskripsiBungaJantan}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="morfologiBunga.deskripsiBungaBetina" mt={2}>
                <FormLabel>Deskripsi Bunga Betina</FormLabel>
                <Textarea
                  name="morfologiBunga.deskripsiBungaBetina"
                  value={formData.morfologiBunga.deskripsiBungaBetina}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="morfologiBunga.waktuBerbunga" mt={2}>
                <FormLabel>Waktu Berbunga</FormLabel>
                <Input
                  name="morfologiBunga.waktuBerbunga"
                  value={formData.morfologiBunga.waktuBerbunga}
                  onChange={handleChange}
                  placeholder="Contoh: Musim kering, Sepanjang tahun"
                />
              </FormControl>
              <FormControl id="morfologiBunga.warnaBunga" mt={2}>
                <FormLabel>Warna Bunga</FormLabel>
                <Input
                  name="morfologiBunga.warnaBunga"
                  value={formData.morfologiBunga.warnaBunga}
                  onChange={handleChange}
                  placeholder="Contoh: Merah muda, Kuning"
                />
              </FormControl>
            </Box>

            <Box p={4} borderWidth="1px" borderRadius="md">
              <Text fontSize="md" fontWeight="semibold">Morfologi Buah</Text>
              <FormControl id="morfologiBuah.tipeBuah" mt={2}>
                <FormLabel>Tipe Buah</FormLabel>
                <Input
                  name="morfologiBuah.tipeBuah"
                  value={formData.morfologiBuah.tipeBuah}
                  onChange={handleChange}
                  placeholder="Contoh: Polong, Kerucut, Kapsul"
                />
              </FormControl>
              <FormControl id="morfologiBuah.deskripsiBuah" mt={2}>
                <FormLabel>Deskripsi Buah</FormLabel>
                <Textarea
                  name="morfologiBuah.deskripsiBuah"
                  value={formData.morfologiBuah.deskripsiBuah}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="morfologiBuah.ukuranBuah" mt={2}>
                <FormLabel>Ukuran Buah</FormLabel>
                <Input
                  name="morfologiBuah.ukuranBuah"
                  value={formData.morfologiBuah.ukuranBuah}
                  onChange={handleChange}
                  placeholder="Contoh: 10-20 cm"
                />
              </FormControl>
              <FormControl id="morfologiBuah.warnaBuah" mt={2}>
                <FormLabel>Warna Buah</FormLabel>
                <Input
                  name="morfologiBuah.warnaBuah"
                  value={formData.morfologiBuah.warnaBuah}
                  onChange={handleChange}
                  placeholder="Contoh: Coklat kehitaman, Hijau"
                />
              </FormControl>
              <FormControl id="morfologiBuah.waktuBerbuah" mt={2}>
                <FormLabel>Waktu Berbuah</FormLabel>
                <Input
                  name="morfologiBuah.waktuBerbuah"
                  value={formData.morfologiBuah.waktuBerbuah}
                  onChange={handleChange}
                  placeholder="Contoh: Setelah berbunga"
                />
              </FormControl>
            </Box>

            <Box p={4} borderWidth="1px" borderRadius="md">
              <Text fontSize="md" fontWeight="semibold">Morfologi Biji</Text>
              <FormControl id="morfologiBiji.deskripsiBiji" mt={2}>
                <FormLabel>Deskripsi Biji</FormLabel>
                <Textarea
                  name="morfologiBiji.deskripsiBiji"
                  value={formData.morfologiBiji.deskripsiBiji}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="morfologiBiji.ukuranBiji" mt={2}>
                <FormLabel>Ukuran Biji</FormLabel>
                <Input
                  name="morfologiBiji.ukuranBiji"
                  value={formData.morfologiBiji.ukuranBiji}
                  onChange={handleChange}
                  placeholder="Contoh: 7-10 mm"
                />
              </FormControl>
              <FormControl id="morfologiBiji.warnaBiji" mt={2}>
                <FormLabel>Warna Biji</FormLabel>
                <Input
                  name="morfologiBiji.warnaBiji"
                  value={formData.morfologiBiji.warnaBiji}
                  onChange={handleChange}
                  placeholder="Contoh: Coklat gelap"
                />
              </FormControl>
              <FormControl id="morfologiBiji.bentukBiji" mt={2}>
                <FormLabel>Bentuk Biji</FormLabel>
                <Input
                  name="morfologiBiji.bentukBiji"
                  value={formData.morfologiBiji.bentukBiji}
                  onChange={handleChange}
                  placeholder="Contoh: Pipih, Elips"
                />
              </FormControl>
              <FormControl id="morfologiBiji.mekanismePenyebaranBiji" mt={2}>
                <FormLabel>Mekanisme Penyebaran Biji (Pisahkan dengan baris baru)</FormLabel>
                <Textarea
                  name="morfologiBiji.mekanismePenyebaranBiji"
                  value={Array.isArray(formData.morfologiBiji.mekanismePenyebaranBiji) ? formData.morfologiBiji.mekanismePenyebaranBiji.join('\n') : formData.morfologiBiji.mekanismePenyebaranBiji}
                  onChange={handleChange}
                  placeholder="Contoh: Zoochory\nAnemochory"
                />
              </FormControl>
            </Box>

            <FormControl id="metodeReproduksi">
              <FormLabel>Metode Reproduksi (Pisahkan dengan baris baru)</FormLabel>
              <Textarea
                name="metodeReproduksi"
                value={Array.isArray(formData.metodeReproduksi) ? formData.metodeReproduksi.join('\n') : formData.metodeReproduksi}
                onChange={handleChange}
                placeholder="Contoh: Biji\nStek"
              />
            </FormControl>

            {/* Ekologi dan Kondisi Pertumbuhan */}
            <Text fontSize="lg" fontWeight="bold" mt={4}>Ekologi dan Kondisi Pertumbuhan</Text>
            <FormControl id="musimTumbuhOptimal">
              <FormLabel>Musim Tumbuh Optimal</FormLabel>
              <Input
                name="musimTumbuhOptimal"
                value={formData.musimTumbuhOptimal}
                onChange={handleChange}
                placeholder="Contoh: Sepanjang tahun, Musim hujan"
              />
            </FormControl>
            <FormControl id="habitatAlami">
              <FormLabel>Habitat Alami</FormLabel>
              <Input
                name="habitatAlami"
                value={formData.habitatAlami}
                onChange={handleChange}
                placeholder="Contoh: Dataran rendah tropis, Hutan bakau"
              />
            </FormControl>
            <FormControl id="kondisiTanahIdeal">
              <FormLabel>Kondisi Tanah Ideal</FormLabel>
              <Input
                name="kondisiTanahIdeal"
                value={formData.kondisiTanahIdeal}
                onChange={handleChange}
                placeholder="Contoh: Berpasir, Lempung, Subur"
              />
            </FormControl>
            <FormControl id="pHTanahOptimal">
              <FormLabel>pH Tanah Optimal</FormLabel>
              <Input
                name="pHTanahOptimal"
                value={formData.pHTanahOptimal}
                onChange={handleChange}
                placeholder="Contoh: 5.0 - 7.0"
              />
            </FormControl>
            <FormControl id="drainaseTanahIdeal">
              <FormLabel>Drainase Tanah Ideal</FormLabel>
              <Input
                name="drainaseTanahIdeal"
                value={formData.drainaseTanahIdeal}
                onChange={handleChange}
                placeholder="Contoh: Baik"
              />
            </FormControl>
            <FormControl id="kondisiIklimOptimal">
              <FormLabel>Kondisi Iklim Optimal</FormLabel>
              <Input
                name="kondisiIklimOptimal"
                value={formData.kondisiIklimOptimal}
                onChange={handleChange}
                placeholder="Contoh: Tropis, Hangat, Lembab"
              />
            </FormControl>
            <FormControl id="toleransiKekeringan">
              <FormLabel>Toleransi Kekeringan</FormLabel>
              <Input
                name="toleransiKekeringan"
                value={formData.toleransiKekeringan}
                onChange={handleChange}
                placeholder="Contoh: Tinggi, Sedang, Rendah"
              />
            </FormControl>
            <FormControl id="toleransiSalinitas">
              <FormLabel>Toleransi Salinitas</FormLabel>
              <Input
                name="toleransiSalinitas"
                value={formData.toleransiSalinitas}
                onChange={handleChange}
                placeholder="Contoh: Tinggi, Sedang, Rendah"
              />
            </FormControl>
            <FormControl id="toleransiAngin">
              <FormLabel>Toleransi Angin</FormLabel>
              <Input
                name="toleransiAngin"
                value={formData.toleransiAngin}
                onChange={handleChange}
                placeholder="Contoh: Tinggi, Sedang, Rendah"
              />
            </FormControl>
            <FormControl id="toleransiSuhu">
              <FormLabel>Toleransi Suhu</FormLabel>
              <Input
                name="toleransiSuhu"
                value={formData.toleransiSuhu}
                onChange={handleChange}
                placeholder="Contoh: 20-35°C"
              />
            </FormControl>
            <FormControl id="sebaranGeografis">
              <FormLabel>Sebaran Geografis</FormLabel>
              <Textarea
                name="sebaranGeografis"
                value={formData.sebaranGeografis}
                onChange={handleChange}
                placeholder="Contoh: Amerika Tengah dan Selatan, Asia Tenggara"
              />
            </FormControl>
            <FormControl id="ketinggianOptimal">
              <FormLabel>Ketinggian Optimal</FormLabel>
              <Input
                name="ketinggianOptimal"
                value={formData.ketinggianOptimal}
                onChange={handleChange}
                placeholder="Contoh: 0-1000 mdpl"
              />
            </FormControl>
            <FormControl id="lajuPertumbuhan">
              <FormLabel>Laju Pertumbuhan</FormLabel>
              <Input
                name="lajuPertumbuhan"
                value={formData.lajuPertumbuhan}
                onChange={handleChange}
                placeholder="Contoh: Cepat, Sedang, Lambat"
              />
            </FormControl>

            {/* Kegunaan dan Status Konservasi */}
            <Text fontSize="lg" fontWeight="bold" mt={4}>Kegunaan dan Status Konservasi</Text>
            <FormControl id="kegunaanUtama">
              <FormLabel>Kegunaan Utama (Pisahkan dengan baris baru)</FormLabel>
              <Textarea
                name="kegunaanUtama"
                value={Array.isArray(formData.kegunaanUtama) ? formData.kegunaanUtama.join('\n') : formData.kegunaanUtama}
                onChange={handleChange}
                placeholder="Contoh: Peneduh\nKayu\nPakan ternak"
              />
            </FormControl>
            <FormControl id="deskripsiKegunaan">
              <FormLabel>Deskripsi Kegunaan</FormLabel>
              <Textarea
                name="deskripsiKegunaan"
                value={formData.deskripsiKegunaan}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="komponenBioaktif">
              <FormLabel>Komponen Bioaktif (Pisahkan dengan baris baru)</FormLabel>
              <Textarea
                name="komponenBioaktif"
                value={Array.isArray(formData.komponenBioaktif) ? formData.komponenBioaktif.join('\n') : formData.komponenBioaktif}
                onChange={handleChange}
                placeholder="Contoh: Saponin\nTanin"
              />
            </FormControl>
            <FormControl id="potensiAncamanInvasif">
              <FormLabel>Potensi Ancaman Invasif</FormLabel>
              <Textarea
                name="potensiAncamanInvasif"
                value={formData.potensiAncamanInvasif}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="statusKonservasi">
              <FormLabel>Status Konservasi</FormLabel>
              <Input
                name="statusKonservasi"
                value={formData.statusKonservasi}
                onChange={handleChange}
                placeholder="Contoh: NE, LC, EN"
              />
            </FormControl>
            <FormControl id="sumberDataStatusKonservasi">
              <FormLabel>Sumber Data Status Konservasi</FormLabel>
              <Input
                name="sumberDataStatusKonservasi"
                value={formData.sumberDataStatusKonservasi}
                onChange={handleChange}
                placeholder="Contoh: IUCN Red List"
              />
            </FormControl>
            <FormControl id="nilaiEkologis">
              <FormLabel>Nilai Ekologis</FormLabel>
              <Textarea
                name="nilaiEkologis"
                value={formData.nilaiEkologis}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="sifatKimia">
              <FormLabel>Sifat Kimia</FormLabel>
              <Textarea
                name="sifatKimia"
                value={formData.sifatKimia}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="kerentananPenyakitHama">
              <FormLabel>Kerentanan Penyakit Hama</FormLabel>
              <Textarea
                name="kerentananPenyakitHama"
                value={formData.kerentananPenyakitHama}
                onChange={handleChange}
              />
            </FormControl>
            
            {/* Deskripsi (tetap ada, tapi posisinya bisa disesuaikan) */}
            <FormControl id="deskripsi" isRequired>
              <FormLabel>Deskripsi Umum</FormLabel>
              <Textarea
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
              />
            </FormControl>

            {/* Metadata dan Referensi */}
            <Text fontSize="lg" fontWeight="bold" mt={4}>Metadata dan Referensi</Text>
            <FormControl id="referensiIlmiah">
              <FormLabel>Referensi Ilmiah (Pisahkan dengan baris baru)</FormLabel>
              <Textarea
                name="referensiIlmiah"
                value={Array.isArray(formData.referensiIlmiah) ? formData.referensiIlmiah.join('\n') : formData.referensiIlmiah}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="tanggalPenelitian">
              <FormLabel>Tanggal Penelitian</FormLabel>
              <Input
                type="date"
                name="tanggalPenelitian"
                value={formData.tanggalPenelitian || ''} // Pastikan formatnya 'YYYY-MM-DD'
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="peneliti">
              <FormLabel>Peneliti</FormLabel>
              <Input
                name="peneliti"
                value={formData.peneliti}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="lokasiObservasi">
              <FormLabel>Lokasi Observasi</FormLabel>
              <Input
                name="lokasiObservasi"
                value={formData.lokasiObservasi}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="catatanTambahan">
              <FormLabel>Catatan Tambahan</FormLabel>
              <Textarea
                name="catatanTambahan"
                value={formData.catatanTambahan}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="createdBy">
              <FormLabel>Dibuat Oleh</FormLabel>
              <Input
                name="createdBy"
                value={formData.createdBy}
                onChange={handleChange}
                disabled // Biasanya ini diisi otomatis
              />
            </FormControl>

          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={() => {
            // Reset form data to initial state when cancelled
            if (initialFloraState.current) {
                setFormData({
                    ...initialFloraState.current,
                    namaLokalLain: Array.isArray(initialFloraState.current.namaLokalLain) ? initialFloraState.current.namaLokalLain.join('\n') : '',
                    urlGambarLain: Array.isArray(initialFloraState.current.urlGambarLain) ? initialFloraState.current.urlGambarLain.join('\n') : '',
                    kategoriFungsional: Array.isArray(initialFloraState.current.kategoriFungsional) ? initialFloraState.current.kategoriFungsional.join('\n') : '',
                    kegunaanUtama: Array.isArray(initialFloraState.current.kegunaanUtama) ? initialFloraState.current.kegunaanUtama.join('\n') : '',
                    komponenBioaktif: Array.isArray(initialFloraState.current.komponenBioaktif) ? initialFloraState.current.komponenBioaktif.join('\n') : '',
                    mekanismePenyebaranBiji: Array.isArray(initialFloraState.current.morfologiBiji?.mekanismePenyebaranBiji) ? initialFloraState.current.morfologiBiji.mekanismePenyebaranBiji.join('\n') : '',
                    metodeReproduksi: Array.isArray(initialFloraState.current.metodeReproduksi) ? initialFloraState.current.metodeReproduksi.join('\n') : '',
                    referensiIlmiah: Array.isArray(initialFloraState.current.referensiIlmiah) ? initialFloraState.current.referensiIlmiah.join('\n') : '',
                    morfologiBunga: {
                        tipeKelamin: initialFloraState.current.morfologiBunga?.tipeKelamin || '',
                        deskripsiBungaJantan: initialFloraState.current.morfologiBunga?.deskripsiBungaJantan || '',
                        deskripsiBungaBetina: initialFloraState.current.morfologiBunga?.deskripsiBungaBetina || '',
                        waktuBerbunga: initialFloraState.current.morfologiBunga?.waktuBerbunga || '',
                        warnaBunga: initialFloraState.current.morfologiBunga?.warnaBunga || '',
                    },
                    morfologiBuah: {
                        tipeBuah: initialFloraState.current.morfologiBuah?.tipeBuah || '',
                        deskripsiBuah: initialFloraState.current.morfologiBuah?.deskripsiBuah || '',
                        ukuranBuah: initialFloraState.current.morfologiBuah?.ukuranBuah || '',
                        warnaBuah: initialFloraState.current.morfologiBuah?.warnaBuah || '',
                        waktuBerbuah: initialFloraState.current.morfologiBuah?.waktuBerbuah || '',
                    },
                    morfologiBiji: {
                        deskripsiBiji: initialFloraState.current.morfologiBiji?.deskripsiBiji || '',
                        ukuranBiji: initialFloraState.current.morfologiBiji?.ukuranBiji || '',
                        warnaBiji: initialFloraState.current.morfologiBiji?.warnaBiji || '',
                        bentukBiji: initialFloraState.current.morfologiBiji?.bentukBiji || '',
                        mekanismePenyebaranBiji: Array.isArray(initialFloraState.current.morfologiBiji?.mekanismePenyebaranBiji) ? initialFloraState.current.morfologiBiji.mekanismePenyebaranBiji.join('\n') : '',
                    },
                    tanggalPenelitian: initialFloraState.current.tanggalPenelitian ? new Date(initialFloraState.current.tanggalPenelitian).toISOString().split('T')[0] : '',
                });
                if (initialFloraState.current.image && typeof initialFloraState.current.image === 'string') {
                    setImagePreviewUrl(initialFloraState.current.image);
                } else {
                    setImagePreviewUrl(null);
                }
            } else {
                // Default empty state for new flora
                setFormData({
                    namaIlmiah: '',
                    namaIlmiahLengkap: '',
                    namaLokal: '',
                    namaLokalLain: [],
                    namaKeluarga: '',
                    image: null,
                    urlGambarLain: [],
                    kingdom: 'Plantae',
                    divisi: '',
                    kelas: '',
                    ordo: '',
                    famili: '',
                    genus: '',
                    spesies: '',
                    varietas: '',
                    jenisTumbuhan: '',
                    tipePertumbuhan: '',
                    kategoriFungsional: [],
                    
                    // Morfologi Vegetatif
                    tinggiMaksimal: '',
                    diameterBatangMaksimal: '',
                    deskripsiBatang: '',
                    deskripsiKulitBatang: '',
                    deskripsiCabang: '',
                    bentukTajuk: '',
                    jenisDaunSejati: '',
                    deskripsiDaunSejati: '',
                    jenisRantingFotosintetik: '',
                    deskripsiRantingFotosintetik: '',
                    tipeSistemPerakaran: '',
                    deskripsiSistemPerakaran: '',

                    // Morfologi Generatif (nested objects)
                    morfologiBunga: {
                        tipeKelamin: '',
                        deskripsiBungaJantan: '',
                        deskripsiBungaBetina: '',
                        waktuBerbunga: '',
                        warnaBunga: '',
                    },
                    morfologiBuah: {
                        tipeBuah: '',
                        deskripsiBuah: '',
                        ukuranBuah: '',
                        warnaBuah: '',
                        waktuBerbuah: '',
                    },
                    morfologiBiji: {
                        deskripsiBiji: '',
                        ukuranBiji: '',
                        warnaBiji: '',
                        bentukBiji: '',
                        mekanismePenyebaranBiji: [],
                    },
                    metodeReproduksi: [],

                    // Ekologi dan Kondisi Pertumbuhan
                    musimTumbuhOptimal: '',
                    habitatAlami: '',
                    kondisiTanahIdeal: '',
                    pHTanahOptimal: '',
                    drainaseTanahIdeal: '',
                    kondisiIklimOptimal: '',
                    toleransiKekeringan: '',
                    toleransiSalinitas: '',
                    toleransiAngin: '',
                    toleransiSuhu: '',
                    sebaranGeografis: '',
                    ketinggianOptimal: '',
                    lajuPertumbuhan: '',

                    // Kegunaan dan Status Konservasi
                    kegunaanUtama: [],
                    deskripsiKegunaan: '',
                    komponenBioaktif: [],
                    potensiAncamanInvasif: '',
                    statusKonservasi: '',
                    sumberDataStatusKonservasi: '',
                    nilaiEkologis: '',
                    sifatKimia: '',
                    kerentananPenyakitHama: '',

                    // Metadata dan Referensi
                    referensiIlmiah: [],
                    tanggalPenelitian: null,
                    peneliti: '',
                    lokasiObservasi: '',
                    catatanTambahan: '',
                    deskripsi: '',
                    createdBy: '',
                });
                setImagePreviewUrl(null);
            }
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
            onClose();
          }}>
            Batal
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit} isLoading={isUploadingImage}>
            {isUploadingImage ? 'Mengunggah...' : (isEdit ? 'Perbarui' : 'Tambah')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FloraFormModal;