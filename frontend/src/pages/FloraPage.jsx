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
                            <option value="namaIlmiah">Scientific Name</option>
                            <option value="namaIlmiahLengkap">Full Scientific Name</option>
                            <option value="namaLokal">Local Name</option>
                            <option value="namaLokalLain">Other Local Names</option>
                            <option value="namaKeluarga">Family Name</option>
                            <option value="kingdom">Kingdom</option>
                            <option value="divisi">Division</option>
                            <option value="kelas">Class</option>
                            <option value="ordo">Order</option>
                            <option value="famili">Family</option>
                            <option value="genus">Genus</option>
                            <option value="spesies">Species</option>
                            <option value="varietas">Variety</option>
                            <option value="jenisTumbuhan">Plant Type</option>
                            <option value="tipePertumbuhan">Growth Type</option>
                            <option value="kategoriFungsional">Functional Category</option>
                            <option value="tinggiMaksimal">Maximum Height</option>
                            <option value="diameterBatangMaksimal">Maximum Stem Diameter</option>
                            <option value="deskripsiBatang">Stem Description</option>
                            <option value="deskripsiKulitBatang">Bark Description</option>
                            <option value="deskripsiCabang">Branch Description</option>
                            <option value="bentukTajuk">Canopy Shape</option>
                            <option value="jenisDaunSejati">True Leaf Type</option>
                            <option value="deskripsiDaunSejati">True Leaf Description</option>
                            <option value="jenisRantingFotosintetik">Photosynthetic Twig Type</option>
                            <option value="deskripsiRantingFotosintetik">Photosynthetic Twig Description</option>
                            <option value="tipeSistemPerakaran">Root System Type</option>
                            <option value="deskripsiSistemPerakaran">Root System Description</option>
                            <option value="morfologiBunga.tipeKelamin">Flower Sex Type</option>
                            <option value="morfologiBunga.deskripsiBungaJantan">Male Flower Description</option>
                            <option value="morfologiBunga.deskripsiBungaBetina">Female Flower Description</option>
                            <option value="morfologiBunga.waktuBerbunga">Flowering Time</option>
                            <option value="morfologiBunga.warnaBunga">Flower Color</option>
                            <option value="morfologiBuah.tipeBuah">Fruit Type</option>
                            <option value="morfologiBuah.deskripsiBuah">Fruit Description</option>
                            <option value="morfologiBuah.ukuranBuah">Fruit Size</option>
                            <option value="morfologiBuah.warnaBuah">Fruit Color</option>
                            <option value="morfologiBuah.waktuBerbuah">Fruiting Time</option>
                            <option value="morfologiBiji.deskripsiBiji">Seed Description</option>
                            <option value="morfologiBiji.ukuranBiji">Seed Size</option>
                            <option value="morfologiBiji.warnaBiji">Seed Color</option>
                            <option value="morfologiBiji.bentukBiji">Seed Shape</option>
                            <option value="morfologiBiji.mekanismePenyebaranBiji">Seed Dispersal Mechanism</option>
                            <option value="metodeReproduksi">Reproduction Method</option>
                            <option value="musimTumbuhOptimal">Optimal Growing Season</option>
                            <option value="habitatAlami">Natural Habitat</option>
                            <option value="kondisiTanahIdeal">Ideal Soil Conditions</option>
                            <option value="pHTanahOptimal">Optimal Soil pH</option>
                            <option value="drainaseTanahIdeal">Ideal Soil Drainage</option>
                            <option value="kondisiIklimOptimal">Optimal Climate Conditions</option>
                            <option value="toleransiKekeringan">Drought Tolerance</option>
                            <option value="toleransiSalinitas">Salinity Tolerance</option>
                            <option value="toleransiAngin">Wind Tolerance</option>
                            <option value="toleransiSuhu">Temperature Tolerance</option>
                            <option value="sebaranGeografis">Geographic Distribution</option>
                            <option value="ketinggianOptimal">Optimal Altitude</option>
                            <option value="lajuPertumbuhan">Growth Rate</option>
                            <option value="kegunaanUtama">Primary Uses</option>
                            <option value="deskripsiKegunaan">Description of Uses</option>
                            <option value="komponenBioaktif">Bioactive Components</option>
                            <option value="potensiAncamanInvasif">Potential Invasive Threat</option>
                            <option value="statusKonservasi">Conservation Status</option>
                            <option value="sumberDataStatusKonservasi">Source of Conservation Status Data</option>
                            <option value="nilaiEkologis">Ecological Value</option>
                            <option value="sifatKimia">Chemical Properties</option>
                            <option value="kerentananPenyakitHama">Pest and Disease Vulnerability</option>
                            <option value="referensiIlmiah">Scientific References</option>
                            <option value="peneliti">Researcher(s)</option>
                            <option value="lokasiObservasi">Observation Location</option>
                            <option value="deskripsi">Description</option>
                            <option value="catatanTambahan">Additional Notes</option>
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