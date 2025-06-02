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
} from '@chakra-ui/react';
import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFloraStore } from '../store/flora.js';
import FloraCard from '../components/FloraCard.jsx';
import { PlusSquareIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { isLoggedIn } from '../utils/auth';

const MotionButton = motion(Button);

const FloraPage = () => {
    const accentColor = useColorModeValue('teal.600', 'teal.300');
    const textColor = useColorModeValue('gray.800', 'gray.200');
    const bgColor = useColorModeValue('white', 'gray.800');
    const cardBgColor = useColorModeValue('rgb(110, 220, 224)', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const hoverColor = useColorModeValue('gray.50', 'gray.600');
    const navigate = useNavigate();

    const { fetchFlora, flora } = useFloraStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchCategory, setSearchCategory] = useState("namaLokal"); 
    const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
    const [userLoggedInGmail, setUserLoggedInGmail] = useState(null); 
    

    // Untuk AlertDialog
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();

    useEffect(() => {
        fetchFlora();
        setUserIsLoggedIn(isLoggedIn());
        setUserLoggedInGmail(isLoggedIn());
    }, [fetchFlora]);

    const handleClickAddFlora = () => {
        if (!userIsLoggedIn) {
            onOpen();
        } else {
            navigate('/CreateFlora');
        }
    };

    const sortedFlora = [...flora].sort((a, b) => {
        if (a.namaLokal < b.namaLokal) return -1;
        if (a.namaLokal > b.namaLokal) return 1;
        return 0;
    });

    const filteredFlora = sortedFlora.filter((item) => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        let valueToSearch = item[searchCategory];

        // Handle array fields
        if (Array.isArray(valueToSearch)) {
            return valueToSearch.some(val => val.toLowerCase().includes(lowerCaseSearchTerm));
        }
        // Handle nested objects untuk morphology
        if (searchCategory.startsWith("morfologiBunga.")) {
            const field = searchCategory.split(".")[1];
            valueToSearch = item.morfologiBunga?.[field];
        } else if (searchCategory.startsWith("morfologiBuah.")) {
            const field = searchCategory.split(".")[1];
            valueToSearch = item.morfologiBuah?.[field];
        } else if (searchCategory.startsWith("morfologiBiji.")) {
            const field = searchCategory.split(".")[1];
            if (field === "mekanismePenyebaranBiji") {
                valueToSearch = item.morfologiBiji?.[field];
                if (Array.isArray(valueToSearch)) {
                    return valueToSearch.some(val => val.toLowerCase().includes(lowerCaseSearchTerm));
                }
            } else {
                valueToSearch = item.morfologiBiji?.[field];
            }
        }

        return valueToSearch?.toLowerCase().includes(lowerCaseSearchTerm);
    });

    return (
        <Container maxW="container.xl"  minH="100vh" py={8} px={4}>
            <VStack spacing={8}>
                <Text
                    fontSize={{ base: "3xl", md: "4xl", lg: "50" }}
                    fontWeight="bold"
                    bgGradient="linear(to-r, teal.400, cyan.600)"
                    bgClip="text"
                    textAlign="center"
                >
                    Flora Library 🍀
                </Text>

                {/* Filter */}
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
                        <option value="namaIlmiah">Nama Ilmiah</option>
                        <option value="namaIlmiahLengkap">Nama Ilmiah Lengkap</option>
                        <option value="namaLokal">Nama Lokal</option>
                        <option value="namaLokalLain">Nama Lokal Lain</option>
                        <option value="namaKeluarga">Nama Keluarga</option>
                        <option value="kingdom">Kingdom</option>
                        <option value="divisi">Divisi</option>
                        <option value="kelas">Kelas</option>
                        <option value="ordo">Ordo</option>
                        <option value="famili">Famili</option>
                        <option value="genus">Genus</option>
                        <option value="spesies">Spesies</option>
                        <option value="varietas">Varietas</option>
                        <option value="jenisTumbuhan">Jenis Tumbuhan</option>
                        <option value="tipePertumbuhan">Tipe Pertumbuhan</option>
                        <option value="kategoriFungsional">Kategori Fungsional</option>
                        <option value="tinggiMaksimal">Tinggi Maksimal</option>
                        <option value="diameterBatangMaksimal">Diameter Batang Maksimal</option>
                        <option value="deskripsiBatang">Deskripsi Batang</option>
                        <option value="deskripsiKulitBatang">Deskripsi Kulit Batang</option>
                        <option value="deskripsiCabang">Deskripsi Cabang</option>
                        <option value="bentukTajuk">Bentuk Tajuk</option>
                        <option value="jenisDaunSejati">Jenis Daun Sejati</option>
                        <option value="deskripsiDaunSejati">Deskripsi Daun Sejati</option>
                        <option value="jenisRantingFotosintetik">Jenis Ranting Fotosintetik</option>
                        <option value="deskripsiRantingFotosintetik">Deskripsi Ranting Fotosintetik</option>
                        <option value="tipeSistemPerakaran">Tipe Sistem Perakaran</option>
                        <option value="deskripsiSistemPerakaran">Deskripsi Sistem Perakaran</option>
                        <option value="morfologiBunga.tipeKelamin">Tipe Kelamin Bunga</option>
                        <option value="morfologiBunga.deskripsiBungaJantan">Deskripsi Bunga Jantan</option>
                        <option value="morfologiBunga.deskripsiBungaBetina">Deskripsi Bunga Betina</option>
                        <option value="morfologiBunga.waktuBerbunga">Waktu Berbunga</option>
                        <option value="morfologiBunga.warnaBunga">Warna Bunga</option>
                        <option value="morfologiBuah.tipeBuah">Tipe Buah</option>
                        <option value="morfologiBuah.deskripsiBuah">Deskripsi Buah</option>
                        <option value="morfologiBuah.ukuranBuah">Ukuran Buah</option>
                        <option value="morfologiBuah.warnaBuah">Warna Buah</option>
                        <option value="morfologiBuah.waktuBerbuah">Waktu Berbuah</option>
                        <option value="morfologiBiji.deskripsiBiji">Deskripsi Biji</option>
                        <option value="morfologiBiji.ukuranBiji">Ukuran Biji</option>
                        <option value="morfologiBiji.warnaBiji">Warna Biji</option>
                        <option value="morfologiBiji.bentukBiji">Bentuk Biji</option>
                        <option value="morfologiBiji.mekanismePenyebaranBiji">Mekanisme Penyebaran Biji</option>
                        <option value="metodeReproduksi">Metode Reproduksi</option>
                        <option value="musimTumbuhOptimal">Musim Tumbuh Optimal</option>
                        <option value="habitatAlami">Habitat Alami</option>
                        <option value="kondisiTanahIdeal">Kondisi Tanah Ideal</option>
                        <option value="pHTanahOptimal">pH Tanah Optimal</option>
                        <option value="drainaseTanahIdeal">Drainase Tanah Ideal</option>
                        <option value="kondisiIklimOptimal">Kondisi Iklim Optimal</option>
                        <option value="toleransiKekeringan">Toleransi Kekeringan</option>
                        <option value="toleransiSalinitas">Toleransi Salinitas</option>
                        <option value="toleransiAngin">Toleransi Angin</option>
                        <option value="toleransiSuhu">Toleransi Suhu</option>
                        <option value="sebaranGeografis">Sebaran Geografis</option>
                        <option value="ketinggianOptimal">Ketinggian Optimal</option>
                        <option value="lajuPertumbuhan">Laju Pertumbuhan</option>
                        <option value="kegunaanUtama">Kegunaan Utama</option>
                        <option value="deskripsiKegunaan">Deskripsi Kegunaan</option>
                        <option value="komponenBioaktif">Komponen Bioaktif</option>
                        <option value="potensiAncamanInvasif">Potensi Ancaman Invasif</option>
                        <option value="statusKonservasi">Status Konservasi</option>
                        <option value="sumberDataStatusKonservasi">Sumber Data Status Konservasi</option>
                        <option value="nilaiEkologis">Nilai Ekologis</option>
                        <option value="sifatKimia">Sifat Kimia</option>
                        <option value="kerentananPenyakitHama">Kerentanan Penyakit & Hama</option>
                        <option value="referensiIlmiah">Referensi Ilmiah</option>
                        <option value="peneliti">Peneliti</option>
                        <option value="lokasiObservasi">Lokasi Observasi</option>
                        <option value="deskripsi">Deskripsi</option>
                        <option value="catatanTambahan">Catatan Tambahan</option>
                        </Select>
                    </Flex>

                    <Input
                        placeholder={`Search ${searchCategory.replace(/([A-Z])/g, ' $1')}`}
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
                            Want to contribute to the flora collection?
                        </Text>
                        <MotionButton
                            onClick={handleClickAddFlora}
                            leftIcon={<PlusSquareIcon fontSize={20} color="white" />}
                            bgGradient="linear(to-r, teal.500, cyan.600)"
                            color="white"
                            size="sm"
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
                            Add Flora
                        </MotionButton>
                    </Flex>
                </VStack>

                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
                    {filteredFlora.map((item) => (
                        <FloraCard key={item._id} flora={item} />
                    ))}
                </SimpleGrid>

                {filteredFlora.length === 0 && (
                    <VStack spacing={4} p={8} bg={cardBgColor} borderRadius="xl" 
                        borderWidth="1px" borderColor={borderColor} w="full" maxW="2xl">
                        <Text fontSize="xl" fontWeight="bold" textAlign="center" color="gray.500">
                            No flora found 😔
                        </Text>
                        <Button 
                            onClick={handleClickAddFlora}
                            variant="outline"
                            colorScheme="teal"
                            leftIcon={<PlusSquareIcon />}
                            _hover={{ bg: hoverColor }}
                        >
                            Add a Flora
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
                            You need to log in first to be able to add flora data.
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

export default FloraPage;