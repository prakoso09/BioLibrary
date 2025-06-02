import {
    VStack,
    Container,
    Text,
    SimpleGrid,
    Button,
    Flex,
    useColorModeValue,
    Input,
    Select,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    useDisclosure,
    Spinner,
} from '@chakra-ui/react';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNationalParkStore } from '../store/nationalPark.js';
import NationalParkCard from '../components/NationalParkCard.jsx'; 
import { PlusSquareIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { isLoggedIn } from '../utils/auth'; 

const MotionButton = motion(Button);

const NationalParkPage = () => {
    const accentColor = useColorModeValue('teal.600', 'teal.300');
    const textColor = useColorModeValue('gray.800', 'gray.200');
    const cardBgColor = useColorModeValue('rgb(110, 220, 224)', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const hoverColor = useColorModeValue('gray.50', 'gray.600');
    const navigate = useNavigate();

    const { fetchNationalParks, nationalParks, loadingNationalParks } = useNationalParkStore(); // Ambil state loading
    const [searchTerm, setSearchTerm] = useState("");
    const [searchCategory, setSearchCategory] = useState("namaResmi"); // Default search by namaResmi
    const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);

    // Untuk AlertDialog
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();

    useEffect(() => {
        fetchNationalParks();
        setUserIsLoggedIn(isLoggedIn());
    }, [fetchNationalParks]);

    const handleClickAddNationalPark = () => {
        if (!userIsLoggedIn) {
            onOpen();
        } else {
            navigate('/CreateNationalPark'); 
        }
    };

    // Sort by namaResmi
    const sortedNationalParks = [...nationalParks].sort((a, b) => {
        if (a.namaResmi < b.namaResmi) return -1;
        if (a.namaResmi > b.namaResmi) return 1;
        return 0;
    });

    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    // Filter logic untul national park
    const filteredNationalParks = sortedNationalParks.filter((item) => {
        const value = getNestedValue(item, searchCategory);
        if (Array.isArray(value)) {
            return value.some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()));
        }
        return String(value || '').toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (

        
        <Container maxW="container.xl" minH="100vh" py={8} px={4}>
            <VStack spacing={8}>
                <Text
                    fontSize={{ base: "3xl", md: "4xl", lg: "50" }}
                    fontWeight="bold"
                    bgGradient="linear(to-r, teal.400, cyan.600)"
                    bgClip="text"
                    textAlign="center"
                >
                    National Parks Library ⛰️
                </Text>

                {/* Filter  */}
                <VStack spacing={4} w="full" maxW="500px" margin="auto" p={6}
                    bg={cardBgColor} borderRadius="xl" boxShadow="sm"
                    borderWidth="1px" borderColor={borderColor}>
                    <Flex justify="space-between" align="center" w="full">
                        <Text
                            fontSize="md"
                            fontWeight="semibold"
                            color={accentColor}
                            letterSpacing="wide"
                        >
                            Search by:
                        </Text>
                        <Select
                            value={searchCategory}
                            onChange={(e) => setSearchCategory(e.target.value)}
                            size="sm"
                            width="60%"
                            variant="outline"
                            borderColor={accentColor}
                            focusBorderColor="cyan.500"
                            fontWeight="medium"
                            _hover={{ borderColor: 'teal.500' }}
                        >
                        <option value="namaResmi">Nama Resmi</option>
                        <option value="lokasi">Lokasi</option>
                        <option value="wilayahAdministratif">Wilayah Administratif</option>
                        <option value="koordinatGeografis.lintang">Lintang</option>
                        <option value="koordinatGeografis.bujur">Bujur</option>
                        <option value="luas.value">Nilai Luas</option>
                        <option value="luas.unit">Satuan Luas</option>
                        <option value="luas.referensi">Referensi Luas</option>
                        <option value="ketinggian.min">Ketinggian Min</option>
                        <option value="ketinggian.max">Ketinggian Maks</option>
                        <option value="ketinggian.unit">Satuan Ketinggian</option>
                        <option value="topografi">Topografi</option>
                        <option value="geologi">Geologi</option>
                        <option value="iklim.tipe">Tipe Iklim</option>
                        <option value="iklim.curahHujanRataRata.value">Nilai Curah Hujan Rata-Rata</option>
                        <option value="iklim.curahHujanRataRata.unit">Satuan Curah Hujan Rata-Rata</option>
                        <option value="iklim.suhuRataRata.kakiGunung">Suhu Rata-Rata (Kaki Gunung)</option>
                        <option value="iklim.suhuRataRata.puncak">Suhu Rata-Rata (Puncak)</option>
                        <option value="iklim.kelembabanUdaraRataRata.value">Nilai Kelembaban Udara Rata-Rata</option>
                        <option value="iklim.kelembabanUdaraRataRata.unit">Satuan Kelembaban Udara Rata-Rata</option>
                        <option value="ekosistemHabitat.nama">Nama Habitat</option>
                        <option value="ekosistemHabitat.deskripsi">Deskripsi Habitat</option>
                        <option value="flora.jumlahJenis">Jumlah Jenis Flora</option>
                        <option value="flora.pohonDominan.namaLokal">Pohon Dominan (Nama Lokal)</option>
                        <option value="flora.pohonDominan.namaIlmiah">Pohon Dominan (Nama Ilmiah)</option>
                        <option value="flora.tumbuhanBawahSemak.namaLokal">Tumbuhan Bawah Semak (Nama Lokal)</option>
                        <option value="flora.tumbuhanBawahSemak.namaIlmiah">Tumbuhan Bawah Semak (Nama Ilmiah)</option>
                        <option value="flora.tumbuhanPionir.namaLokal">Tumbuhan Pionir (Nama Lokal)</option>
                        <option value="flora.tumbuhanPionir.namaIlmiah">Tumbuhan Pionir (Nama Ilmiah)</option>
                        <option value="flora.tumbuhanKhasEndemik.namaLokal">Tumbuhan Khas Endemik (Nama Lokal)</option>
                        <option value="flora.tumbuhanKhasEndemik.namaIlmiah">Tumbuhan Khas Endemik (Nama Ilmiah)</option>
                        <option value="fauna.jumlahJenis.burung">Jumlah Jenis Burung</option>
                        <option value="fauna.jumlahJenis.mamalia">Jumlah Jenis Mamalia</option>
                        <option value="fauna.jumlahJenis.reptil">Jumlah Jenis Reptil</option>
                        <option value="fauna.jumlahJenis.amfibi">Jumlah Jenis Amfibi</option>
                        <option value="fauna.mamalia.kategori">Kategori Mamalia</option>
                        <option value="fauna.mamalia.jenis.namaLokal">Jenis Mamalia (Nama Lokal)</option>
                        <option value="fauna.mamalia.jenis.namaIlmiah">Jenis Mamalia (Nama Ilmiah)</option>
                        <option value="fauna.burung.kategori">Kategori Burung</option>
                        <option value="fauna.burung.jenis.namaLokal">Jenis Burung (Nama Lokal)</option>
                        <option value="fauna.burung.jenis.namaIlmiah">Jenis Burung (Nama Ilmiah)</option>
                        <option value="sejarahSingkat">Sejarah Singkat</option>
                        <option value="aktivitasPengelolaan.nama">Nama Aktivitas Pengelolaan</option>
                        <option value="aktivitasPengelolaan.deskripsi">Deskripsi Aktivitas Pengelolaan</option>
                        <option value="aktivitasPengelolaan.detail">Detail Aktivitas Pengelolaan</option>
                        <option value="fasilitasPendukung">Fasilitas Pendukung</option>
                        <option value="ancamanKonservasi">Ancaman Konservasi</option>
                        <option value="upayaKonservasi">Upaya Konservasi</option>
                        </Select>
                    </Flex>

                    <Input
                        placeholder={`Search by ${searchCategory.replace(/([A-Z])/g, ' $1').replace(/\./g, ' ').replace('koordinatGeografis ', '').replace('luas ', '').replace('ketinggian ', '').replace('iklim ', '').replace('ekosistemHabitat ', '').replace('flora ', '').replace('fauna ', '').replace('aktivitasPengelolaan ', '').replace('jumlahJenis ', '')}`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        size="sm"
                        variant="outline"
                        borderColor={accentColor}
                        focusBorderColor="cyan.500"
                        fontSize="sm"
                        fontWeight="medium"
                        _hover={{ borderColor: 'teal.500' }}
                        _placeholder={{ color: 'gray.500' }}
                    />

                    <Flex justifyContent="center" alignItems="center" w="full" gap={3} pt={2}>
                        <Text fontSize="md" color={textColor}>
                            Want to contribute to the National Park collection?
                        </Text>
                        <MotionButton
                            onClick={handleClickAddNationalPark}
                            leftIcon={<PlusSquareIcon fontSize={20} color="white" />}
                            bgGradient="linear(to-r, teal.500, cyan.600)"
                            color="white"
                            size="sm"
                            w = "200px"
                            rounded="full"
                            boxShadow="md"
                            _hover={{
                                bgGradient: 'linear(to-r, cyan.500, blue.500)',
                            }}
                            whileHover={{
                                scale: 1.05,
                                boxShadow: 'lg',
                            }}
                            transition={{ duration: 0.2 }}
                        >
                            Add National Park
                        </MotionButton>
                    </Flex>
                </VStack>

                {loadingNationalParks ? ( // Tampilkan spinner saat loading
                    <Flex justify="center" align="center" minH="30vh">
                        <Spinner size="xl" color={accentColor} />
                    </Flex>
                ) : (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
                        {filteredNationalParks.map((item) => (
                            <NationalParkCard key={item._id} nationalPark={item} />
                        ))}
                    </SimpleGrid>
                )}

                {filteredNationalParks.length === 0 && !loadingNationalParks && ( 
                    <VStack spacing={4} p={8} bg={cardBgColor} borderRadius="xl"
                        borderWidth="1px" borderColor={borderColor} w="full" maxW="2xl">
                        <Text fontSize="xl" fontWeight="bold" textAlign="center" color="gray.500">
                            No national parks found 😔
                        </Text>
                        <Button
                            onClick={handleClickAddNationalPark}
                            variant="outline"
                            colorScheme="teal"
                            leftIcon={<PlusSquareIcon />}
                            _hover={{ bg: hoverColor }}
                        >
                            Add a National Park
                        </Button>
                    </VStack>
                )}
            </VStack>

            {/* AlertDialog untuk user yg belum login */}
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent bg={cardBgColor}>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold" color={textColor}>
                            Login Required
                        </AlertDialogHeader>

                        <AlertDialogBody color={textColor}>
                            You need to log in first to be able to add national park data.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose} mr={3}>
                                Cancel
                            </Button>
                            <Button
                                colorScheme="teal"
                                onClick={() => { navigate('/Login'); onClose(); }}
                                bgGradient="linear(to-r, teal.500, cyan.600)"
                                color="white"
                            >
                                Log In Now
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Container>

    );
};

export default NationalParkPage;