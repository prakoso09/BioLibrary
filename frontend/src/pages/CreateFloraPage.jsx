import React from 'react';
import {
  Container,
  Button,
  useToast,
  Input,
  Box,
  Heading,
  VStack,
  useColorModeValue,
  Flex,
  IconButton,
  Text,
  Textarea, 
  SimpleGrid, 
} from '@chakra-ui/react';
import { useFloraStore } from '../store/flora';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import axios from 'axios';

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const CreateFloraPage = () => {
  const [newFlora, setNewFlora] = React.useState({
    namaIlmiah: "",
    namaIlmiahLengkap: "", // Atribut baru
    namaLokal: "",
    namaLokalLain: [], // Atribut baru (array)
    namaKeluarga: "", // Atribut baru
    image: null,
    urlGambarLain: [], // Atribut baru (array)
    kingdom: "Plantae",
    divisi: "",
    kelas: "",
    ordo: "",
    famili: "",
    genus: "",
    spesies: "", // Atribut baru
    varietas: "", // Atribut baru
    jenisTumbuhan: "",
    tipePertumbuhan: "", // Atribut baru
    kategoriFungsional: [], // Atribut baru (array)
    tinggiMaksimal: "", // Atribut baru
    diameterBatangMaksimal: "", // Atribut baru
    deskripsiBatang: "", // Atribut baru
    deskripsiKulitBatang: "", // Atribut baru
    deskripsiCabang: "", // Atribut baru
    bentukTajuk: "", // Atribut baru
    jenisDaunSejati: "", // Atribut baru
    deskripsiDaunSejati: "", // Atribut baru
    jenisRantingFotosintetik: "", // Atribut baru
    deskripsiRantingFotosintetik: "", // Atribut baru
    tipeSistemPerakaran: "", // Atribut baru
    deskripsiSistemPerakaran: "", // Atribut baru
    morfologiBunga: {
      tipeKelamin: "",
      deskripsiBungaJantan: "",
      deskripsiBungaBetina: "",
      waktuBerbunga: "", // Atribut baru
      warnaBunga: "", // Atribut baru
    },
    morfologiBuah: {
      tipeBuah: "",
      deskripsiBuah: "",
      ukuranBuah: "", // Atribut baru
      warnaBuah: "", // Atribut baru
      waktuBerbuah: "", // Atribut baru
    },
    morfologiBiji: {
      deskripsiBiji: "",
      ukuranBiji: "", // Atribut baru
      warnaBiji: "", // Atribut baru
      bentukBiji: "", // Atribut baru
      mekanismePenyebaranBiji: [], // Atribut baru (array)
    },
    metodeReproduksi: [], // Atribut baru (array)
    musimTumbuhOptimal: "", // Atribut baru
    habitatAlami: "", // Atribut baru
    kondisiTanahIdeal: "",
    pHTanahOptimal: "", // Atribut baru
    drainaseTanahIdeal: "", // Atribut baru
    kondisiIklimOptimal: "", // Atribut baru
    toleransiKekeringan: "", // Atribut baru
    toleransiSalinitas: "", // Atribut baru
    toleransiAngin: "", // Atribut baru
    toleransiSuhu: "", // Atribut baru
    sebaranGeografis: "",
    ketinggianOptimal: "", // Atribut baru
    lajuPertumbuhan: "", // Atribut baru
    kegunaanUtama: [], // Mengganti 'kegunaan'
    deskripsiKegunaan: "", // Atribut baru
    komponenBioaktif: [], // Atribut baru (array)
    potensiAncamanInvasif: "", // Atribut baru
    statusKonservasi: "",
    sumberDataStatusKonservasi: "", // Atribut baru
    nilaiEkologis: "", // Atribut baru
    sifatKimia: "", // Atribut baru
    kerentananPenyakitHama: "", // Atribut baru
    referensiIlmiah: [], // Atribut baru (array)
    tanggalPenelitian: "", // Atribut baru (akan dikonversi ke Date)
    peneliti: "", // Atribut baru
    lokasiObservasi: "", // Atribut baru
    deskripsi: "",
    catatanTambahan: "", // Atribut baru
  });

  const [namaLokalLainInput, setNamaLokalLainInput] = React.useState("");
  const [kategoriFungsionalInput, setKategoriFungsionalInput] = React.useState("");
  const [mekanismePenyebaranBijiInput, setMekanismePenyebaranBijiInput] = React.useState("");
  const [metodeReproduksiInput, setMetodeReproduksiInput] = React.useState("");
  const [kegunaanUtamaInput, setKegunaanUtamaInput] = React.useState(""); // Input baru untuk kegunaanUtama
  const [komponenBioaktifInput, setKomponenBioaktifInput] = React.useState("");
  const [referensiIlmiahInput, setReferensiIlmiahInput] = React.useState("");
  const [urlGambarLainFiles, setUrlGambarLainFiles] = React.useState([]); // Untuk multiple file input gambar lain

  const toast = useToast();
  const navigate = useNavigate();
  const { createFlora } = useFloraStore();

  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);

  const inputStyle = {
    borderRadius: 'xl',
    bg: useColorModeValue('whiteAlpha.300', 'whiteAlpha.200'),
    backdropFilter: 'blur(5px)',
    border: '5px solid',
    borderColor: useColorModeValue('whiteAlpha.500', 'whiteAlpha.300'),
    color: useColorModeValue('black', 'white'),
    transition: 'all 0.3s ease',
    _placeholder: { color: 'gray.500' },
    _focus: {
      borderColor: 'teal.400',
      boxShadow: '0 0 0 2px rgba(0,255,255,0.3)',
    },
  };

  const buttonStyle = {
    borderRadius: 'xl',
    bgGradient: 'linear(to-r, teal.400, cyan.500)',
    color: 'white',
    fontWeight: 'bold',
    shadow: 'md',
    _hover: {
      bgGradient: 'linear(to-r, teal.500, cyan.600)',
      transform: 'scale(1.05)',
      boxShadow: '0 0 20px rgba(0,255,255,0.4)',
    },
    _active: {
      transform: 'scale(0.95)',
    },
  };

  const handleAddToArray = (stateSetter, inputSetter, currentState, inputName, limit = 6) => {
    if (inputName.trim() === "") {
      toast({
        title: "Input Kosong",
        description: "Input tidak boleh kosong.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    if (currentState.length < limit) {
      stateSetter(prev => [...prev, inputName.trim()]);
      inputSetter("");
    } else {
      toast({
        title: "Batas Tercapai",
        description: `Maksimal ${limit} item diizinkan.`,
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleAddFlora = async () => {
    if (!newFlora.image) {
      toast({
        title: "Error",
        description: "Harap pilih gambar utama untuk diunggah.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsUploadingImage(true);
    let mainImageUrl = '';
    let otherImageUrls = [];

    try {
      // Upload gambar utama
      const formDataMainImage = new FormData();
      formDataMainImage.append('file', newFlora.image);
      formDataMainImage.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const cloudinaryAxios = axios.create();
      delete cloudinaryAxios.defaults.headers.common['Authorization'];

      const cloudinaryResponseMain = await cloudinaryAxios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formDataMainImage,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      mainImageUrl = cloudinaryResponseMain.data.secure_url;

      // Upload gambar lain (jika ada)
      if (urlGambarLainFiles.length > 0) {
        for (const file of urlGambarLainFiles) {
          const formDataOtherImage = new FormData();
          formDataOtherImage.append('file', file);
          formDataOtherImage.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

          const cloudinaryResponseOther = await cloudinaryAxios.post(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            formDataOtherImage,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          );
          otherImageUrls.push(cloudinaryResponseOther.data.secure_url);
        }
      }

      toast({
        title: "Upload Berhasil",
        description: "Gambar berhasil diunggah ke Cloudinary.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

    } catch (uploadError) {
      setIsUploadingImage(false);
      console.error('Error uploading image(s) to Cloudinary:', uploadError.response?.data || uploadError.message);
      toast({
        title: "Upload Gagal",
        description: uploadError.response?.data?.error?.message || "Gagal mengunggah gambar ke Cloudinary.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const floraDataToSend = {
      ...newFlora,
      image: mainImageUrl,
      urlGambarLain: otherImageUrls, // Menggunakan URL gambar lain yang sudah diupload
      namaLokalLain: newFlora.namaLokalLain,
      kategoriFungsional: newFlora.kategoriFungsional,
      morfologiBiji: {
        ...newFlora.morfologiBiji,
        mekanismePenyebaranBiji: newFlora.morfologiBiji.mekanismePenyebaranBiji,
      },
      metodeReproduksi: newFlora.metodeReproduksi,
      kegunaanUtama: newFlora.kegunaanUtama, // Menggunakan kegunaanUtama
      komponenBioaktif: newFlora.komponenBioaktif,
      referensiIlmiah: newFlora.referensiIlmiah,
      // Konversi tanggal jika perlu, pastikan formatnya sesuai dengan backend
      tanggalPenelitian: newFlora.tanggalPenelitian ? new Date(newFlora.tanggalPenelitian).toISOString() : undefined,
    };

    // Hapus field yang tidak lagi ada di model atau yang tidak perlu dikirim
    delete floraDataToSend.jenisDaun; // Ini sudah diganti menjadi jenisDaunSejati
    delete floraDataToSend.musimTumbuh; // Ini sudah diganti menjadi musimTumbuhOptimal
    delete floraDataToSend.habitat; // Ini sudah diganti menjadi habitatAlami
    delete floraDataToSend.kegunaan; // Ini sudah diganti menjadi kegunaanUtama


    try {
      const { success, message } = await createFlora(floraDataToSend);

      if (!success) {
        toast({ title: "Error", description: message, status: "error", duration: 3000, isClosable: true });
      } else {
        toast({ title: "Success", description: message, status: "success", duration: 3000, isClosable: true });
        // Reset form
        setNewFlora({
          namaIlmiah: "",
          namaIlmiahLengkap: "",
          namaLokal: "",
          namaLokalLain: [],
          namaKeluarga: "",
          image: null,
          urlGambarLain: [],
          kingdom: "Plantae",
          divisi: "",
          kelas: "",
          ordo: "",
          famili: "",
          genus: "",
          spesies: "",
          varietas: "",
          jenisTumbuhan: "",
          tipePertumbuhan: "",
          kategoriFungsional: [],
          tinggiMaksimal: "",
          diameterBatangMaksimal: "",
          deskripsiBatang: "",
          deskripsiKulitBatang: "",
          deskripsiCabang: "",
          bentukTajuk: "",
          jenisDaunSejati: "",
          deskripsiDaunSejati: "",
          jenisRantingFotosintetik: "",
          deskripsiRantingFotosintetik: "",
          tipeSistemPerakaran: "",
          deskripsiSistemPerakaran: "",
          morfologiBunga: {
            tipeKelamin: "",
            deskripsiBungaJantan: "",
            deskripsiBungaBetina: "",
            waktuBerbunga: "",
            warnaBunga: "",
          },
          morfologiBuah: {
            tipeBuah: "",
            deskripsiBuah: "",
            ukuranBuah: "",
            warnaBuah: "",
            waktuBerbuah: "",
          },
          morfologiBiji: {
            deskripsiBiji: "",
            ukuranBiji: "",
            warnaBiji: "",
            bentukBiji: "",
            mekanismePenyebaranBiji: [],
          },
          metodeReproduksi: [],
          musimTumbuhOptimal: "",
          habitatAlami: "",
          kondisiTanahIdeal: "",
          pHTanahOptimal: "",
          drainaseTanahIdeal: "",
          kondisiIklimOptimal: "",
          toleransiKekeringan: "",
          toleransiSalinitas: "",
          toleransiAngin: "",
          toleransiSuhu: "",
          sebaranGeografis: "",
          ketinggianOptimal: "",
          lajuPertumbuhan: "",
          kegunaanUtama: [],
          deskripsiKegunaan: "",
          komponenBioaktif: [],
          potensiAncamanInvasif: "",
          statusKonservasi: "",
          sumberDataStatusKonservasi: "",
          nilaiEkologis: "",
          sifatKimia: "",
          kerentananPenyakitHama: "",
          referensiIlmiah: [],
          tanggalPenelitian: "",
          peneliti: "",
          lokasiObservasi: "",
          deskripsi: "",
          catatanTambahan: "",
        });
        setNamaLokalLainInput("");
        setKategoriFungsionalInput("");
        setMekanismePenyebaranBijiInput("");
        setMetodeReproduksiInput("");
        setKegunaanUtamaInput("");
        setKomponenBioaktifInput("");
        setReferensiIlmiahInput("");
        setUrlGambarLainFiles([]);
        navigate('/Flora');
      }
    } catch (error) {
      toast({
        title: "Gagal",
        description: error.message || "Terjadi kesalahan saat membuat flora.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error("Error creating flora via store action:", error);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleGoBack = () => {
    navigate('/Flora');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle nested objects like morfologiBunga, morfologiBuah, morfologiBiji
    if (name.startsWith("morfologiBunga.")) {
      const field = name.split(".")[1];
      setNewFlora(prev => ({
        ...prev,
        morfologiBunga: {
          ...prev.morfologiBunga,
          [field]: value
        }
      }));
    } else if (name.startsWith("morfologiBuah.")) {
      const field = name.split(".")[1];
      setNewFlora(prev => ({
        ...prev,
        morfologiBuah: {
          ...prev.morfologiBuah,
          [field]: value
        }
      }));
    } else if (name.startsWith("morfologiBiji.")) {
      const field = name.split(".")[1];
      setNewFlora(prev => ({
        ...prev,
        morfologiBiji: {
          ...prev.morfologiBiji,
          [field]: value
        }
      }));
    } else {
      setNewFlora({ ...newFlora, [name]: value });
    }
  };

  return (
<Container maxW="container.lg" mt={10}>
      <Flex mb={8} align="center">
        <IconButton
          icon={<ArrowLeftIcon />}
          aria-label="Kembali ke Flora"
          onClick={handleGoBack}
          variant="ghost"
          size="lg"
          borderRadius="full"
          _hover={{ bg: useColorModeValue('gray.200', 'whiteAlpha.200') }}
        />
        <Heading as="h1" size="2xl" textAlign="center" ml={4} color="white">
          Tambah Flora Baru
        </Heading>
      </Flex>

      <MotionBox
        w="full"
        bg={useColorModeValue(
          'linear-gradient(to right, rgba(255,255,255,0.2), rgba(200,255,240,0.15))',
          'linear-gradient(to right, rgba(23,25,35,0.6), rgba(12,18,30,0.4))'
        )}
        backdropFilter="blur(15px)"
        border="1px solid"
        borderColor={useColorModeValue('whiteAlpha.300', 'whiteAlpha.200')}
        boxShadow="0 8px 32px 0 rgba( 31, 38, 135, 0.37 )"
        p={10}
        rounded="2xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <VStack spacing={5} align="stretch">
          {/* Informasi Umum */}
          <Heading size="md" color="whiteAlpha.800" mt={4}>Informasi Umum</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
            <Input placeholder="Nama Ilmiah" name="namaIlmiah" value={newFlora.namaIlmiah} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Nama Ilmiah Lengkap" name="namaIlmiahLengkap" value={newFlora.namaIlmiahLengkap} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Nama Lokal" name="namaLokal" value={newFlora.namaLokal} onChange={handleChange} {...inputStyle} />
            <Box>
              <Input
                placeholder="Nama Lokal Lain (tambahkan satu per satu)"
                value={namaLokalLainInput}
                onChange={(e) => setNamaLokalLainInput(e.target.value)}
                {...inputStyle}
              />
              <Button mt={2} onClick={() => handleAddToArray(setNewFlora, setNamaLokalLainInput, newFlora.namaLokalLain, namaLokalLainInput, 5)} size="sm" colorScheme="teal">Tambah Nama Lokal Lain</Button>
              {newFlora.namaLokalLain.length > 0 && (
                <Text color="grey.900" fontSize="sm" mt={1}>Ditambahkan: {newFlora.namaLokalLain.join(', ')}</Text>
              )}
            </Box>
            <Input placeholder="Nama Keluarga" name="namaKeluarga" value={newFlora.namaKeluarga} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Divisi" name="divisi" value={newFlora.divisi} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Kelas" name="kelas" value={newFlora.kelas} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Ordo" name="ordo" value={newFlora.ordo} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Famili" name="famili" value={newFlora.famili} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Genus" name="genus" value={newFlora.genus} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Spesies" name="spesies" value={newFlora.spesies} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Varietas/Sub-spesies" name="varietas" value={newFlora.varietas} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Jenis Tumbuhan (contoh: Pohon Tahunan, Semak, Herbal)" name="jenisTumbuhan" value={newFlora.jenisTumbuhan} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Tipe Pertumbuhan (contoh: Tegak, Merambat, Memanjat)" name="tipePertumbuhan" value={newFlora.tipePertumbuhan} onChange={handleChange} {...inputStyle} />
            <Box>
              <Input
                placeholder="Kategori Fungsional (contoh: Pohon peneduh, Obat-obatan, Kayu)"
                value={kategoriFungsionalInput}
                onChange={(e) => setKategoriFungsionalInput(e.target.value)}
                {...inputStyle}
              />
              <Button mt={2} onClick={() => handleAddToArray(setNewFlora, setKategoriFungsionalInput, newFlora.kategoriFungsional, kategoriFungsionalInput, 5)} size="sm" colorScheme="teal">Tambah Kategori Fungsional</Button>
              {newFlora.kategoriFungsional.length > 0 && (
                <Text color="grey.900" fontSize="sm" mt={1}>Ditambahkan: {newFlora.kategoriFungsional.join(', ')}</Text>
              )}
            </Box>
          </SimpleGrid>

          {/* Morfologi Vegetatif */}
          <Heading size="md" color="whiteAlpha.800" mt={4}>Morfologi Vegetatif</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
            <Input placeholder="Tinggi Maksimal (contoh: 20m)" name="tinggiMaksimal" value={newFlora.tinggiMaksimal} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Diameter Batang Maksimal (contoh: 50cm)" name="diameterBatangMaksimal" value={newFlora.diameterBatangMaksimal} onChange={handleChange} {...inputStyle} />
            <Textarea placeholder="Deskripsi Batang" name="deskripsiBatang" value={newFlora.deskripsiBatang} onChange={handleChange} {...inputStyle} />
            <Textarea placeholder="Deskripsi Kulit Batang" name="deskripsiKulitBatang" value={newFlora.deskripsiKulitBatang} onChange={handleChange} {...inputStyle} />
            <Textarea placeholder="Deskripsi Cabang" name="deskripsiCabang" value={newFlora.deskripsiCabang} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Bentuk Tajuk (contoh: Kerucut, Membulat)" name="bentukTajuk" value={newFlora.bentukTajuk} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Jenis Daun Sejati (contoh: Sisik kecil, Jarum, Lebar)" name="jenisDaunSejati" value={newFlora.jenisDaunSejati} onChange={handleChange} {...inputStyle} />
            <Textarea placeholder="Deskripsi Daun Sejati" name="deskripsiDaunSejati" value={newFlora.deskripsiDaunSejati} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Jenis Ranting Fotosintetik (contoh: Silinder, Pipih)" name="jenisRantingFotosintetik" value={newFlora.jenisRantingFotosintetik} onChange={handleChange} {...inputStyle} />
            <Textarea placeholder="Deskripsi Ranting Fotosintetik" name="deskripsiRantingFotosintetik" value={newFlora.deskripsiRantingFotosintetik} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Tipe Sistem Perakaran (contoh: Tunggang, Serabut, Menyebar)" name="tipeSistemPerakaran" value={newFlora.tipeSistemPerakaran} onChange={handleChange} {...inputStyle} />
            <Textarea placeholder="Deskripsi Sistem Perakaran" name="deskripsiSistemPerakaran" value={newFlora.deskripsiSistemPerakaran} onChange={handleChange} {...inputStyle} />
          </SimpleGrid>

          {/* Morfologi Generatif (Bunga) */}
          <Heading size="md" color="whiteAlpha.800" mt={4}>Morfologi Generatif: Bunga</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
            <Input placeholder="Tipe Kelamin Bunga (contoh: Monoecious, Dioecious, Hermaphrodite)" name="morfologiBunga.tipeKelamin" value={newFlora.morfologiBunga.tipeKelamin} onChange={handleChange} {...inputStyle} />
            <Textarea placeholder="Deskripsi Bunga Jantan" name="morfologiBunga.deskripsiBungaJantan" value={newFlora.morfologiBunga.deskripsiBungaJantan} onChange={handleChange} {...inputStyle} />
            <Textarea placeholder="Deskripsi Bunga Betina" name="morfologiBunga.deskripsiBungaBetina" value={newFlora.morfologiBunga.deskripsiBungaBetina} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Waktu Berbunga (contoh: Mei-Juli)" name="morfologiBunga.waktuBerbunga" value={newFlora.morfologiBunga.waktuBerbunga} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Warna Bunga" name="morfologiBunga.warnaBunga" value={newFlora.morfologiBunga.warnaBunga} onChange={handleChange} {...inputStyle} />
          </SimpleGrid>

          {/* Morfologi Generatif (Buah) */}
          <Heading size="md" color="whiteAlpha.800" mt={4}>Morfologi Generatif: Buah</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
            <Input placeholder="Tipe Buah (contoh: Kerucut, Beri, Kapsul)" name="morfologiBuah.tipeBuah" value={newFlora.morfologiBuah.tipeBuah} onChange={handleChange} {...inputStyle} />
            <Textarea placeholder="Deskripsi Buah" name="morfologiBuah.deskripsiBuah" value={newFlora.morfologiBuah.deskripsiBuah} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Ukuran Buah (contoh: 2-3 cm)" name="morfologiBuah.ukuranBuah" value={newFlora.morfologiBuah.ukuranBuah} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Warna Buah" name="morfologiBuah.warnaBuah" value={newFlora.morfologiBuah.warnaBuah} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Waktu Berbuah (contoh: Juli-September)" name="morfologiBuah.waktuBerbuah" value={newFlora.morfologiBuah.waktuBerbuah} onChange={handleChange} {...inputStyle} />
          </SimpleGrid>

          {/* Morfologi Generatif (Biji) */}
          <Heading size="md" color="whiteAlpha.800" mt={4}>Morfologi Generatif: Biji</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
            <Textarea placeholder="Deskripsi Biji" name="morfologiBiji.deskripsiBiji" value={newFlora.morfologiBiji.deskripsiBiji} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Ukuran Biji (contoh: 0.5 cm)" name="morfologiBiji.ukuranBiji" value={newFlora.morfologiBiji.ukuranBiji} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Warna Biji" name="morfologiBiji.warnaBiji" value={newFlora.morfologiBiji.warnaBiji} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Bentuk Biji" name="morfologiBiji.bentukBiji" value={newFlora.morfologiBiji.bentukBiji} onChange={handleChange} {...inputStyle} />
            <Box>
              <Input
                placeholder="Mekanisme Penyebaran Biji (contoh: Angin, Hewan, Air)"
                value={mekanismePenyebaranBijiInput}
                onChange={(e) => setMekanismePenyebaranBijiInput(e.target.value)}
                {...inputStyle}
              />
              <Button mt={2} onClick={() => {
                setNewFlora(prev => ({
                  ...prev,
                  morfologiBiji: {
                    ...prev.morfologiBiji,
                    mekanismePenyebaranBiji: [...prev.morfologiBiji.mekanismePenyebaranBiji, mekanismePenyebaranBijiInput.trim()]
                  }
                }));
                setMekanismePenyebaranBijiInput("");
              }} size="sm" colorScheme="teal">Tambah Mekanisme Penyebaran</Button>
              {newFlora.morfologiBiji.mekanismePenyebaranBiji.length > 0 && (
                <Text color="grey.900" fontSize="sm" mt={1}>Ditambahkan: {newFlora.morfologiBiji.mekanismePenyebaranBiji.join(', ')}</Text>
              )}
            </Box>
          </SimpleGrid>

          <Box>
            <Input
              placeholder="Metode Reproduksi (contoh: Biji, Stek, Okulasi)"
              value={metodeReproduksiInput}
              onChange={(e) => setMetodeReproduksiInput(e.target.value)}
              {...inputStyle}
            />
            <Button mt={2} onClick={() => handleAddToArray(setNewFlora, setMetodeReproduksiInput, newFlora.metodeReproduksi, metodeReproduksiInput, 5)} size="sm" colorScheme="teal">Tambah Metode Reproduksi</Button>
            {newFlora.metodeReproduksi.length > 0 && (
              <Text color="grey.900" fontSize="sm" mt={1}>Ditambahkan: {newFlora.metodeReproduksi.join(', ')}</Text>
            )}
          </Box>

          {/* Ekologi dan Kondisi Pertumbuhan */}
          <Heading size="md" color="whiteAlpha.800" mt={4}>Ekologi dan Kondisi Pertumbuhan</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
            <Input placeholder="Musim Tumbuh Optimal (contoh: Sepanjang tahun, Musim hujan)" name="musimTumbuhOptimal" value={newFlora.musimTumbuhOptimal} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Habitat Alami (contoh: Zona litoral, Gumuk pasir, Hutan bakau)" name="habitatAlami" value={newFlora.habitatAlami} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Kondisi Tanah Ideal (contoh: Berpasir, Lempung, Subur, Salin)" name="kondisiTanahIdeal" value={newFlora.kondisiTanahIdeal} onChange={handleChange} {...inputStyle} />
            <Input placeholder="pH Tanah Optimal" name="pHTanahOptimal" value={newFlora.pHTanahOptimal} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Drainase Tanah Ideal" name="drainaseTanahIdeal" value={newFlora.drainaseTanahIdeal} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Kondisi Iklim Optimal (contoh: Tropis, Subtropis, Hangat, Lembap)" name="kondisiIklimOptimal" value={newFlora.kondisiIklimOptimal} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Toleransi Kekeringan" name="toleransiKekeringan" value={newFlora.toleransiKekeringan} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Toleransi Salinitas" name="toleransiSalinitas" value={newFlora.toleransiSalinitas} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Toleransi Angin" name="toleransiAngin" value={newFlora.toleransiAngin} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Toleransi Suhu" name="toleransiSuhu" value={newFlora.toleransiSuhu} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Sebaran Geografis" name="sebaranGeografis" value={newFlora.sebaranGeografis} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Ketinggian Optimal (contoh: 0-500 mdpl)" name="ketinggianOptimal" value={newFlora.ketinggianOptimal} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Laju Pertumbuhan (contoh: Cepat, Sedang, Lambat)" name="lajuPertumbuhan" value={newFlora.lajuPertumbuhan} onChange={handleChange} {...inputStyle} />
          </SimpleGrid>

          {/* Kegunaan dan Status */}
          <Heading size="md" color="whiteAlpha.800" mt={4}>Kegunaan dan Status</Heading>
          <Box>
            <Input
              placeholder="Kegunaan Utama (contoh: Konservasi pesisir, Kayu bakar, Obat tradisional)"
              value={kegunaanUtamaInput}
              onChange={(e) => setKegunaanUtamaInput(e.target.value)}
              {...inputStyle}
            />
            <Button mt={2} onClick={() => handleAddToArray(setNewFlora, setKegunaanUtamaInput, newFlora.kegunaanUtama, kegunaanUtamaInput, 6)} size="sm" colorScheme="teal">Tambah Kegunaan Utama</Button>
            {newFlora.kegunaanUtama.length > 0 && (
              <Text color="grey.900" fontSize="sm" mt={1}>Ditambahkan: {newFlora.kegunaanUtama.join(', ')}</Text>
            )}
          </Box>
          <Textarea placeholder="Deskripsi Kegunaan" name="deskripsiKegunaan" value={newFlora.deskripsiKegunaan} onChange={handleChange} {...inputStyle} />
          <Box>
            <Input
              placeholder="Komponen Bioaktif (contoh: Tanin, Alkaloid)"
              value={komponenBioaktifInput}
              onChange={(e) => setKomponenBioaktifInput(e.target.value)}
              {...inputStyle}
            />
            <Button mt={2} onClick={() => handleAddToArray(setNewFlora, setKomponenBioaktifInput, newFlora.komponenBioaktif, komponenBioaktifInput, 5)} size="sm" colorScheme="teal">Tambah Komponen Bioaktif</Button>
            {newFlora.komponenBioaktif.length > 0 && (
              <Text color="grey.900" fontSize="sm" mt={1}>Ditambahkan: {newFlora.komponenBioaktif.join(', ')}</Text>
            )}
          </Box>
          <Textarea placeholder="Potensi Ancaman Invasif (contoh: Invasif di beberapa daerah karena...)" name="potensiAncamanInvasif" value={newFlora.potensiAncamanInvasif} onChange={handleChange} {...inputStyle} />
          <Input placeholder="Status Konservasi (contoh: LC, EN, CR)" name="statusKonservasi" value={newFlora.statusKonservasi} onChange={handleChange} {...inputStyle} />
          <Input placeholder="Sumber Data Status Konservasi" name="sumberDataStatusKonservasi" value={newFlora.sumberDataStatusKonservasi} onChange={handleChange} {...inputStyle} />
          <Textarea placeholder="Nilai Ekologis (contoh: Fiksasi nitrogen, Habitat satwa liar)" name="nilaiEkologis" value={newFlora.nilaiEkologis} onChange={handleChange} {...inputStyle} />
          <Textarea placeholder="Sifat Kimia (contoh: Mengandung tanin, alkaloid)" name="sifatKimia" value={newFlora.sifatKimia} onChange={handleChange} {...inputStyle} />
          <Textarea placeholder="Kerentanan Penyakit dan Hama (contoh: Relatif tahan, Rentan terhadap...)" name="kerentananPenyakitHama" value={newFlora.kerentananPenyakitHama} onChange={handleChange} {...inputStyle} />

          {/* Metadata dan Referensi */}
          <Heading size="md" color="whiteAlpha.800" mt={4}>Metadata dan Referensi</Heading>
          <Box>
            <Input
              placeholder="Referensi Ilmiah (tambahkan satu per satu)"
              value={referensiIlmiahInput}
              onChange={(e) => setReferensiIlmiahInput(e.target.value)}
              {...inputStyle}
            />
            <Button mt={2} onClick={() => handleAddToArray(setNewFlora, setReferensiIlmiahInput, newFlora.referensiIlmiah, referensiIlmiahInput, 5)} size="sm" colorScheme="teal">Tambah Referensi</Button>
            {newFlora.referensiIlmiah.length > 0 && (
              <Text color="grey.900" fontSize="sm" mt={1}>Ditambahkan: {newFlora.referensiIlmiah.join(', ')}</Text>
            )}
          </Box>
          <Input
            type="date"
            placeholder="Tanggal Penelitian"
            name="tanggalPenelitian"
            value={newFlora.tanggalPenelitian}
            onChange={handleChange}
            {...inputStyle}
          />
          <Input placeholder="Peneliti" name="peneliti" value={newFlora.peneliti} onChange={handleChange} {...inputStyle} />
          <Input placeholder="Lokasi Observasi" name="lokasiObservasi" value={newFlora.lokasiObservasi} onChange={handleChange} {...inputStyle} />
          <Textarea placeholder="Deskripsi Umum" name="deskripsi" value={newFlora.deskripsi} onChange={handleChange} {...inputStyle} />
          <Textarea placeholder="Catatan Tambahan" name="catatanTambahan" value={newFlora.catatanTambahan} onChange={handleChange} {...inputStyle} />


          {/* Input file untuk gambar utama */}
          <Box>
            <Text color="whiteAlpha.700" mb={2}>Gambar Utama:</Text>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setNewFlora({ ...newFlora, image: e.target.files[0] })}
              {...inputStyle}
            />
          </Box>

          {/* Input file gambar lainnya */}
          <Box>
            <Text color="whiteAlpha.700" mb={2}>Gambar Lainnya (Opsional):</Text>
            <Input
              type="file"
              accept="image/*"
              multiple 
              onChange={(e) => setUrlGambarLainFiles(Array.from(e.target.files))}
              {...inputStyle}
            />
            {urlGambarLainFiles.length > 0 && (
              <Text color="grey.900" fontSize="sm" mt={1}>File terpilih: {urlGambarLainFiles.map(f => f.name).join(', ')}</Text>
            )}
          </Box>


          <MotionButton
            onClick={handleAddFlora}
            w="full"
            {...buttonStyle}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            isLoading={isUploadingImage || createFlora.loading}
            loadingText={isUploadingImage ? "Mengunggah Gambar..." : "Menambahkan Flora..."}
          >
            Tambah Flora
          </MotionButton>
        </VStack>
      </MotionBox>
    </Container>
  );
};

export default CreateFloraPage;