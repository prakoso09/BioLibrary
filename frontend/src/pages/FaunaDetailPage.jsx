import React, { useEffect, useState } from 'react';
import {
    Container,
    Box,
    Heading,
    Image,
    VStack,
    Text,
    Divider,
    useColorModeValue,
    IconButton,
    Flex,
    Spinner,
    useDisclosure,
    HStack,
    SimpleGrid, // Added SimpleGrid for better layout
    ListItem,
    ListIcon,
    UnorderedList
} from '@chakra-ui/react';
import { ArrowLeftIcon, EditIcon, DeleteIcon, CheckCircleIcon, MinusIcon, PlusSquareIcon } from '@chakra-ui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFaunaStore } from '../store/fauna';
import FaunaFormModal from '../components/FaunaFormModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { getUserRole, isLoggedIn, getUserGmail } from '../utils/auth';

const MotionContainer = motion(Container);
const MotionBox = motion(Box);

const FaunaDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        fetchFaunaById,
        singleFauna,
        loadingSingleFauna,
        updateFauna,
        deleteFauna,
    } = useFaunaStore();

    const {
        isOpen: isUpdateOpen,
        onOpen: onUpdateOpen,
        onClose: onUpdateClose,
    } = useDisclosure();

    const {
        isOpen: isDeleteOpen,
        onOpen: onDeleteOpen,
        onClose: onDeleteClose,
    } = useDisclosure();

    const [currentUserRole, setCurrentUserRole] = useState(null);
    const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
    const [userLoggedInGmail, setUserLoggedInGmail] = useState(null);

    useEffect(() => {
        fetchFaunaById(id);
        setCurrentUserRole(getUserRole());
        setUserIsLoggedIn(isLoggedIn());
        setUserLoggedInGmail(getUserGmail());
    }, [fetchFaunaById, id]);

    const handleGoBack = () => navigate('/Fauna');

    const bg = useColorModeValue(
        'linear-gradient(to right, rgba(255,255,255,0.3), rgba(220,255,250,0.2))', // Adjusted for consistency with NationalParkDetailPage
        'linear-gradient(to right, rgba(23,25,35,0.7), rgba(12,18,30,0.5))'
    );
    const borderColor = useColorModeValue('whiteAlpha.500', 'whiteAlpha.300');
    const textColor = useColorModeValue('blackAlpha.900', 'whiteAlpha.900');
    const headingColor = useColorModeValue('teal.600', 'cyan.400');
    const subheadingColor = useColorModeValue('blue.500', 'blue.300'); // Added for consistency

    if (loadingSingleFauna || !singleFauna) {
        return (
            <Flex justify="center" align="center" minH="80vh">
                <Spinner size="xl" color={headingColor} />
            </Flex>
        );
    }

    const isDosen = userIsLoggedIn && currentUserRole === 'Dosen';
    const isCreator = userIsLoggedIn && singleFauna && singleFauna.createdBy === userLoggedInGmail;
    const canEditOrDelete = isDosen || isCreator;

    console.log("--- DEBUG FaunaDetailPage ---");
    console.log("userIsLoggedIn:", userIsLoggedIn);
    console.log("currentUserRole:", currentUserRole);
    console.log("userLoggedInGmail (Current User):", userLoggedInGmail);
    console.log("singleFauna.createdBy (Fauna's Creator):", singleFauna.createdBy);
    console.log("isDosen:", isDosen);
    console.log("isCreator:", isCreator);
    console.log("canEditOrDelete (Final Decision):", canEditOrDelete);
    console.log("--- END DEBUG ---");

    // Helper for rendering text value or 'N/A'
    const renderValue = (value) => {
        return value || 'N/A';
    };

    // Helper function to render lists
    const formatArray = (arr, icon = CheckCircleIcon, iconColor = "green.500") => {
        if (!Array.isArray(arr) || arr.length === 0) return <Text fontSize="md" color={textColor}>N/A</Text>;
        return (
            <UnorderedList spacing={1} pl={4} mt={1}>
                {arr.map((item, index) => (
                    <ListItem key={index} fontSize="md" color={textColor}>
                        <ListIcon as={icon} color={iconColor} />
                        {item}
                    </ListItem>
                ))}
            </UnorderedList>
        );
    };

    // Grouping attributes for structured display
    const generalInformationAttributes = [
        ['Nama Lokal', renderValue(singleFauna.namaLokal)],
        ['Nama Ilmiah', renderValue(singleFauna.namaIlmiah)],
        ['Nama Umum Lain', renderValue(singleFauna.namaUmumLain)],
        ['Habitat', renderValue(singleFauna.habitat)],
        ['Sebaran Geografis', renderValue(singleFauna.sebaranGeografis)],
        ['Iklim', renderValue(singleFauna.iklim)],
        ['Pola Makan', renderValue(singleFauna.polaMakan)],
        ['Makanan Utama', renderValue(singleFauna.makananUtama)],
        ['Cara Bergerak', renderValue(singleFauna.caraBergerak)],
        ['Usia Rata-Rata', renderValue(singleFauna.usiaRataRata)],
        ['Dibuat Oleh', renderValue(singleFauna.createdBy)],
    ];

    const taxonomicClassificationAttributes = [
        ['Kingdom', renderValue(singleFauna.klasifikasiIlmiah.kingdom)],
        ['Filum', renderValue(singleFauna.klasifikasiIlmiah.filum)],
        ['Kelas', renderValue(singleFauna.klasifikasiIlmiah.kelas)],
        ['Ordo', renderValue(singleFauna.klasifikasiIlmiah.ordo)],
        ['Famili', renderValue(singleFauna.klasifikasiIlmiah.famili)],
        ['Subfamili', renderValue(singleFauna.klasifikasiIlmiah.subfamili)],
        ['Genus', renderValue(singleFauna.klasifikasiIlmiah.genus)],
        ['Spesies', renderValue(singleFauna.klasifikasiIlmiah.spesies)],
        // Subspesies will be handled separately as it's an array of objects
    ];

    const bodySizeAttributes = [
        ['Panjang Tubuh', renderValue(singleFauna.ukuranTubuh.panjangTubuh)],
        ['Panjang Ekor', renderValue(singleFauna.ukuranTubuh.panjangEkor)],
        ['Tinggi Bahu', renderValue(singleFauna.ukuranTubuh.tinggiBahu)],
        ['Lebar Sayap', renderValue(singleFauna.ukuranTubuh.lebarSayap)],
        ['Berat Badan', renderValue(singleFauna.ukuranTubuh.beratBadan)],
    ];

    const reproductionAttributes = [
        ['Kematangan Seksual', renderValue(singleFauna.reproduksi.kematanganSeksual)],
        ['Masa Kehamilan', renderValue(singleFauna.reproduksi.masaKehamilan)],
        ['Jumlah Anak', renderValue(singleFauna.reproduksi.jumlahAnak)],
        ['Warna Bayi', renderValue(singleFauna.reproduksi.warnaBayi)],
        ['Perawatan Anak', renderValue(singleFauna.reproduksi.perawatanAnak)],
        ['Tempat Bertelur', renderValue(singleFauna.reproduksi.tempatBertelur)],
        ['Fekunditas Tinggi', renderValue(singleFauna.reproduksi.fekunditasTinggi)],
        ['Perkembangan', renderValue(singleFauna.reproduksi.perkembangan)],
    ];

    const behaviorAttributes = [
        ['Aktivitas', renderValue(singleFauna.perilaku.aktivitas)],
        ['Sosial', renderValue(singleFauna.perilaku.sosial)],
        ['Komunikasi', renderValue(singleFauna.perilaku.komunikasi)],
        ['Perilaku Lain', renderValue(singleFauna.perilaku.perilakuLain)],
        ['Pertahanan', renderValue(singleFauna.perilaku.pertahanan)],
        ['Peran Ekologis', renderValue(singleFauna.perilaku.peranEkologis)],
    ];

    const extinctionStatusAttributes = [
        ['Status IUCN Global', renderValue(singleFauna.statusKepunahan.statusIUCNGlobal)],
        ['Alasan', renderValue(singleFauna.statusKepunahan.alasan)],
        ['Manajemen Konflik', renderValue(singleFauna.statusKepunahan.manajemenKonflik)],
        ['Invasi/Introduksi', renderValue(singleFauna.statusKepunahan.invasiIntroduksi)],
        // Ancaman and Upaya Konservasi will be handled separately as they are arrays
    ];

    return (
        <Box minH={"100vh"} bg={useColorModeValue('rgba(194, 243, 245, 0.9)', "gray.900")} >
            <MotionContainer
                maxW="container.xl"
                mt={10}
                mb={10}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <Flex mb={8} align="center" justify="space-between">
                    <Flex align="center">
                        <IconButton
                            icon={<ArrowLeftIcon />}
                            aria-label="Back to Fauna Library"
                            onClick={handleGoBack}
                            variant="ghost"
                            size="lg"
                            borderRadius="full"
                            _hover={{ bg: useColorModeValue('gray.200', 'whiteAlpha.200') }}
                        />
                        <VStack align="flex-start" spacing={0}>
                            <Heading as="h1" size="2xl" ml={4} color={headingColor}>
                                {singleFauna.namaLokal}
                            </Heading>
                            <Text fontSize="lg" ml={4} color={textColor}>
                                ({singleFauna.namaIlmiah})
                            </Text>
                        </VStack>
                    </Flex>
                    {canEditOrDelete && (
                        <HStack spacing={3}>
                            <IconButton
                                icon={<DeleteIcon />}
                                onClick={onDeleteOpen}
                                variant="solid"
                                size="sm"
                                colorScheme="red"
                                aria-label="Delete"
                            />
                            <IconButton
                                icon={<EditIcon />}
                                onClick={onUpdateOpen}
                                variant="solid"
                                size="sm"
                                colorScheme="blue"
                                aria-label="Edit"
                            />
                        </HStack>
                    )}
                </Flex>

                <MotionBox
                    bg={bg}
                    backdropFilter="blur(20px)"
                    border="1px solid"
                    borderColor={borderColor}
                    borderRadius="xl"
                    p={8}
                    boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
                >
                    <VStack spacing={6} align="start">
                        <Box w="full" borderRadius="md" overflow="hidden" boxShadow="md">
                            <Image
                                src={singleFauna.image && singleFauna.image.startsWith('http') ? singleFauna.image : null}
                                alt={singleFauna.namaLokal}
                                w="full"
                                objectFit="cover"
                                h={500}
                            />
                        </Box>

                        {/* Optional: If fauna data had other images, render them here */}
                        {/* {singleFauna.urlGambarLain && singleFauna.urlGambarLain.length > 0 && (
                            <Box w="full">
                                <Text fontWeight="bold" fontSize="xl" color={headingColor} mb={3}>
                                    Galeri Gambar Lain
                                </Text>
                                <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
                                    {singleFauna.urlGambarLain.map((url, index) => (
                                        <Image
                                            key={index}
                                            src={url}
                                            alt={`Gambar tambahan ${index + 1}`}
                                            boxSize="150px"
                                            objectFit="cover"
                                            borderRadius="md"
                                            boxShadow="sm"
                                        />
                                    ))}
                                </SimpleGrid>
                            </Box>
                        )} */}

                        {/* Deskripsi Umum Section */}
                        {singleFauna.deskripsi && (
                            <>
                                <Heading as="h2" size="lg" color={headingColor}>Deskripsi Umum</Heading>
                                <Box w="full">
                                    <Text fontSize="lg" color={textColor} whiteSpace="pre-line">
                                        {renderValue(singleFauna.deskripsi)}
                                    </Text>
                                </Box>
                                <Divider borderColor={borderColor} opacity={0.5} />
                            </>
                        )}

                        {/* General Information Section */}
                        {generalInformationAttributes.some(([_, value]) => (typeof value === 'string' && value !== 'N/A') || (typeof value !== 'string')) && (
                            <>
                                <Heading as="h2" size="lg" color={headingColor}>Informasi Umum</Heading>
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                    {generalInformationAttributes.map(([label, value]) => (
                                        <Box key={label}>
                                            <Text fontWeight="semibold" fontSize="md" color={subheadingColor}>
                                                {label}:
                                            </Text>
                                            {typeof value === 'string' ? (
                                                <Text fontSize="md" color={textColor}>
                                                    {value}
                                                </Text>
                                            ) : (
                                                value // Render as component (UnorderedList for arrays)
                                            )}
                                        </Box>
                                    ))}
                                </SimpleGrid>
                                <Divider borderColor={borderColor} opacity={0.5} />
                            </>
                        )}

                        {/* Scientific Classification Section */}
                        {taxonomicClassificationAttributes.some(([_, value]) => (typeof value === 'string' && value !== 'N/A') || (typeof value !== 'string')) && (
                            <>
                                <Heading as="h2" size="lg" color={headingColor}>Klasifikasi Ilmiah</Heading>
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                    {taxonomicClassificationAttributes.map(([label, value]) => (
                                        <Box key={label}>
                                            <Text fontWeight="semibold" fontSize="md" color={subheadingColor}>
                                                {label}:
                                            </Text>
                                            {typeof value === 'string' ? (
                                                <Text fontSize="md" color={textColor}>
                                                    {value}
                                                </Text>
                                            ) : (
                                                value
                                            )}
                                        </Box>
                                    ))}
                                </SimpleGrid>
                                {singleFauna.klasifikasiIlmiah.subspesies && singleFauna.klasifikasiIlmiah.subspesies.length > 0 && (
                                    <Box w="full" mt={2}>
                                        <Text fontWeight="semibold" fontSize="md" color={subheadingColor}>
                                            Subspesies:
                                        </Text>
                                        <UnorderedList align="start" mt={1} spacing={1}> {/* Changed VStack to UnorderedList */}
                                            {singleFauna.klasifikasiIlmiah.subspesies.map((sub, idx) => (
                                                <ListItem key={idx} fontSize="md" color={textColor}> {/* Changed Text to ListItem */}
                                                    <ListIcon as={CheckCircleIcon} color="green.500" />
                                                    {sub.nama} ({sub.deskripsi})
                                                </ListItem>
                                            ))}
                                        </UnorderedList>
                                    </Box>
                                )}
                                <Divider borderColor={borderColor} opacity={0.5} />
                            </>
                        )}

                        {/* Ukuran Tubuh Section */}
                        {bodySizeAttributes.some(([_, value]) => (typeof value === 'string' && value !== 'N/A') || (typeof value !== 'string')) && (
                            <>
                                <Heading as="h2" size="lg" color={headingColor}>Ukuran Tubuh</Heading>
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                    {bodySizeAttributes.map(([label, value]) => (
                                        <Box key={label}>
                                            <Text fontWeight="semibold" fontSize="md" color={subheadingColor}>
                                                {label}:
                                            </Text>
                                            <Text fontSize="md" color={textColor}>
                                                {value}
                                            </Text>
                                        </Box>
                                    ))}
                                </SimpleGrid>
                                <Divider borderColor={borderColor} opacity={0.5} />
                            </>
                        )}

                        {/* Reproduksi Section */}
                        {reproductionAttributes.some(([_, value]) => (typeof value === 'string' && value !== 'N/A') || (typeof value !== 'string')) && (
                            <>
                                <Heading as="h2" size="lg" color={headingColor}>Reproduksi</Heading>
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                    {reproductionAttributes.map(([label, value]) => (
                                        <Box key={label}>
                                            <Text fontWeight="semibold" fontSize="md" color={subheadingColor}>
                                                {label}:
                                            </Text>
                                            <Text fontSize="md" color={textColor}>
                                                {value}
                                            </Text>
                                        </Box>
                                    ))}
                                </SimpleGrid>
                                <Divider borderColor={borderColor} opacity={0.5} />
                            </>
                        )}

                        {/* Perilaku Section */}
                        {behaviorAttributes.some(([_, value]) => (typeof value === 'string' && value !== 'N/A') || (typeof value !== 'string')) && (
                            <>
                                <Heading as="h2" size="lg" color={headingColor}>Perilaku</Heading>
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                    {behaviorAttributes.map(([label, value]) => (
                                        <Box key={label}>
                                            <Text fontWeight="semibold" fontSize="md" color={subheadingColor}>
                                                {label}:
                                            </Text>
                                            <Text fontSize="md" color={textColor}>
                                                {value}
                                            </Text>
                                        </Box>
                                    ))}
                                </SimpleGrid>
                                <Divider borderColor={borderColor} opacity={0.5} />
                            </>
                        )}

                        {/* Status Kepunahan Section */}
                        {extinctionStatusAttributes.some(([_, value]) => (typeof value === 'string' && value !== 'N/A') || (typeof value !== 'string')) ||
                            (singleFauna.statusKepunahan.ancaman && singleFauna.statusKepunahan.ancaman.length > 0) ||
                            (singleFauna.statusKepunahan.upayaKonservasi && singleFauna.statusKepunahan.upayaKonservasi.length > 0) ? (
                            <>
                                <Heading as="h2" size="lg" color={headingColor}>Status Kepunahan</Heading>
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                    {extinctionStatusAttributes.map(([label, value]) => (
                                        <Box key={label}>
                                            <Text fontWeight="semibold" fontSize="md" color={subheadingColor}>
                                                {label}:
                                            </Text>
                                            <Text fontSize="md" color={textColor}>
                                                {value}
                                            </Text>
                                        </Box>
                                    ))}
                                </SimpleGrid>

                                {singleFauna.statusKepunahan.ancaman && singleFauna.statusKepunahan.ancaman.length > 0 && (
                                    <Box w="full">
                                        <Text fontWeight="semibold" fontSize="md" color={subheadingColor} mt={2}>
                                            Ancaman:
                                        </Text>
                                        {formatArray(singleFauna.statusKepunahan.ancaman, MinusIcon, "orange.300")}
                                    </Box>
                                )}

                                {singleFauna.statusKepunahan.upayaKonservasi && singleFauna.statusKepunahan.upayaKonservasi.length > 0 && (
                                    <Box w="full">
                                        <Text fontWeight="semibold" fontSize="md" color={subheadingColor} mt={2}>
                                            Upaya Konservasi:
                                        </Text>
                                        {formatArray(singleFauna.statusKepunahan.upayaKonservasi, PlusSquareIcon, "purple.300")}
                                    </Box>
                                )}
                            </>
                        ) : null}

                    </VStack>
                </MotionBox>

                {canEditOrDelete && (
                    <>
                        <FaunaFormModal
                            isOpen={isUpdateOpen}
                            onClose={onUpdateClose}
                            fauna={singleFauna}
                            onSubmit={async (formData) => {
                                await updateFauna(formData._id, formData);
                                await fetchFaunaById(formData._id);
                                onUpdateClose();
                            }}
                            isEdit
                        />

                        <DeleteConfirmationModal
                            isOpen={isDeleteOpen}
                            onClose={onDeleteClose}
                            onConfirm={async () => {
                                await deleteFauna(singleFauna._id);
                                onDeleteClose();
                                navigate('/Fauna');
                            }}
                            title="Delete Fauna"
                            body={`Are you sure you want to delete "${singleFauna.namaLokal}"? This action cannot be undone.`}
                        />
                    </>
                )}
            </MotionContainer>
        </Box>
    );
};

export default FaunaDetailPage;