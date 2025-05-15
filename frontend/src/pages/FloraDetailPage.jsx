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
  SimpleGrid,
  ListItem,
  ListIcon,
  UnorderedList,
} from '@chakra-ui/react';
import { ArrowLeftIcon, EditIcon, DeleteIcon, CheckCircleIcon } from '@chakra-ui/icons'; 
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFloraStore } from '../store/flora';
import FloraFormModal from '../components/FloraFormModal'; 
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { getUserRole, isLoggedIn, getUserGmail } from '../utils/auth';

const MotionContainer = motion(Container);
const MotionBox = motion(Box);

const FloraDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    fetchFloraById,
    singleFlora,
    loadingSingleFlora,
    updateFlora,
    deleteFlora,
  } = useFloraStore();

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
    fetchFloraById(id);
    setCurrentUserRole(getUserRole());
    setUserIsLoggedIn(isLoggedIn());
    setUserLoggedInGmail(getUserGmail());
  }, [fetchFloraById, id]);

  const handleGoBack = () => navigate('/Flora');

  const bg = useColorModeValue(
    'linear-gradient(to right, rgba(255,255,255,0.3), rgba(220,255,250,0.2))',
    'linear-gradient(to right, rgba(23,25,35,0.7), rgba(12,18,30,0.5))'
  );
  const borderColor = useColorModeValue('whiteAlpha.500', 'whiteAlpha.300');
  const textColor = useColorModeValue('blackAlpha.900', 'whiteAlpha.900');
  const headingColor = useColorModeValue('teal.600', 'cyan.400');
  const subheadingColor = useColorModeValue('blue.500', 'blue.300'); 

  if (loadingSingleFlora || !singleFlora) {
    return (
      <Flex justify="center" align="center" minH="80vh">
        <Spinner size="xl" color={headingColor} />
      </Flex>
    );
  }

  const isDosen = userIsLoggedIn && currentUserRole === 'Dosen';
  const isCreator = userIsLoggedIn && singleFlora && singleFlora.createdBy === userLoggedInGmail;
  const canEditOrDelete = isDosen || isCreator;

  // Helper untuk menampilkan array sebagai string terpisah koma
  const formatArray = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return 'N/A';
    return (
      <UnorderedList spacing={1} pl={4} mt={1}>
        {arr.map((item, index) => (
          <ListItem key={index} fontSize="md" color={textColor}>
            <ListIcon as={CheckCircleIcon} color="green.500" />
            {item}
          </ListItem>
        ))}
      </UnorderedList>
    );
  };

  // Helper untuk menampilkan tanggal
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Kalau value gaada nilainya isi N/A
  const renderValue = (value) => {
    return value || 'N/A';
  };

  // Mengelompokkan atribut berdasarkan kategori 
  const taxonomicAttributes = [
    ['Nama Ilmiah Lengkap', renderValue(singleFlora.namaIlmiahLengkap)],
    ['Nama Lokal Lain', formatArray(singleFlora.namaLokalLain)],
    ['Nama Keluarga', renderValue(singleFlora.namaKeluarga)],
    ['Kingdom', renderValue(singleFlora.kingdom)],
    ['Divisi', renderValue(singleFlora.divisi)],
    ['Kelas', renderValue(singleFlora.kelas)],
    ['Ordo', renderValue(singleFlora.ordo)],
    ['Famili', renderValue(singleFlora.famili)],
    ['Genus', renderValue(singleFlora.genus)],
    ['Spesies', renderValue(singleFlora.spesies)],
    ['Varietas', renderValue(singleFlora.varietas)],
  ];

  const vegetativeMorphologyAttributes = [
    ['Jenis Tumbuhan', renderValue(singleFlora.jenisTumbuhan)],
    ['Tipe Pertumbuhan', renderValue(singleFlora.tipePertumbuhan)],
    ['Kategori Fungsional', formatArray(singleFlora.kategoriFungsional)],
    ['Tinggi Maksimal', renderValue(singleFlora.tinggiMaksimal)],
    ['Diameter Batang Maksimal', renderValue(singleFlora.diameterBatangMaksimal)],
    ['Deskripsi Batang', renderValue(singleFlora.deskripsiBatang)],
    ['Deskripsi Kulit Batang', renderValue(singleFlora.deskripsiKulitBatang)],
    ['Deskripsi Cabang', renderValue(singleFlora.deskripsiCabang)],
    ['Bentuk Tajuk', renderValue(singleFlora.bentukTajuk)],
    ['Jenis Daun Sejati', renderValue(singleFlora.jenisDaunSejati)],
    ['Deskripsi Daun Sejati', renderValue(singleFlora.deskripsiDaunSejati)],
    ['Jenis Ranting Fotosintetik', renderValue(singleFlora.jenisRantingFotosintetik)],
    ['Deskripsi Ranting Fotosintetik', renderValue(singleFlora.deskripsiRantingFotosintetik)],
    ['Tipe Sistem Perakaran', renderValue(singleFlora.tipeSistemPerakaran)],
    ['Deskripsi Sistem Perakaran', renderValue(singleFlora.deskripsiSistemPerakaran)],
  ];

  const generativeMorphologyAttributes = [
    ['Tipe Kelamin Bunga', renderValue(singleFlora.morfologiBunga?.tipeKelamin)],
    ['Deskripsi Bunga Jantan', renderValue(singleFlora.morfologiBunga?.deskripsiBungaJantan)],
    ['Deskripsi Bunga Betina', renderValue(singleFlora.morfologiBunga?.deskripsiBungaBetina)],
    ['Waktu Berbunga', renderValue(singleFlora.morfologiBunga?.waktuBerbunga)],
    ['Warna Bunga', renderValue(singleFlora.morfologiBunga?.warnaBunga)],
    ['Tipe Buah', renderValue(singleFlora.morfologiBuah?.tipeBuah)],
    ['Deskripsi Buah', renderValue(singleFlora.morfologiBuah?.deskripsiBuah)],
    ['Ukuran Buah', renderValue(singleFlora.morfologiBuah?.ukuranBuah)],
    ['Warna Buah', renderValue(singleFlora.morfologiBuah?.warnaBuah)],
    ['Waktu Berbuah', renderValue(singleFlora.morfologiBuah?.waktuBerbuah)],
    ['Deskripsi Biji', renderValue(singleFlora.morfologiBiji?.deskripsiBiji)],
    ['Ukuran Biji', renderValue(singleFlora.morfologiBiji?.ukuranBiji)],
    ['Warna Biji', renderValue(singleFlora.morfologiBiji?.warnaBiji)],
    ['Bentuk Biji', renderValue(singleFlora.morfologiBiji?.bentukBiji)],
    ['Mekanisme Penyebaran Biji', formatArray(singleFlora.morfologiBiji?.mekanismePenyebaranBiji)],
    ['Metode Reproduksi', formatArray(singleFlora.metodeReproduksi)],
  ];

  const ecologyGrowthAttributes = [
    ['Musim Tumbuh Optimal', renderValue(singleFlora.musimTumbuhOptimal)],
    ['Habitat Alami', renderValue(singleFlora.habitatAlami)],
    ['Kondisi Tanah Ideal', renderValue(singleFlora.kondisiTanahIdeal)],
    ['pH Tanah Optimal', renderValue(singleFlora.pHTanahOptimal)],
    ['Drainase Tanah Ideal', renderValue(singleFlora.drainaseTanahIdeal)],
    ['Kondisi Iklim Optimal', renderValue(singleFlora.kondisiIklimOptimal)],
    ['Toleransi Kekeringan', renderValue(singleFlora.toleransiKekeringan)],
    ['Toleransi Salinitas', renderValue(singleFlora.toleransiSalinitas)],
    ['Toleransi Angin', renderValue(singleFlora.toleransiAngin)],
    ['Toleransi Suhu', renderValue(singleFlora.toleransiSuhu)],
    ['Sebaran Geografis', renderValue(singleFlora.sebaranGeografis)],
    ['Ketinggian Optimal', renderValue(singleFlora.ketinggianOptimal)],
    ['Laju Pertumbuhan', renderValue(singleFlora.lajuPertumbuhan)],
  ];

  const useStatusAttributes = [
    ['Kegunaan Utama', formatArray(singleFlora.kegunaanUtama)],
    ['Deskripsi Kegunaan', renderValue(singleFlora.deskripsiKegunaan)],
    ['Komponen Bioaktif', formatArray(singleFlora.komponenBioaktif)],
    ['Potensi Ancaman Invasif', renderValue(singleFlora.potensiAncamanInvasif)],
    ['Status Konservasi', renderValue(singleFlora.statusKonservasi)],
    ['Sumber Data Status Konservasi', renderValue(singleFlora.sumberDataStatusKonservasi)],
    ['Nilai Ekologis', renderValue(singleFlora.nilaiEkologis)],
    ['Sifat Kimia', renderValue(singleFlora.sifatKimia)],
    ['Kerentanan Penyakit Hama', renderValue(singleFlora.kerentananPenyakitHama)],
  ];

  const metadataReferencesAttributes = [
    ['Referensi Ilmiah', formatArray(singleFlora.referensiIlmiah)],
    ['Tanggal Penelitian', formatDate(singleFlora.tanggalPenelitian)],
    ['Peneliti', renderValue(singleFlora.peneliti)],
    ['Lokasi Observasi', renderValue(singleFlora.lokasiObservasi)],
    ['Dibuat Oleh', renderValue(singleFlora.createdBy)],
  ];


  return (
    <Box minH={"850vh"} bg={useColorModeValue('rgba(194, 243, 245, 0.9)', "gray.900")} >
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
              aria-label="Kembali ke Perpustakaan Flora"
              onClick={handleGoBack}
              variant="ghost"
              size="lg"
              borderRadius="full"
              _hover={{ bg: useColorModeValue('gray.200', 'whiteAlpha.200') }}
            />
            <VStack align="flex-start" spacing={0}>
              <Heading as="h1" size="2xl" ml={4} color={headingColor}>
                {singleFlora.namaLokal}
              </Heading>
              <Text fontSize="lg" ml={4} color={textColor}>
                ({singleFlora.namaIlmiah})
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
                aria-label="Hapus"
              />
              <IconButton
                icon={<EditIcon />}
                onClick={() => {
                  onUpdateOpen();
                }}
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
                src={singleFlora.image && singleFlora.image.startsWith('http') ? singleFlora.image : null}
                alt={singleFlora.namaLokal}
                w="full"
                objectFit="cover"
                h={500} 
              />
            </Box>

            {singleFlora.urlGambarLain && singleFlora.urlGambarLain.length > 0 && (
              <Box w="full">
                <Text fontWeight="bold" fontSize="xl" color={headingColor} mb={3}>
                  Galeri Gambar Lain
                </Text>
                <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
                  {singleFlora.urlGambarLain.map((url, index) => (
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
            )}

            <Divider borderColor={borderColor} opacity={0.5} />

            {/* Deskripsi Umum  */}
            {singleFlora.deskripsi && (
              <>
                <Heading as="h2" size="lg" color={headingColor}>Deskripsi Umum</Heading>
                <Box w="full">
                  <Text fontSize="lg" color={textColor} whiteSpace="pre-line">
                    {renderValue(singleFlora.deskripsi)}
                  </Text>
                </Box>
                <Divider borderColor={borderColor} opacity={0.5} />
              </>
            )}

            {/* Kategori Taksonomi */}
            {taxonomicAttributes.some(([_, value]) => (typeof value === 'string' && value !== 'N/A') || (typeof value !== 'string')) && (
              <>
                <Heading as="h2" size="lg" color={headingColor}>
                  Klasifikasi Taksonomi
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  {taxonomicAttributes.map(([label, value]) => (
                    <Box key={label}>
                      <Text fontWeight="semibold" fontSize="md" color={subheadingColor}>
                        {label}:
                      </Text>
                      {typeof value === 'string' ? (
                        <Text fontSize="md" color={textColor}>
                          {value}
                        </Text>
                      ) : (
                        value // Render sebagai  component (unorderedList)
                      )}
                    </Box>
                  ))}
                </SimpleGrid>
                <Divider borderColor={borderColor} opacity={0.5} />
              </>
            )}

            {/* Morfologi Vegetatif */}
            {vegetativeMorphologyAttributes.some(([_, value]) => (typeof value === 'string' && value !== 'N/A') || (typeof value !== 'string')) && (
              <>
                <Heading as="h2" size="lg" color={headingColor}>
                  Morfologi Vegetatif
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  {vegetativeMorphologyAttributes.map(([label, value]) => (
                    <Box key={label}>
                      <Text fontWeight="semibold" fontSize="md" color={subheadingColor}>
                        {label}:
                      </Text>
                      {typeof value === 'string' ? (
                        <Text fontSize="md" color={textColor} whiteSpace="pre-line">
                          {value}
                        </Text>
                      ) : (
                        value
                      )}
                    </Box>
                  ))}
                </SimpleGrid>
                <Divider borderColor={borderColor} opacity={0.5} />
              </>
            )}

            {/* Morfologi Generatif */}
            {generativeMorphologyAttributes.some(([_, value]) => (typeof value === 'string' && value !== 'N/A') || (typeof value !== 'string')) && (
              <>
                <Heading as="h2" size="lg" color={headingColor}>
                  Morfologi Generatif
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  {generativeMorphologyAttributes.map(([label, value]) => (
                    <Box key={label}>
                      <Text fontWeight="semibold" fontSize="md" color={subheadingColor}>
                        {label}:
                      </Text>
                      {typeof value === 'string' ? (
                        <Text fontSize="md" color={textColor} whiteSpace="pre-line">
                          {value}
                        </Text>
                      ) : (
                        value
                      )}
                    </Box>
                  ))}
                </SimpleGrid>
                <Divider borderColor={borderColor} opacity={0.5} />
              </>
            )}

            {/* Ekologi dan Kondisi Pertumbuhan */}
            {ecologyGrowthAttributes.some(([_, value]) => (typeof value === 'string' && value !== 'N/A') || (typeof value !== 'string')) && (
              <>
                <Heading as="h2" size="lg" color={headingColor}>
                  Ekologi dan Kondisi Pertumbuhan
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  {ecologyGrowthAttributes.map(([label, value]) => (
                    <Box key={label}>
                      <Text fontWeight="semibold" fontSize="md" color={subheadingColor}>
                        {label}:
                      </Text>
                      {typeof value === 'string' ? (
                        <Text fontSize="md" color={textColor} whiteSpace="pre-line">
                          {value}
                        </Text>
                      ) : (
                        value
                      )}
                    </Box>
                  ))}
                </SimpleGrid>
                <Divider borderColor={borderColor} opacity={0.5} />
              </>
            )}

            {/* Kegunaan dan Status */}
            {useStatusAttributes.some(([_, value]) => (typeof value === 'string' && value !== 'N/A') || (typeof value !== 'string')) && (
              <>
                <Heading as="h2" size="lg" color={headingColor}>
                  Kegunaan dan Status
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  {useStatusAttributes.map(([label, value]) => (
                    <Box key={label}>
                      <Text fontWeight="semibold" fontSize="md" color={subheadingColor}>
                        {label}:
                      </Text>
                      {typeof value === 'string' ? (
                        <Text fontSize="md" color={textColor} whiteSpace="pre-line">
                          {value}
                        </Text>
                      ) : (
                        value
                      )}
                    </Box>
                  ))}
                </SimpleGrid>
                <Divider borderColor={borderColor} opacity={0.5} />
              </>
            )}

            {/* Metadata dan Referensi */}
            {metadataReferencesAttributes.some(([_, value]) => (typeof value === 'string' && value !== 'N/A') || (typeof value !== 'string')) && (
              <>
                <Heading as="h2" size="lg" color={headingColor}>
                  Metadata dan Referensi
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  {metadataReferencesAttributes.map(([label, value]) => (
                    <Box key={label}>
                      <Text fontWeight="semibold" fontSize="md" color={subheadingColor}>
                        {label}:
                      </Text>
                      {typeof value === 'string' ? (
                        <Text fontSize="md" color={textColor} whiteSpace="pre-line">
                          {value}
                        </Text>
                      ) : (
                        value
                      )}
                    </Box>
                  ))}
                </SimpleGrid>
                <Divider borderColor={borderColor} opacity={0.5} />
              </>
            )}

            {singleFlora.catatanTambahan && (
              <Box w="full">
                <Heading as="h2" size="lg" color={headingColor} mb={4}>
                  Catatan Tambahan
                </Heading>
                <Text fontSize="lg" color={textColor} whiteSpace="pre-line">
                  {renderValue(singleFlora.catatanTambahan)}
                </Text>
              </Box>
            )}

          </VStack>
        </MotionBox>

        {canEditOrDelete && (
          <>
            <FloraFormModal
              isOpen={isUpdateOpen}
              onClose={onUpdateClose}
              flora={singleFlora}
              onSubmit={async (formData) => {
                await updateFlora(formData._id, formData);
                await fetchFloraById(formData._id);
                onUpdateClose();
              }}
              isEdit
            />

            <DeleteConfirmationModal
              isOpen={isDeleteOpen}
              onClose={onDeleteClose}
              onConfirm={async () => {
                await deleteFlora(singleFlora._id);
                onDeleteClose();
                navigate('/Flora');
              }}
              title="Hapus Flora"
              body={`Apakah Anda yakin ingin menghapus "${singleFlora.namaLokal}"? Tindakan ini tidak dapat dibatalkan.`}
            />
          </>
        )}
      </MotionContainer>
    </Box>
  );
};

export default FloraDetailPage;