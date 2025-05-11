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
  Select,
  Textarea, // Tambahkan Textarea untuk deskripsi panjang
  SimpleGrid, // Untuk tata letak yang lebih rapi
} from '@chakra-ui/react';
import { useFaunaStore } from '../store/fauna';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import axios from 'axios';

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const CreateFaunaPage = () => {
  const [newFauna, setNewFauna] = React.useState({
    namaIlmiah: "",
    namaLokal: "",
    namaUmumLain: "",
    image: null,
    klasifikasiIlmiah: {
      kingdom: "Animalia",
      filum: "",
      kelas: "",
      ordo: "",
      famili: "",
      subfamili: "",
      genus: "",
      spesies: "",
      subspesies: [],
    },
    habitat: "",
    sebaranGeografis: "",
    iklim: "",
    ukuranTubuh: {
      panjangTubuh: "",
      panjangEkor: "",
      tinggiBahu: "",
      lebarSayap: "",
      beratBadan: "",
    },
    polaMakan: "",
    makananUtama: "",
    caraBergerak: "",
    reproduksi: {
      kematanganSeksual: "",
      masaKehamilan: "",
      jumlahAnak: "",
      warnaBayi: "",
      perawatanAnak: "",
      tempatBertelur: "",
      fekunditasTinggi: "",
      perkembangan: "",
    },
    usiaRataRata: "",
    perilaku: {
      aktivitas: "",
      sosial: "",
      komunikasi: "",
      perilakuLain: "",
      pertahanan: "",
      peranEkologis: "",
    },
    statusKepunahan: {
      statusIUCNGlobal: "",
      ancaman: [],
      upayaKonservasi: [],
      alasan: "",
      manajemenKonflik: "",
      invasiIntroduksi: "",
    },
    deskripsi: "",
  });

  const [ancamanInput, setAncamanInput] = React.useState("");
  const [upayaKonservasiInput, setUpayaKonservasiInput] = React.useState("");
  const [subspesiesNameInput, setSubspesiesNameInput] = React.useState("");
  const [subspesiesDeskripsiInput, setSubspesiesDeskripsiInput] = React.useState("");

  const toast = useToast();
  const navigate = useNavigate();
  const { createFauna } = useFaunaStore();

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

  const handleAddToArray = (setter, inputSetter, currentState, inputName, limit = 6) => {
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
      setter(prev => [...prev, inputName.trim()]);
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


  const handleAddAncaman = () => {
    setNewFauna(prev => ({
      ...prev,
      statusKepunahan: {
        ...prev.statusKepunahan,
        ancaman: [...prev.statusKepunahan.ancaman, ancamanInput.trim()]
      }
    }));
    setAncamanInput("");
  };

  const handleAddUpayaKonservasi = () => {
    setNewFauna(prev => ({
      ...prev,
      statusKepunahan: {
        ...prev.statusKepunahan,
        upayaKonservasi: [...prev.statusKepunahan.upayaKonservasi, upayaKonservasiInput.trim()]
      }
    }));
    setUpayaKonservasiInput("");
  };

  const handleAddSubspesies = () => {
    if (subspesiesNameInput.trim() === "") {
      toast({
        title: "Input Kosong",
        description: "Nama subspesies tidak boleh kosong.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    setNewFauna({
      ...newFauna,
      klasifikasiIlmiah: {
        ...newFauna.klasifikasiIlmiah,
        subspesies: [...newFauna.klasifikasiIlmiah.subspesies, { nama: subspesiesNameInput.trim(), deskripsi: subspesiesDeskripsiInput.trim() }]
      }
    });
    setSubspesiesNameInput("");
    setSubspesiesDeskripsiInput("");
  };

  const handleAddFauna = async () => {
    if (!newFauna.image) {
      toast({
        title: "Error",
        description: "Harap pilih gambar untuk diunggah.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsUploadingImage(true);
    let imageUrl = '';

    try {
      const formDataCloudinary = new FormData();
      formDataCloudinary.append('file', newFauna.image);
      formDataCloudinary.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const cloudinaryAxios = axios.create();
      delete cloudinaryAxios.defaults.headers.common['Authorization'];

      const cloudinaryResponse = await cloudinaryAxios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formDataCloudinary,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      imageUrl = cloudinaryResponse.data.secure_url;

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

    const faunaDataToSend = {
      ...newFauna,
      image: imageUrl,
    };

    try {
      const { success, message } = await createFauna(faunaDataToSend);

      if (!success) {
        toast({ title: "Error", description: message, status: "error", duration: 3000, isClosable: true });
      } else {
        toast({ title: "Sukses", description: message, status: "success", duration: 3000, isClosable: true });
        setNewFauna({
          namaIlmiah: "",
          namaLokal: "",
          namaUmumLain: "",
          image: null,
          klasifikasiIlmiah: {
            kingdom: "Animalia",
            filum: "",
            kelas: "",
            ordo: "",
            famili: "",
            subfamili: "",
            genus: "",
            spesies: "",
            subspesies: [],
          },
          habitat: "",
          sebaranGeografis: "",
          iklim: "",
          ukuranTubuh: {
            panjangTubuh: "",
            panjangEkor: "",
            tinggiBahu: "",
            lebarSayap: "",
            beratBadan: "",
          },
          polaMakan: "",
          makananUtama: "",
          caraBergerak: "",
          reproduksi: {
            kematanganSeksual: "",
            masaKehamilan: "",
            jumlahAnak: "",
            warnaBayi: "",
            perawatanAnak: "",
            tempatBertelur: "",
            fekunditasTinggi: "",
            perkembangan: "",
          },
          usiaRataRata: "",
          perilaku: {
            aktivitas: "",
            sosial: "",
            komunikasi: "",
            perilakuLain: "",
            pertahanan: "",
            peranEkologis: "",
          },
          statusKepunahan: {
            statusIUCNGlobal: "",
            ancaman: [],
            upayaKonservasi: [],
            alasan: "",
            manajemenKonflik: "",
            invasiIntroduksi: "",
          },
          deskripsi: "",
        });
        setAncamanInput("");
        setUpayaKonservasiInput("");
        setSubspesiesNameInput("");
        setSubspesiesDeskripsiInput("");
        navigate('/Fauna');
      }
    } catch (error) {
      toast({
        title: "Gagal",
        description: error.message || "Terjadi kesalahan saat membuat fauna.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error("Error creating fauna via store action:", error);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleGoBack = () => {
    navigate('/Fauna');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setNewFauna(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setNewFauna({ ...newFauna, [name]: value });
    }
  };

  return (
    <Container maxW="container.md" mt={10}>
      <Flex mb={8} align="center">
        <IconButton
          icon={<ArrowLeftIcon />}
          aria-label="Kembali ke Fauna"
          onClick={handleGoBack}
          variant="ghost"
          size="lg"
          borderRadius="full"
          _hover={{ bg: useColorModeValue('gray.200', 'whiteAlpha.200') }}
        />
        <Heading as="h1" size="2xl" textAlign="center" ml={4} color="white">
          Tambah Fauna Baru
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
        <VStack spacing={5}>
          <Input placeholder="Nama Ilmiah" name="namaIlmiah" value={newFauna.namaIlmiah} onChange={handleChange} {...inputStyle} />
          <Input placeholder="Nama Lokal" name="namaLokal" value={newFauna.namaLokal} onChange={handleChange} {...inputStyle} />
          <Input placeholder="Nama Umum Lain" name="namaUmumLain" value={newFauna.namaUmumLain} onChange={handleChange} {...inputStyle} />

          <Text fontWeight="bold" color={useColorModeValue('gray.700', 'gray.200')} mt={4}>Klasifikasi Ilmiah</Text>
          <Input placeholder="Kingdom" name="klasifikasiIlmiah.kingdom" value={newFauna.klasifikasiIlmiah.kingdom} onChange={handleChange} {...inputStyle} disabled />
          <Input placeholder="Filum" name="klasifikasiIlmiah.filum" value={newFauna.klasifikasiIlmiah.filum} onChange={handleChange} {...inputStyle} />
          <Input placeholder="Kelas" name="klasifikasiIlmiah.kelas" value={newFauna.klasifikasiIlmiah.kelas} onChange={handleChange} {...inputStyle} />
          <Input placeholder="Ordo" name="klasifikasiIlmiah.ordo" value={newFauna.klasifikasiIlmiah.ordo} onChange={handleChange} {...inputStyle} />
          <Input placeholder="Famili" name="klasifikasiIlmiah.famili" value={newFauna.klasifikasiIlmiah.famili} onChange={handleChange} {...inputStyle} />
          <Input placeholder="Subfamili" name="klasifikasiIlmiah.subfamili" value={newFauna.klasifikasiIlmiah.subfamili} onChange={handleChange} {...inputStyle} />
          <Input placeholder="Genus" name="klasifikasiIlmiah.genus" value={newFauna.klasifikasiIlmiah.genus} onChange={handleChange} {...inputStyle} />
          <Input placeholder="Spesies" name="klasifikasiIlmiah.spesies" value={newFauna.klasifikasiIlmiah.spesies} onChange={handleChange} {...inputStyle} />

          <Text fontWeight="bold" color={useColorModeValue('gray.700', 'gray.200')} mt={4}>Subspesies</Text>
          <Input placeholder="Nama Subspesies" value={subspesiesNameInput} onChange={(e) => setSubspesiesNameInput(e.target.value)} {...inputStyle} />
          <Input placeholder="Deskripsi Subspesies" value={subspesiesDeskripsiInput} onChange={(e) => setSubspesiesDeskripsiInput(e.target.value)} {...inputStyle} />
          <Button onClick={handleAddSubspesies} size="sm" colorScheme="teal">Tambah Subspesies</Button>
          {newFauna.klasifikasiIlmiah.subspesies.length > 0 && (
            <VStack align="start" spacing={1} w="full">
              <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>Subspesies Ditambahkan:</Text>
              {newFauna.klasifikasiIlmiah.subspesies.map((sub, index) => (
                <Text key={index} fontSize="sm" color={useColorModeValue('gray.800', 'gray.300')}>
                  {sub.nama} ({sub.deskripsi})
                </Text>
              ))}
            </VStack>
          )}

          <Input placeholder="Habitat" name="habitat" value={newFauna.habitat} onChange={handleChange} {...inputStyle} />
          <Input placeholder="Sebaran Geografis" name="sebaranGeografis" value={newFauna.sebaranGeografis} onChange={handleChange} {...inputStyle} />
          <Input placeholder="Iklim" name="iklim" value={newFauna.iklim} onChange={handleChange} {...inputStyle} />

          <Text fontWeight="bold" color={useColorModeValue('gray.700', 'gray.200')} mt={4}>Ukuran Tubuh</Text>
          <Input placeholder="Panjang Tubuh" name="ukuranTubuh.panjangTubuh" value={newFauna.ukuranTubuh.panjangTubuh} onChange={handleChange} {...inputStyle} />
          <Input placeholder="Panjang Ekor" name="ukuranTubuh.panjangEkor" value={newFauna.ukuranTubuh.panjangEkor} onChange={handleChange} {...inputStyle} />
          <Input placeholder="Tinggi Bahu" name="ukuranTubuh.tinggiBahu" value={newFauna.ukuranTubuh.tinggiBahu} onChange={handleChange} {...inputStyle} />
          <Input placeholder="Lebar Sayap" name="ukuranTubuh.lebarSayap" value={newFauna.ukuranTubuh.lebarSayap} onChange={handleChange} {...inputStyle} />
          <Input placeholder="Berat Badan" name="ukuranTubuh.beratBadan" value={newFauna.ukuranTubuh.beratBadan} onChange={handleChange} {...inputStyle} />

          <Select placeholder="Pola Makan" name="polaMakan" value={newFauna.polaMakan} onChange={handleChange} {...inputStyle}>
            <option value="Herbivora">Herbivora</option>
            <option value="Karnivora">Karnivora</option>
            <option value="Omnivora">Omnivora</option>
            <option value="Frugivora">Frugivora</option>
            <option value="Folivora">Folivora</option>
            {/* Tambahkan opsi lain sesuai kebutuhan */}
          </Select>
          <Input placeholder="Makanan Utama" name="makananUtama" value={newFauna.makananUtama} onChange={handleChange} {...inputStyle} />
          <Input placeholder="Cara Bergerak" name="caraBergerak" value={newFauna.caraBergerak} onChange={handleChange} {...inputStyle} />

          <Text fontWeight="bold" color={useColorModeValue('gray.700', 'gray.200')} mt={4}>Reproduksi</Text>
          <Input placeholder="Kematangan Seksual" name="reproduksi.kematanganSeksual" value={newFauna.reproduksi.kematanganSeksual} onChange={handleChange} {...inputStyle} />
          <Input placeholder="Masa Kehamilan" name="reproduksi.masaKehamilan" value={newFauna.reproduksi.masaKehamilan} onChange={handleChange} {...inputStyle} />
          <Input placeholder="Jumlah Anak" name="reproduksi.jumlahAnak" value={newFauna.reproduksi.jumlahAnak} onChange={handleChange} {...inputStyle} />
          <Input placeholder="Warna Bayi" name="reproduksi.warnaBayi" value={newFauna.reproduksi.warnaBayi} onChange={handleChange} {...inputStyle} />
          <Input placeholder="Perawatan Anak" name="reproduksi.perawatanAnak" value={newFauna.reproduksi.perawatanAnak} onChange={handleChange} {...inputStyle} />
          <Input placeholder="Tempat Bertelur" name="reproduksi.tempatBertelur" value={newFauna.reproduksi.tempatBertelur} onChange={handleChange} {...inputStyle} />
          <Input placeholder="Fekunditas Tinggi" name="reproduksi.fekunditasTinggi" value={newFauna.reproduksi.fekunditasTinggi} onChange={handleChange} {...inputStyle} />
          <Input placeholder="Perkembangan" name="reproduksi.perkembangan" value={newFauna.reproduksi.perkembangan} onChange={handleChange} {...inputStyle} />

          <Input placeholder="Usia Rata-Rata" name="usiaRataRata" value={newFauna.usiaRataRata} onChange={handleChange} {...inputStyle} />

          <Text fontWeight="bold" color={useColorModeValue('gray.700', 'gray.200')} mt={4}>Perilaku</Text>
          <Select placeholder="Pola Aktivitas" name="perilaku.aktivitas" value={newFauna.perilaku.aktivitas} onChange={handleChange} {...inputStyle}>
            <option value="Diurnal">Diurnal</option>
            <option value="Nokturnal">Nokturnal</option>
            <option value="Krepuskular">Krepuskular</option>
            {/* Tambahkan opsi lain sesuai kebutuhan */}
          </Select>
          <Input placeholder="Perilaku Sosial" name="perilaku.sosial" value={newFauna.perilaku.sosial} onChange={handleChange} {...inputStyle} />
          <Input placeholder="Komunikasi" name="perilaku.komunikasi" value={newFauna.perilaku.komunikasi} onChange={handleChange} {...inputStyle} />
          <Input placeholder="Perilaku Lain" name="perilaku.perilakuLain" value={newFauna.perilaku.perilakuLain} onChange={handleChange} {...inputStyle} />
          <Input placeholder="Mekanisme Pertahanan" name="perilaku.pertahanan" value={newFauna.perilaku.pertahanan} onChange={handleChange} {...inputStyle} />
          <Input placeholder="Peran Ekologis" name="perilaku.peranEkologis" value={newFauna.perilaku.peranEkologis} onChange={handleChange} {...inputStyle} />

          <Text fontWeight="bold" color={useColorModeValue('gray.700', 'gray.200')} mt={4}>Status Kepunahan</Text>
          <Input placeholder="Status IUCN Global" name="statusKepunahan.statusIUCNGlobal" value={newFauna.statusKepunahan.statusIUCNGlobal} onChange={handleChange} {...inputStyle} />
          <Input placeholder="Tambahkan Ancaman" value={ancamanInput} onChange={(e) => setAncamanInput(e.target.value)} {...inputStyle} />
          <Button onClick={() => handleAddToArray((val) => setNewFauna(prev => ({ ...prev, statusKepunahan: { ...prev.statusKepunahan, ancaman: val } })), setAncamanInput, newFauna.statusKepunahan.ancaman, ancamanInput)} size="sm" colorScheme="teal">Tambah Ancaman</Button>
          {newFauna.statusKepunahan.ancaman.length > 0 && (
            <Text color={useColorModeValue('gray.800', 'gray.300')}>Ancaman: {newFauna.statusKepunahan.ancaman.join(', ')}</Text>
          )}

          <Input placeholder="Tambahkan Upaya Konservasi" value={upayaKonservasiInput} onChange={(e) => setUpayaKonservasiInput(e.target.value)} {...inputStyle} />
          <Button onClick={() => handleAddToArray((val) => setNewFauna(prev => ({ ...prev, statusKepunahan: { ...prev.statusKepunahan, upayaKonservasi: val } })), setUpayaKonservasiInput, newFauna.statusKepunahan.upayaKonservasi, upayaKonservasiInput)} size="sm" colorScheme="teal">Tambah Upaya Konservasi</Button>
          {newFauna.statusKepunahan.upayaKonservasi.length > 0 && (
            <Text color={useColorModeValue('gray.800', 'gray.300')}>Upaya Konservasi: {newFauna.statusKepunahan.upayaKonservasi.join(', ')}</Text>
          )}
          <Input placeholder="Alasan Status IUCN" name="statusKepunahan.alasan" value={newFauna.statusKepunahan.alasan} onChange={handleChange} {...inputStyle} />
          <Input placeholder="Manajemen Konflik" name="statusKepunahan.manajemenKonflik" value={newFauna.statusKepunahan.manajemenKonflik} onChange={handleChange} {...inputStyle} />
          <Input placeholder="Invasi/Introduksi" name="statusKepunahan.invasiIntroduksi" value={newFauna.statusKepunahan.invasiIntroduksi} onChange={handleChange} {...inputStyle} />

          <Textarea placeholder="Deskripsi" name="deskripsi" value={newFauna.deskripsi} onChange={handleChange} {...inputStyle} />

          {/* FILE INPUT IMAGE */}
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setNewFauna({ ...newFauna, image: e.target.files[0] })}
            {...inputStyle}
          />

          <MotionButton
            onClick={handleAddFauna}
            w="full"
            {...buttonStyle}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            isLoading={isUploadingImage || createFauna.loading}
            loadingText={isUploadingImage ? "Mengunggah Gambar..." : "Menambahkan Fauna..."}
          >
            Tambah Fauna
          </MotionButton>
        </VStack>
      </MotionBox>
    </Container>
  );
};

export default CreateFaunaPage;