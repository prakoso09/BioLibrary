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
import { useFaunaStore } from '../store/fauna.js';
import FaunaCard from '../components/FaunaCard.jsx';
import { PlusSquareIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { isLoggedIn } from '../utils/auth';

const MotionButton = motion(Button);

const FaunaPage = () => {
    const accentColor = useColorModeValue('teal.600', 'teal.300');
    const textColor = useColorModeValue('gray.800', 'gray.200');
    const bgColor = useColorModeValue('white', 'gray.800');
    const cardBgColor = useColorModeValue('rgb(110, 220, 224)', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const hoverColor = useColorModeValue('gray.50', 'gray.600');
    const navigate = useNavigate();

    const { fetchFauna, fauna } = useFaunaStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchCategory, setSearchCategory] = useState("namaLokal");
    const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
    const [userLoggedInGmail, setUserLoggedInGmail] = useState(null);    

    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();

    useEffect(() => {
        fetchFauna();
        setUserIsLoggedIn(isLoggedIn());
        setUserLoggedInGmail(isLoggedIn());
    }, [fetchFauna]);

    const handleClickAddFauna = () => {
        if (!userIsLoggedIn) {
            onOpen();
        } else {
            navigate('/CreateFauna');
        }
    };

    const sortedFauna = [...fauna].sort((a, b) => {
        if (a.namaLokal < b.namaLokal) return -1;
        if (a.namaLokal > b.namaLokal) return 1;
        return 0;
    });

    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    const filteredFauna = sortedFauna.filter((item) => {
        const value = getNestedValue(item, searchCategory);
        return value?.toLowerCase().includes(searchTerm.toLowerCase());
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
                    Fauna Library 🐾
                </Text>


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
                            focusBorderColor="blue.500"
                            fontWeight="medium"
                            _hover={{ borderColor: 'blue.500' }}
                        >
                            <option value="namaIlmiah">Scientific Name</option>
                            <option value="namaLokal">Local Name</option>
                            <option value="namaUmumLain">Other Common Name</option>
                            <option value="klasifikasiIlmiah.kingdom">Kingdom</option>
                            <option value="klasifikasiIlmiah.filum">Phylum</option>
                            <option value="klasifikasiIlmiah.kelas">Class</option>
                            <option value="klasifikasiIlmiah.ordo">Order</option>
                            <option value="klasifikasiIlmiah.famili">Family</option>
                            <option value="klasifikasiIlmiah.subfamili">Subfamily</option>
                            <option value="klasifikasiIlmiah.genus">Genus</option>
                            <option value="klasifikasiIlmiah.spesies">Species</option>
                            <option value="habitat">Habitat</option>
                            <option value="sebaranGeografis">Geographical Distribution</option>
                            <option value="iklim">Climate</option>
                            <option value="ukuranTubuh.panjangTubuh">Body Length</option>
                            <option value="ukuranTubuh.panjangEkor">Tail Length</option>
                            <option value="ukuranTubuh.tinggiBahu">Shoulder Height</option>
                            <option value="ukuranTubuh.lebarSayap">Wingspan</option>
                            <option value="ukuranTubuh.beratBadan">Body Weight</option>
                            <option value="polaMakan">Diet</option>
                            <option value="makananUtama">Main Food</option>
                            <option value="caraBergerak">Locomotion</option>
                            <option value="reproduksi.kematanganSeksual">Sexual Maturity</option>
                            <option value="reproduksi.masaKehamilan">Gestation Period</option>
                            <option value="reproduksi.jumlahAnak">Number of Offspring</option>
                            <option value="reproduksi.warnaBayi">Baby Color</option>
                            <option value="reproduksi.perawatanAnak">Parental Care</option>
                            <option value="reproduksi.tempatBertelur">Laying Place</option>
                            <option value="reproduksi.fekunditasTinggi">High Fecundity</option>
                            <option value="reproduksi.perkembangan">Development</option>
                            <option value="usiaRataRata">Average Age</option>
                            <option value="perilaku.aktivitas">Activity</option>
                            <option value="perilaku.sosial">Social Behavior</option>
                            <option value="perilaku.komunikasi">Communication</option>
                            <option value="perilaku.perilakuLain">Other Behavior</option>
                            <option value="perilaku.pertahanan">Defense Mechanism</option>
                            <option value="perilaku.peranEkologis">Ecological Role</option>
                            <option value="statusKepunahan.statusIUCNGlobal">IUCN Global Status</option>
                            <option value="statusKepunahan.alasan">Extinction Reason</option>
                            <option value="statusKepunahan.manajemenKonflik">Conflict Management</option>
                            <option value="statusKepunahan.invasiIntroduksi">Invasion/Introduction</option>
                            <option value="deskripsi">Description</option>
                        </Select>
                    </Flex>

                    <Input
                        placeholder={`Search ${searchCategory.replace(/([A-Z])/g, ' $1').replace('klasifikasiIlmiah.', '').replace('ukuranTubuh.', '').replace('reproduksi.', '').replace('perilaku.', '').replace('statusKepunahan.', '')}`} 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        size="sm"
                        variant="outline"
                        borderColor={accentColor}
                        focusBorderColor="blue.500"
                        fontSize="sm"
                        fontWeight="medium"
                        _hover={{ borderColor: 'blue.500' }}
                        _placeholder={{ color: 'gray.500' }}
                    />

                    <Flex justifyContent="center" alignItems="center" w="full" gap={3} pt={2}>
                        <Text fontSize="md" color={textColor}>
                            Want to contribute to the fauna collection?
                        </Text>
                        <MotionButton
                            onClick={handleClickAddFauna}
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
                            Add Fauna
                        </MotionButton>
                    </Flex>
                </VStack>

                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
                    {filteredFauna.map((item) => (
                        <FaunaCard key={item._id} fauna={item} />
                    ))}
                </SimpleGrid>

                {filteredFauna.length === 0 && (
                    <VStack spacing={4} p={8} bg={cardBgColor} borderRadius="xl" 
                        borderWidth="1px" borderColor={borderColor} w="full" maxW="2xl">
                        <Text fontSize="xl" fontWeight="bold" textAlign="center" color="gray.500">
                            No fauna found 😔
                        </Text>
                        <Button 
                            onClick={handleClickAddFauna}
                            variant="outline"
                            colorScheme="blue"
                            leftIcon={<PlusSquareIcon />}
                            _hover={{ bg: hoverColor }}
                        >
                            Add a Fauna
                        </Button>
                    </VStack>
                )}
            </VStack>

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
                            You need to log in first to be able to add fauna data.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose} mr={3}>
                                Cancel
                            </Button>
                            <Button 
                                colorScheme="blue"
                                onClick={() => { navigate('/Login'); onClose(); }}
                                bgGradient="linear(to-r, blue.500, indigo.600)"
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

export default FaunaPage;