// pages/NationalParkDetailPage.jsx
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
    List,
    ListItem,
    ListIcon,
    OrderedList,
    UnorderedList
} from '@chakra-ui/react';
import { ArrowLeftIcon, EditIcon, DeleteIcon, CheckCircleIcon, MinusIcon, PlusSquareIcon } from '@chakra-ui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNationalParkStore } from '../store/nationalPark'; // Pastikan Anda mengimpor store yang benar
import NationalParkFormModal from '../components/NationalParkFormModal'; // Asumsi Anda punya modal update
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { getUserRole, isLoggedIn, getUserGmail } from '../utils/auth';

const MotionContainer = motion(Container);
const MotionBox = motion(Box);

const NationalParkDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        fetchNationalParkById,
        singleNationalPark,
        loadingSingleNationalPark,
        updateNationalPark, // Asumsi Anda memiliki action update di store
        deleteNationalPark, // Asumsi Anda memiliki action delete di store
    } = useNationalParkStore();

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
        fetchNationalParkById(id);
        setCurrentUserRole(getUserRole());
        setUserIsLoggedIn(isLoggedIn());
        setUserLoggedInGmail(getUserGmail());
    }, [fetchNationalParkById, id]);

    const handleGoBack = () => navigate('/NationalPark'); // Sesuaikan rute kembali

    const bg = useColorModeValue(
        'linear-gradient(to right, rgba(255,255,255,0.3), rgba(220,255,250,0.2))',
        'linear-gradient(to right, rgba(23,25,35,0.7), rgba(12,18,30,0.5))'
    );
    const borderColor = useColorModeValue('whiteAlpha.500', 'whiteAlpha.300');
    const textColor = useColorModeValue('blackAlpha.900', 'whiteAlpha.900');
    const headingColor = useColorModeValue('teal.600', 'cyan.400');
    const subheadingColor = useColorModeValue('blue.500', 'blue.300');


    if (loadingSingleNationalPark || !singleNationalPark) {
        return (
            <Flex justify="center" align="center" minH="80vh">
                <Spinner size="xl" color={headingColor} />
            </Flex>
        );
    }

    const isDosen = userIsLoggedIn && currentUserRole === 'Dosen';
    const isCreator = userIsLoggedIn && singleNationalPark && singleNationalPark.createdBy === userLoggedInGmail;
    const canEditOrDelete = isDosen || isCreator;

    console.log("--- DEBUG NationalParkDetailPage ---");
    console.log("userIsLoggedIn:", userIsLoggedIn);
    console.log("currentUserRole:", currentUserRole);
    console.log("userLoggedInGmail (Current User):", userLoggedInGmail);
    console.log("singleNationalPark.createdBy (National Park's Creator):", singleNationalPark.createdBy);
    console.log("isDosen:", isDosen);
    console.log("isCreator:", isCreator);
    console.log("canEditOrDelete (Final Decision):", canEditOrDelete);
    console.log("--- END DEBUG ---");

    // Helper function to render lists
    const renderList = (items) => {
        if (!items || items.length === 0) return <Text fontSize="lg" color={textColor}>N/A</Text>;
        return (
            <UnorderedList spacing={1} pl={4} mt={1}>
                {items.map((item, index) => (
                    <ListItem key={index} fontSize="lg" color={textColor}>
                        <ListIcon as={CheckCircleIcon} color="green.500" />
                        {item}
                    </ListItem>
                ))}
            </UnorderedList>
        );
    };

    // Helper function to render complex lists (e.g., flora, fauna, ekosistem)
    const renderComplexList = (data, type) => {
        if (!data || data.length === 0) return <Text fontSize="lg" color={textColor}>N/A</Text>;

        return (
            <VStack align="start" spacing={2}>
                {data.map((item, index) => (
                    <Box key={index} width="full" p={2} bg={useColorModeValue('gray.50', 'whiteAlpha.100')} borderRadius="md">
                        {type === 'ekosistemHabitat' && (
                            <>
                                <Text fontWeight="semibold" fontSize="md" color={subheadingColor}>{item.nama}</Text>
                                <Text fontSize="sm" color={textColor}>{item.deskripsi}</Text>
                            </>
                        )}
                        {type === 'floraSpecies' && (
                            <>
                                <Text fontWeight="semibold" fontSize="md" color={subheadingColor}>{item.namaLokal} {item.namaIlmiah ? `(${item.namaIlmiah})` : ''}</Text>
                                {item.keterangan && <Text fontSize="sm" color={textColor}>{item.keterangan}</Text>}
                            </>
                        )}
                        {type === 'faunaCategory' && (
                            <Box>
                                <Text fontWeight="bold" fontSize="md" color={subheadingColor}>{item.kategori}</Text>
                                <UnorderedList spacing={1} pl={4}>
                                    {item.jenis.map((species, sIdx) => (
                                        <ListItem key={sIdx} fontSize="sm" color={textColor}>
                                            <ListIcon as={MinusIcon} color="orange.300" />
                                            {species.namaLokal} {species.namaIlmiah ? `(${species.namaIlmiah})` : ''}
                                            {species.keterangan && ` - ${species.keterangan}`}
                                        </ListItem>
                                    ))}
                                </UnorderedList>
                            </Box>
                        )}
                        {type === 'aktivitasPengelolaan' && (
                            <>
                                <Text fontWeight="semibold" fontSize="md" color={subheadingColor}>{item.nama}: {item.deskripsi}</Text>
                                {item.detail && item.detail.length > 0 && (
                                    <UnorderedList spacing={1} pl={4}>
                                        {item.detail.map((d, dIdx) => (
                                            <ListItem key={dIdx} fontSize="sm" color={textColor}>
                                                <ListIcon as={PlusSquareIcon} color="purple.300" />
                                                {d}
                                            </ListItem>
                                        ))}
                                    </UnorderedList>
                                )}
                            </>
                        )}
                    </Box>
                ))}
            </VStack>
        );
    };


    return (
       <Box  minH={"850vh"} bg={useColorModeValue('rgba(194, 243, 245, 0.9)', "gray.900")} >
        <MotionContainer
            maxW="container.xl" // Ubah ke xl untuk konten yang lebih banyak
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
                        aria-label="Back to National Parks List"
                        onClick={handleGoBack}
                        variant="ghost"
                        size="lg"
                        borderRadius="full"
                        _hover={{ bg: useColorModeValue('gray.200', 'whiteAlpha.200') }}
                    />
                    <Heading as="h1" size="2xl" ml={4} color={headingColor}>
                        {singleNationalPark.namaResmi}
                    </Heading>
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
                            src={singleNationalPark.image && singleNationalPark.image.startsWith('http') ? singleNationalPark.image : null}
                            alt={singleNationalPark.namaResmi}
                            w="full"
                            objectFit="cover"
                            h={ 500}
                        />
                    </Box>

                    <Divider borderColor={borderColor} opacity={0.5} />

                    {/* Overview Section */}
                    <Heading as="h2" size="lg" color={headingColor}>Overview</Heading>
                    <Box w="full">
                        <Text fontWeight="bold" fontSize="xl" color={headingColor}>Nama Resmi</Text>
                        <Text fontSize="lg" color={textColor}>{singleNationalPark.namaResmi}</Text>
                    </Box>
                    <Box w="full">
                        <Text fontWeight="bold" fontSize="xl" color={headingColor}>Lokasi</Text>
                        <Text fontSize="lg" color={textColor}>{singleNationalPark.lokasi}</Text>
                    </Box>
                    <Box w="full">
                        <Text fontWeight="bold" fontSize="xl" color={headingColor}>Wilayah Administratif</Text>
                        {renderList(singleNationalPark.wilayahAdministratif)}
                    </Box>
                    {singleNationalPark.koordinatGeografis && (singleNationalPark.koordinatGeografis.lintang || singleNationalPark.koordinatGeografis.bujur) && (
                        <Box w="full">
                            <Text fontWeight="bold" fontSize="xl" color={headingColor}>Koordinat Geografis</Text>
                            <Text fontSize="lg" color={textColor}>
                                Lintang: {singleNationalPark.koordinatGeografis.lintang || 'N/A'}
                                <br />
                                Bujur: {singleNationalPark.koordinatGeografis.bujur || 'N/A'}
                            </Text>
                        </Box>
                    )}
                    {singleNationalPark.luas && singleNationalPark.luas.value > 0 && (
                        <Box w="full">
                            <Text fontWeight="bold" fontSize="xl" color={headingColor}>Luas</Text>
                            <Text fontSize="lg" color={textColor}>
                                {singleNationalPark.luas.value} {singleNationalPark.luas.unit}
                                {singleNationalPark.luas.referensi && ` (${singleNationalPark.luas.referensi})`}
                            </Text>
                        </Box>
                    )}
                    {singleNationalPark.ketinggian && (singleNationalPark.ketinggian.min > 0 || singleNationalPark.ketinggian.max > 0) && (
                        <Box w="full">
                            <Text fontWeight="bold" fontSize="xl" color={headingColor}>Ketinggian</Text>
                            <Text fontSize="lg" color={textColor}>
                                {singleNationalPark.ketinggian.min} - {singleNationalPark.ketinggian.max} {singleNationalPark.ketinggian.unit}
                            </Text>
                        </Box>
                    )}

                    <Divider borderColor={borderColor} opacity={0.5} />

                    {/* Geology & Topography Section */}
                    {(singleNationalPark.topografi || singleNationalPark.geologi) && (
                        <>
                            <Heading as="h2" size="lg" color={headingColor}>Geology & Topography</Heading>
                            {singleNationalPark.topografi && (
                                <Box w="full">
                                    <Text fontWeight="bold" fontSize="xl" color={headingColor}>Topografi</Text>
                                    <Text fontSize="lg" color={textColor} whiteSpace="pre-line">{singleNationalPark.topografi}</Text>
                                </Box>
                            )}
                            {singleNationalPark.geologi && (
                                <Box w="full">
                                    <Text fontWeight="bold" fontSize="xl" color={headingColor}>Geologi</Text>
                                    <Text fontSize="lg" color={textColor} whiteSpace="pre-line">{singleNationalPark.geologi}</Text>
                                </Box>
                            )}
                        </>
                    )}

                    <Divider borderColor={borderColor} opacity={0.5} />

                    {/* Climate Section */}
                    {singleNationalPark.iklim && (
                        <>
                            <Heading as="h2" size="lg" color={headingColor}>Iklim</Heading>
                            {singleNationalPark.iklim.tipe && (
                                <Box w="full">
                                    <Text fontWeight="bold" fontSize="xl" color={headingColor}>Tipe Iklim</Text>
                                    <Text fontSize="lg" color={textColor}>{singleNationalPark.iklim.tipe}</Text>
                                </Box>
                            )}
                            {singleNationalPark.iklim.curahHujanRataRata && singleNationalPark.iklim.curahHujanRataRata.value && (
                                <Box w="full">
                                    <Text fontWeight="bold" fontSize="xl" color={headingColor}>Curah Hujan Rata-Rata</Text>
                                    <Text fontSize="lg" color={textColor}>
                                        {singleNationalPark.iklim.curahHujanRataRata.value} {singleNationalPark.iklim.curahHujanRataRata.unit}
                                    </Text>
                                </Box>
                            )}
                            {singleNationalPark.iklim.suhuRataRata && (singleNationalPark.iklim.suhuRataRata.kakiGunung || singleNationalPark.iklim.suhuRataRata.puncak) && (
                                <Box w="full">
                                    <Text fontWeight="bold" fontSize="xl" color={headingColor}>Suhu Rata-Rata</Text>
                                    <Text fontSize="lg" color={textColor}>
                                        Kaki Gunung: {singleNationalPark.iklim.suhuRataRata.kakiGunung || 'N/A'}
                                        <br />
                                        Puncak: {singleNationalPark.iklim.suhuRataRata.puncak || 'N/A'}
                                    </Text>
                                </Box>
                            )}
                            {singleNationalPark.iklim.kelembabanUdaraRataRata && singleNationalPark.iklim.kelembabanUdaraRataRata.value && (
                                <Box w="full">
                                    <Text fontWeight="bold" fontSize="xl" color={headingColor}>Kelembaban Udara Rata-Rata</Text>
                                    <Text fontSize="lg" color={textColor}>
                                        {singleNationalPark.iklim.kelembabanUdaraRataRata.value} {singleNationalPark.iklim.kelembabanUdaraRataRata.unit}
                                    </Text>
                                </Box>
                            )}
                        </>
                    )}

                    <Divider borderColor={borderColor} opacity={0.5} />

                    {/* Ecosystem & Habitat */}
                    {singleNationalPark.ekosistemHabitat && singleNationalPark.ekosistemHabitat.length > 0 && (
                        <Box w="full">
                            <Heading as="h2" size="lg" color={headingColor}>Ekosistem & Habitat</Heading>
                            {renderComplexList(singleNationalPark.ekosistemHabitat, 'ekosistemHabitat')}
                        </Box>
                    )}

                    <Divider borderColor={borderColor} opacity={0.5} />

                    {/* Flora */}
                    {singleNationalPark.flora && (
                        <>
                            <Heading as="h2" size="lg" color={headingColor}>Flora</Heading>
                            {singleNationalPark.flora.jumlahJenis && (
                                <Box w="full">
                                    <Text fontWeight="bold" fontSize="xl" color={headingColor}>Jumlah Jenis</Text>
                                    <Text fontSize="lg" color={textColor}>{singleNationalPark.flora.jumlahJenis}</Text>
                                </Box>
                            )}
                            {singleNationalPark.flora.pohonDominan && singleNationalPark.flora.pohonDominan.length > 0 && (
                                <Box w="full">
                                    <Text fontWeight="bold" fontSize="xl" color={headingColor}>Pohon Dominan</Text>
                                    {renderComplexList(singleNationalPark.flora.pohonDominan, 'floraSpecies')}
                                </Box>
                            )}
                            {singleNationalPark.flora.tumbuhanBawahSemak && singleNationalPark.flora.tumbuhanBawahSemak.length > 0 && (
                                <Box w="full">
                                    <Text fontWeight="bold" fontSize="xl" color={headingColor}>Tumbuhan Bawah & Semak</Text>
                                    {renderComplexList(singleNationalPark.flora.tumbuhanBawahSemak, 'floraSpecies')}
                                </Box>
                            )}
                            {singleNationalPark.flora.tumbuhanPionir && singleNationalPark.flora.tumbuhanPionir.length > 0 && (
                                <Box w="full">
                                    <Text fontWeight="bold" fontSize="xl" color={headingColor}>Tumbuhan Pionir</Text>
                                    {renderComplexList(singleNationalPark.flora.tumbuhanPionir, 'floraSpecies')}
                                </Box>
                            )}
                            {singleNationalPark.flora.tumbuhanKhasEndemik && singleNationalPark.flora.tumbuhanKhasEndemik.length > 0 && (
                                <Box w="full">
                                    <Text fontWeight="bold" fontSize="xl" color={headingColor}>Tumbuhan Khas & Endemik</Text>
                                    {renderComplexList(singleNationalPark.flora.tumbuhanKhasEndemik, 'floraSpecies')}
                                </Box>
                            )}
                        </>
                    )}

                    <Divider borderColor={borderColor} opacity={0.5} />

                    {/* Fauna */}
                    {singleNationalPark.fauna && (
                        <>
                            <Heading as="h2" size="lg" color={headingColor}>Fauna</Heading>
                            {singleNationalPark.fauna.jumlahJenis && (
                                <Box w="full">
                                    <Text fontWeight="bold" fontSize="xl" color={headingColor}>Jumlah Jenis</Text>
                                    <Text fontSize="lg" color={textColor}>
                                        {singleNationalPark.fauna.jumlahJenis.burung && `Burung: ${singleNationalPark.fauna.jumlahJenis.burung}`}
                                        {singleNationalPark.fauna.jumlahJenis.mamalia && singleNationalPark.fauna.jumlahJenis.burung && ', '}
                                        {singleNationalPark.fauna.jumlahJenis.mamalia && `Mamalia: ${singleNationalPark.fauna.jumlahJenis.mamalia}`}
                                        {(singleNationalPark.fauna.jumlahJenis.reptil && (singleNationalPark.fauna.jumlahJenis.burung || singleNationalPark.fauna.jumlahJenis.mamalia)) && ', '}
                                        {singleNationalPark.fauna.jumlahJenis.reptil && `Reptil: ${singleNationalPark.fauna.jumlahJenis.reptil}`}
                                        {(singleNationalPark.fauna.jumlahJenis.amfibi && (singleNationalPark.fauna.jumlahJenis.burung || singleNationalPark.fauna.jumlahJenis.mamalia || singleNationalPark.fauna.jumlahJenis.reptil)) && ', '}
                                        {singleNationalPark.fauna.jumlahJenis.amfibi && `Amfibi: ${singleNationalPark.fauna.jumlahJenis.amfibi}`}
                                    </Text>
                                </Box>
                            )}
                            {singleNationalPark.fauna.mamalia && singleNationalPark.fauna.mamalia.length > 0 && (
                                <Box w="full">
                                    <Text fontWeight="bold" fontSize="xl" color={headingColor}>Mamalia</Text>
                                    {renderComplexList(singleNationalPark.fauna.mamalia, 'faunaCategory')}
                                </Box>
                            )}
                            {singleNationalPark.fauna.burung && singleNationalPark.fauna.burung.length > 0 && (
                                <Box w="full">
                                    <Text fontWeight="bold" fontSize="xl" color={headingColor}>Burung</Text>
                                    {renderComplexList(singleNationalPark.fauna.burung, 'faunaCategory')}
                                </Box>
                            )}
                        </>
                    )}

                    <Divider borderColor={borderColor} opacity={0.5} />

                    {/* History & Management */}
                    {singleNationalPark.sejarahSingkat && singleNationalPark.sejarahSingkat.length > 0 && (
                        <Box w="full">
                            <Heading as="h2" size="lg" color={headingColor}>Sejarah Singkat</Heading>
                            <OrderedList spacing={2} pl={4} mt={2}>
                                {singleNationalPark.sejarahSingkat.map((point, idx) => (
                                    <ListItem key={idx} fontSize="lg" color={textColor}>
                                        {point}
                                    </ListItem>
                                ))}
                            </OrderedList>
                        </Box>
                    )}
                    {singleNationalPark.aktivitasPengelolaan && singleNationalPark.aktivitasPengelolaan.length > 0 && (
                        <Box w="full">
                            <Heading as="h2" size="lg" color={headingColor}>Aktivitas Pengelolaan</Heading>
                            {renderComplexList(singleNationalPark.aktivitasPengelolaan, 'aktivitasPengelolaan')}
                        </Box>
                    )}
                    {singleNationalPark.fasilitasPendukung && singleNationalPark.fasilitasPendukung.length > 0 && (
                        <Box w="full">
                            <Text fontWeight="bold" fontSize="xl" color={headingColor}>Fasilitas Pendukung</Text>
                            {renderList(singleNationalPark.fasilitasPendukung)}
                        </Box>
                    )}

                    <Divider borderColor={borderColor} opacity={0.5} />

                    {/* Conservation */}
                    {singleNationalPark.ancamanKonservasi && singleNationalPark.ancamanKonservasi.length > 0 && (
                        <Box w="full">
                            <Heading as="h2" size="lg" color={headingColor}>Ancaman Konservasi</Heading>
                            {renderList(singleNationalPark.ancamanKonservasi)}
                        </Box>
                    )}
                    {singleNationalPark.upayaKonservasi && singleNationalPark.upayaKonservasi.length > 0 && (
                        <Box w="full">
                            <Heading as="h2" size="lg" color={headingColor}>Upaya Konservasi</Heading>
                            {renderList(singleNationalPark.upayaKonservasi)}
                        </Box>
                    )}

                    {singleNationalPark.createdBy && (
                        <Box w="full">
                            <Text fontWeight="bold" fontSize="md" color={headingColor}>Dibuat Oleh</Text>
                            <Text fontSize="sm" color={textColor}>{singleNationalPark.createdBy}</Text>
                        </Box>
                    )}
                </VStack>
            </MotionBox>

            {canEditOrDelete && (
                <>
                    {/* Anda perlu membuat NationalParkFormModal atau menggunakan modal generik */}
                    {/* Jika Anda belum memiliki NationalParkFormModal, Anda bisa mengadaptasi CreateNationalParkPage menjadi modal */}
                    <NationalParkFormModal
                        isOpen={isUpdateOpen}
                        onClose={onUpdateClose}
                        nationalPark={singleNationalPark} // Pass data untuk pre-fill form
                        onSubmit={async (updatedData) => {
                            // Pastikan Anda menangani transformasi data dari form (string ke array/objek)
                            // seperti yang dilakukan di CreateNationalParkPage
                            console.log("Submitting update for National Park:", updatedData);
                            await updateNationalPark(singleNationalPark._id, updatedData);
                            await fetchNationalParkById(singleNationalPark._id); // Refresh data setelah update
                            onUpdateClose();
                        }}
                        isEdit // Prop untuk mengindikasikan ini adalah mode edit
                    />

                    <DeleteConfirmationModal
                        isOpen={isDeleteOpen}
                        onClose={onDeleteClose}
                        onConfirm={async () => {
                            await deleteNationalPark(singleNationalPark._id);
                            onDeleteClose();
                            navigate('/national-parks'); // Kembali ke daftar setelah penghapusan
                        }}
                        title="Delete National Park"
                        body={`Are you sure you want to delete "${singleNationalPark.namaResmi}"? This action cannot be undone.`}
                    />
                </>
            )}
        </MotionContainer>
        </Box>
    );
};

export default NationalParkDetailPage;