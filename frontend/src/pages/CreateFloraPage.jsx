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
  Textarea, // Tambahkan Textarea untuk deskripsi panjang
  SimpleGrid, // Untuk tata letak yang lebih rapi
} from '@chakra-ui/react';
import { useFloraStore } from '../store/flora';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import axios from 'axios';

// Menggunakan motion(Component) adalah cara yang benar untuk membungkus komponen Chakra UI
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
          aria-label="Back to Flora"
          onClick={handleGoBack}
          variant="ghost"
          size="lg"
          borderRadius="full"
          _hover={{ bg: useColorModeValue('gray.200', 'whiteAlpha.200') }}
        />
        <Heading as="h1" size="2xl" textAlign="center" ml={4} color="white">
          Add New Flora
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
          {/* General Information */}
          <Heading size="md" color="whiteAlpha.800" mt={4}>Informasi Umum</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
            <Input placeholder="Scientific Name" name="namaIlmiah" value={newFlora.namaIlmiah} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Full Scientific Name" name="namaIlmiahLengkap" value={newFlora.namaIlmiahLengkap} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Local Name" name="namaLokal" value={newFlora.namaLokal} onChange={handleChange} {...inputStyle} />
            <Box>
              <Input
                placeholder="Other Local Name (add one by one)"
                value={namaLokalLainInput}
                onChange={(e) => setNamaLokalLainInput(e.target.value)}
                {...inputStyle}
              />
              <Button mt={2} onClick={() => handleAddToArray(setNewFlora, setNamaLokalLainInput, newFlora.namaLokalLain, namaLokalLainInput, 5)} size="sm" colorScheme="teal">Add Other Local Name</Button>
              {newFlora.namaLokalLain.length > 0 && (
                <Text color="grey.900" fontSize="sm" mt={1}>Added: {newFlora.namaLokalLain.join(', ')}</Text>
              )}
            </Box>
            <Input placeholder="Family Name" name="namaKeluarga" value={newFlora.namaKeluarga} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Division" name="divisi" value={newFlora.divisi} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Class" name="kelas" value={newFlora.kelas} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Order" name="ordo" value={newFlora.ordo} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Family" name="famili" value={newFlora.famili} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Genus" name="genus" value={newFlora.genus} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Species" name="spesies" value={newFlora.spesies} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Variety/Sub-species" name="varietas" value={newFlora.varietas} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Plant Type (e.g., Annual Tree, Shrub, Herb)" name="jenisTumbuhan" value={newFlora.jenisTumbuhan} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Growth Type (e.g., Upright, Creeping, Climbing)" name="tipePertumbuhan" value={newFlora.tipePertumbuhan} onChange={handleChange} {...inputStyle} />
            <Box>
              <Input
                placeholder="Functional Category (e.g., Shade tree, Medicinal, Wood)"
                value={kategoriFungsionalInput}
                onChange={(e) => setKategoriFungsionalInput(e.target.value)}
                {...inputStyle}
              />
              <Button mt={2} onClick={() => handleAddToArray(setNewFlora, setKategoriFungsionalInput, newFlora.kategoriFungsional, kategoriFungsionalInput, 5)} size="sm" colorScheme="teal">Add Functional Category</Button>
              {newFlora.kategoriFungsional.length > 0 && (
                <Text color="grey.900" fontSize="sm" mt={1}>Added: {newFlora.kategoriFungsional.join(', ')}</Text>
              )}
            </Box>
          </SimpleGrid>

          {/* Vegetative Morphology */}
          <Heading size="md" color="whiteAlpha.800" mt={4}>Morfologi Vegetatif</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
            <Input placeholder="Maximum Height (e.g., 20m)" name="tinggiMaksimal" value={newFlora.tinggiMaksimal} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Maximum Stem Diameter (e.g., 50cm)" name="diameterBatangMaksimal" value={newFlora.diameterBatangMaksimal} onChange={handleChange} {...inputStyle} />
            <Textarea placeholder="Stem Description" name="deskripsiBatang" value={newFlora.deskripsiBatang} onChange={handleChange} {...inputStyle} />
            <Textarea placeholder="Bark Description" name="deskripsiKulitBatang" value={newFlora.deskripsiKulitBatang} onChange={handleChange} {...inputStyle} />
            <Textarea placeholder="Branch Description" name="deskripsiCabang" value={newFlora.deskripsiCabang} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Canopy Shape (e.g., Conical, Rounded)" name="bentukTajuk" value={newFlora.bentukTajuk} onChange={handleChange} {...inputStyle} />
            <Input placeholder="True Leaf Type (e.g., Small scale, Needle, Broad)" name="jenisDaunSejati" value={newFlora.jenisDaunSejati} onChange={handleChange} {...inputStyle} />
            <Textarea placeholder="True Leaf Description" name="deskripsiDaunSejati" value={newFlora.deskripsiDaunSejati} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Photosynthetic Twig Type (e.g., Cylindrical, Flat)" name="jenisRantingFotosintetik" value={newFlora.jenisRantingFotosintetik} onChange={handleChange} {...inputStyle} />
            <Textarea placeholder="Photosynthetic Twig Description" name="deskripsiRantingFotosintetik" value={newFlora.deskripsiRantingFotosintetik} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Root System Type (e.g., Taproot, Fibrous, Spreading)" name="tipeSistemPerakaran" value={newFlora.tipeSistemPerakaran} onChange={handleChange} {...inputStyle} />
            <Textarea placeholder="Root System Description" name="deskripsiSistemPerakaran" value={newFlora.deskripsiSistemPerakaran} onChange={handleChange} {...inputStyle} />
          </SimpleGrid>

          {/* Generative Morphology (Flowers) */}
          <Heading size="md" color="whiteAlpha.800" mt={4}>Morfologi Generatif: Bunga</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
            <Input placeholder="Flower Sex Type (e.g., Monoecious, Dioecious, Hermaphrodite)" name="morfologiBunga.tipeKelamin" value={newFlora.morfologiBunga.tipeKelamin} onChange={handleChange} {...inputStyle} />
            <Textarea placeholder="Male Flower Description" name="morfologiBunga.deskripsiBungaJantan" value={newFlora.morfologiBunga.deskripsiBungaJantan} onChange={handleChange} {...inputStyle} />
            <Textarea placeholder="Female Flower Description" name="morfologiBunga.deskripsiBungaBetina" value={newFlora.morfologiBunga.deskripsiBungaBetina} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Flowering Time (e.g., May-July)" name="morfologiBunga.waktuBerbunga" value={newFlora.morfologiBunga.waktuBerbunga} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Flower Color" name="morfologiBunga.warnaBunga" value={newFlora.morfologiBunga.warnaBunga} onChange={handleChange} {...inputStyle} />
          </SimpleGrid>

          {/* Generative Morphology (Fruits) */}
          <Heading size="md" color="whiteAlpha.800" mt={4}>Morfologi Generatif: Buah</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
            <Input placeholder="Fruit Type (e.g., Cone, Berry, Capsule)" name="morfologiBuah.tipeBuah" value={newFlora.morfologiBuah.tipeBuah} onChange={handleChange} {...inputStyle} />
            <Textarea placeholder="Fruit Description" name="morfologiBuah.deskripsiBuah" value={newFlora.morfologiBuah.deskripsiBuah} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Fruit Size (e.g., 2-3 cm)" name="morfologiBuah.ukuranBuah" value={newFlora.morfologiBuah.ukuranBuah} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Fruit Color" name="morfologiBuah.warnaBuah" value={newFlora.morfologiBuah.warnaBuah} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Fruiting Time (e.g., July-September)" name="morfologiBuah.waktuBerbuah" value={newFlora.morfologiBuah.waktuBerbuah} onChange={handleChange} {...inputStyle} />
          </SimpleGrid>

          {/* Generative Morphology (Seeds) */}
          <Heading size="md" color="whiteAlpha.800" mt={4}>Morfologi Generatif: Biji</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
            <Textarea placeholder="Seed Description" name="morfologiBiji.deskripsiBiji" value={newFlora.morfologiBiji.deskripsiBiji} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Seed Size (e.g., 0.5 cm)" name="morfologiBiji.ukuranBiji" value={newFlora.morfologiBiji.ukuranBiji} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Seed Color" name="morfologiBiji.warnaBiji" value={newFlora.morfologiBiji.warnaBiji} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Seed Shape" name="morfologiBiji.bentukBiji" value={newFlora.morfologiBiji.bentukBiji} onChange={handleChange} {...inputStyle} />
            <Box>
              <Input
                placeholder="Seed Dispersal Mechanism (e.g., Wind, Animal, Water)"
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
              }} size="sm" colorScheme="teal">Add Dispersal Mechanism</Button>
              {newFlora.morfologiBiji.mekanismePenyebaranBiji.length > 0 && (
                <Text color="grey.900" fontSize="sm" mt={1}>Added: {newFlora.morfologiBiji.mekanismePenyebaranBiji.join(', ')}</Text>
              )}
            </Box>
          </SimpleGrid>

          <Box>
            <Input
              placeholder="Reproduction Method (e.g., Seed, Cutting, Grafting)"
              value={metodeReproduksiInput}
              onChange={(e) => setMetodeReproduksiInput(e.target.value)}
              {...inputStyle}
            />
            <Button mt={2} onClick={() => handleAddToArray(setNewFlora, setMetodeReproduksiInput, newFlora.metodeReproduksi, metodeReproduksiInput, 5)} size="sm" colorScheme="teal">Add Reproduction Method</Button>
            {newFlora.metodeReproduksi.length > 0 && (
              <Text color="grey.900" fontSize="sm" mt={1}>Added: {newFlora.metodeReproduksi.join(', ')}</Text>
            )}
          </Box>

          {/* Ecology and Growth Conditions */}
          <Heading size="md" color="whiteAlpha.800" mt={4}>Ekologi dan Kondisi Pertumbuhan</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
            <Input placeholder="Optimal Growing Season (e.g., All year, Rainy season)" name="musimTumbuhOptimal" value={newFlora.musimTumbuhOptimal} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Natural Habitat (e.g., Littoral zone, Sand dune, Mangrove forest)" name="habitatAlami" value={newFlora.habitatAlami} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Ideal Soil Conditions (e.g., Sandy, Clay, Fertile, Saline)" name="kondisiTanahIdeal" value={newFlora.kondisiTanahIdeal} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Optimal Soil pH" name="pHTanahOptimal" value={newFlora.pHTanahOptimal} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Ideal Soil Drainage" name="drainaseTanahIdeal" value={newFlora.drainaseTanahIdeal} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Optimal Climate Conditions (e.g., Tropical, Subtropical, Warm, Humid)" name="kondisiIklimOptimal" value={newFlora.kondisiIklimOptimal} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Drought Tolerance" name="toleransiKekeringan" value={newFlora.toleransiKekeringan} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Salinity Tolerance" name="toleransiSalinitas" value={newFlora.toleransiSalinitas} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Wind Tolerance" name="toleransiAngin" value={newFlora.toleransiAngin} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Temperature Tolerance" name="toleransiSuhu" value={newFlora.toleransiSuhu} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Geographic Distribution" name="sebaranGeografis" value={newFlora.sebaranGeografis} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Optimal Altitude (e.g., 0-500 masl)" name="ketinggianOptimal" value={newFlora.ketinggianOptimal} onChange={handleChange} {...inputStyle} />
            <Input placeholder="Growth Rate (e.g., Fast, Moderate, Slow)" name="lajuPertumbuhan" value={newFlora.lajuPertumbuhan} onChange={handleChange} {...inputStyle} />
          </SimpleGrid>

          {/* Uses and Status */}
          <Heading size="md" color="whiteAlpha.800" mt={4}>Kegunaan dan Status</Heading>
          <Box>
            <Input
              placeholder="Primary Uses (e.g., Coastal conservation, Fuelwood, Traditional medicine)"
              value={kegunaanUtamaInput}
              onChange={(e) => setKegunaanUtamaInput(e.target.value)}
              {...inputStyle}
            />
            <Button mt={2} onClick={() => handleAddToArray(setNewFlora, setKegunaanUtamaInput, newFlora.kegunaanUtama, kegunaanUtamaInput, 6)} size="sm" colorScheme="teal">Add Primary Use</Button>
            {newFlora.kegunaanUtama.length > 0 && (
              <Text color="grey.900" fontSize="sm" mt={1}>Added: {newFlora.kegunaanUtama.join(', ')}</Text>
            )}
          </Box>
          <Textarea placeholder="Description of Uses" name="deskripsiKegunaan" value={newFlora.deskripsiKegunaan} onChange={handleChange} {...inputStyle} />
          <Box>
            <Input
              placeholder="Bioactive Components (e.g., Tannins, Alkaloids)"
              value={komponenBioaktifInput}
              onChange={(e) => setKomponenBioaktifInput(e.target.value)}
              {...inputStyle}
            />
            <Button mt={2} onClick={() => handleAddToArray(setNewFlora, setKomponenBioaktifInput, newFlora.komponenBioaktif, komponenBioaktifInput, 5)} size="sm" colorScheme="teal">Add Bioactive Component</Button>
            {newFlora.komponenBioaktif.length > 0 && (
              <Text color="grey.900" fontSize="sm" mt={1}>Added: {newFlora.komponenBioaktif.join(', ')}</Text>
            )}
          </Box>
          <Textarea placeholder="Potential Invasive Threat (e.g., Invasive in some regions because...)" name="potensiAncamanInvasif" value={newFlora.potensiAncamanInvasif} onChange={handleChange} {...inputStyle} />
          <Input placeholder="Conservation Status (e.g., LC, EN, CR)" name="statusKonservasi" value={newFlora.statusKonservasi} onChange={handleChange} {...inputStyle} />
          <Input placeholder="Source of Conservation Status Data" name="sumberDataStatusKonservasi" value={newFlora.sumberDataStatusKonservasi} onChange={handleChange} {...inputStyle} />
          <Textarea placeholder="Ecological Value (e.g., Nitrogen fixation, Wildlife habitat)" name="nilaiEkologis" value={newFlora.nilaiEkologis} onChange={handleChange} {...inputStyle} />
          <Textarea placeholder="Chemical Properties (e.g., Contains tannins, alkaloids)" name="sifatKimia" value={newFlora.sifatKimia} onChange={handleChange} {...inputStyle} />
          <Textarea placeholder="Pest and Disease Vulnerability (e.g., Relatively resistant, Susceptible to...)" name="kerentananPenyakitHama" value={newFlora.kerentananPenyakitHama} onChange={handleChange} {...inputStyle} />

          {/* Metadata and References */}
          <Heading size="md" color="whiteAlpha.800" mt={4}>Metadata dan Referensi</Heading>
          <Box>
            <Input
              placeholder="Scientific Reference (add one by one)"
              value={referensiIlmiahInput}
              onChange={(e) => setReferensiIlmiahInput(e.target.value)}
              {...inputStyle}
            />
            <Button mt={2} onClick={() => handleAddToArray(setNewFlora, setReferensiIlmiahInput, newFlora.referensiIlmiah, referensiIlmiahInput, 5)} size="sm" colorScheme="teal">Add Reference</Button>
            {newFlora.referensiIlmiah.length > 0 && (
              <Text color="grey.900" fontSize="sm" mt={1}>Added: {newFlora.referensiIlmiah.join(', ')}</Text>
            )}
          </Box>
          <Input
            type="date"
            placeholder="Date of Research"
            name="tanggalPenelitian"
            value={newFlora.tanggalPenelitian}
            onChange={handleChange}
            {...inputStyle}
          />
          <Input placeholder="Researcher(s)" name="peneliti" value={newFlora.peneliti} onChange={handleChange} {...inputStyle} />
          <Input placeholder="Observation Location" name="lokasiObservasi" value={newFlora.lokasiObservasi} onChange={handleChange} {...inputStyle} />
          <Textarea placeholder="General Description" name="deskripsi" value={newFlora.deskripsi} onChange={handleChange} {...inputStyle} />
          <Textarea placeholder="Additional Notes" name="catatanTambahan" value={newFlora.catatanTambahan} onChange={handleChange} {...inputStyle} />


          {/* FILE INPUT IMAGE UTAMA */}
          <Box>
            <Text color="whiteAlpha.700" mb={2}>Main Image:</Text>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setNewFlora({ ...newFlora, image: e.target.files[0] })}
              {...inputStyle}
            />
          </Box>

          {/* FILE INPUT GAMBAR LAINNYA */}
          <Box>
            <Text color="whiteAlpha.700" mb={2}>Other Images (Optional):</Text>
            <Input
              type="file"
              accept="image/*"
              multiple // Allow multiple file selection
              onChange={(e) => setUrlGambarLainFiles(Array.from(e.target.files))}
              {...inputStyle}
            />
            {urlGambarLainFiles.length > 0 && (
              <Text color="grey.900" fontSize="sm" mt={1}>Files selected: {urlGambarLainFiles.map(f => f.name).join(', ')}</Text>
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
            loadingText={isUploadingImage ? "Uploading Image(s)..." : "Adding Flora..."}
          >
            Add Flora
          </MotionButton>
        </VStack>
      </MotionBox>
    </Container>
  );
};

export default CreateFloraPage;