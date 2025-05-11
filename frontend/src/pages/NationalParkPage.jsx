// pages/NationalParkPage.jsx
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
    Spinner, // Tambahkan Spinner untuk loading state
} from '@chakra-ui/react';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNationalParkStore } from '../store/nationalPark.js'; // Pastikan ini diimpor
import NationalParkCard from '../components/NationalParkCard.jsx'; // Asumsi Anda punya komponen Card
import { PlusSquareIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { isLoggedIn } from '../utils/auth'; // Pastikan ini diimpor

const MotionButton = motion(Button);

const NationalParkPage = () => {
    const accentColor = useColorModeValue('teal.600', 'teal.300');
    const textColor = useColorModeValue('gray.800', 'gray.200');
    const cardBgColor = useColorModeValue('rgb(110, 220, 224)', 'gray.800'); // Sesuaikan jika ingin warna lain
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
            navigate('/CreateNationalPark'); // Sesuaikan rute untuk membuat Taman Nasional
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

    // Filter logic for national parks
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

                {/* Filter Section */}
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
                            <option value="namaResmi">Official Name</option>
                            <option value="lokasi">Location</option>
                            <option value="wilayahAdministratif">Administrative Region</option>
                            <option value="koordinatGeografis.lintang">Latitude</option>
                            <option value="koordinatGeografis.bujur">Longitude</option>
                            <option value="luas.value">Area Value</option>
                            <option value="luas.unit">Area Unit</option>
                            <option value="luas.referensi">Area Reference</option>
                            <option value="ketinggian.min">Min Altitude</option>
                            <option value="ketinggian.max">Max Altitude</option>
                            <option value="ketinggian.unit">Altitude Unit</option>
                            <option value="topografi">Topography</option>
                            <option value="geologi">Geology</option>
                            <option value="iklim.tipe">Climate Type</option>
                            <option value="iklim.curahHujanRataRata.value">Avg Rainfall Value</option>
                            <option value="iklim.curahHujanRataRata.unit">Avg Rainfall Unit</option>
                            <option value="iklim.suhuRataRata.kakiGunung">Avg Temp (Foothills)</option>
                            <option value="iklim.suhuRataRata.puncak">Avg Temp (Peak)</option>
                            <option value="iklim.kelembabanUdaraRataRata.value">Avg Humidity Value</option>
                            <option value="iklim.kelembabanUdaraRataRata.unit">Avg Humidity Unit</option>
                            <option value="ekosistemHabitat.nama">Habitat Name</option>
                            <option value="ekosistemHabitat.deskripsi">Habitat Description</option>
                            <option value="flora.jumlahJenis">Flora Species Count</option>
                            <option value="flora.pohonDominan.namaLokal">Dominant Tree (Local Name)</option>
                            <option value="flora.pohonDominan.namaIlmiah">Dominant Tree (Scientific Name)</option>
                            <option value="flora.tumbuhanBawahSemak.namaLokal">Undergrowth Plant (Local Name)</option>
                            <option value="flora.tumbuhanBawahSemak.namaIlmiah">Undergrowth Plant (Scientific Name)</option>
                            <option value="flora.tumbuhanPionir.namaLokal">Pioneer Plant (Local Name)</option>
                            <option value="flora.tumbuhanPionir.namaIlmiah">Pioneer Plant (Scientific Name)</option>
                            <option value="flora.tumbuhanKhasEndemik.namaLokal">Endemic Plant (Local Name)</option>
                            <option value="flora.tumbuhanKhasEndemik.namaIlmiah">Endemic Plant (Scientific Name)</option>
                            <option value="fauna.jumlahJenis.burung">Bird Species Count</option>
                            <option value="fauna.jumlahJenis.mamalia">Mammal Species Count</option>
                            <option value="fauna.jumlahJenis.reptil">Reptile Species Count</option>
                            <option value="fauna.jumlahJenis.amfibi">Amphibian Species Count</option>
                            <option value="fauna.mamalia.kategori">Mammal Category</option>
                            <option value="fauna.mamalia.jenis.namaLokal">Mammal Species (Local Name)</option>
                            <option value="fauna.mamalia.jenis.namaIlmiah">Mammal Species (Scientific Name)</option>
                            <option value="fauna.burung.kategori">Bird Category</option>
                            <option value="fauna.burung.jenis.namaLokal">Bird Species (Local Name)</option>
                            <option value="fauna.burung.jenis.namaIlmiah">Bird Species (Scientific Name)</option>
                            <option value="sejarahSingkat">Brief History</option>
                            <option value="aktivitasPengelolaan.nama">Management Activity Name</option>
                            <option value="aktivitasPengelolaan.deskripsi">Management Activity Description</option>
                            <option value="aktivitasPengelolaan.detail">Management Activity Detail</option>
                            <option value="fasilitasPendukung">Supporting Facilities</option>
                            <option value="ancamanKonservasi">Conservation Threats</option>
                            <option value="upayaKonservasi">Conservation Efforts</option>
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
                            // Pastikan NationalParkCard menerima prop yang sesuai
                            <NationalParkCard key={item._id} nationalPark={item} />
                        ))}
                    </SimpleGrid>
                )}

                {filteredNationalParks.length === 0 && !loadingNationalParks && ( // Tampilkan pesan jika tidak ada hasil dan tidak sedang loading
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

            {/* AlertDialog for non-logged-in users */}
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