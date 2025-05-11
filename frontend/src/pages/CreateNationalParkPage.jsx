// pages/CreateNationalParkPage.jsx
import React, { useState, useEffect, useRef } from 'react';
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
    Textarea,
    Image,
    Spinner,
    HStack,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    FormControl,
    FormLabel,
} from '@chakra-ui/react';
import { useNationalParkStore } from '../store/nationalPark'; // Pastikan Anda mengimpor store yang benar
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import axios from 'axios';

// Menggunakan motion(Component) adalah cara yang benar untuk membungkus komponen Chakra UI
const MotionBox = motion(Box);
const MotionButton = motion(Button);

const CreateNationalParkPage = () => {
    const [formData, setFormData] = useState({
        namaResmi: '',
        lokasi: '',
        wilayahAdministratif: '', // Akan di-parse dari string
        image: null, // Akan di-parse dari string
        koordinatGeografis: { lintang: '', bujur: '' },
        luas: { value: '', unit: 'Hektar', referensi: '' },
        ketinggian: { min: '', max: '', unit: 'mdpl' },
        topografi: '',
        geologi: '',
        iklim: {
            tipe: '',
            curahHujanRataRata: { value: '', unit: 'mm/tahun' },
            suhuRataRata: { kakiGunung: '', puncak: '' },
            kelembabanUdaraRataRata: { value: '', unit: '%' },
        },
        ekosistemHabitat: '', // Akan di-parse dari string
        flora: {
            jumlahJenis: '',
            pohonDominan: '', // Akan di-parse dari string
            tumbuhanBawahSemak: '', // Akan di-parse dari string
            tumbuhanPionir: '', // Akan di-parse dari string
            tumbuhanKhasEndemik: '', // Akan di-parse dari string
        },
        fauna: {
            jumlahJenis: { burung: '', mamalia: '', reptil: '', amfibi: '' },
            mamalia: '', // Akan di-parse dari string
            burung: '', // Akan di-parse dari string
        },
        sejarahSingkat: '', // Akan di-parse dari string
        aktivitasPengelolaan: '', // Akan di-parse dari string
        fasilitasPendukung: '', // Akan di-parse dari string
        ancamanKonservasi: '', // Akan di-parse dari string
        upayaKonservasi: '', // Akan di-parse dari string
    });

    const fileInputRef = useRef(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();
    const { createNationalPark } = useNationalParkStore(); // Action dari store

    const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    // Style definitions
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

    useEffect(() => {
        return () => {
            if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreviewUrl);
            }
        };
    }, [imagePreviewUrl]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (name.startsWith('koordinatGeografis.')) {
            const subKey = name.split('.')[1];
            setFormData((prev) => ({
                ...prev,
                koordinatGeografis: { ...prev.koordinatGeografis, [subKey]: value },
            }));
        } else if (name.startsWith('luas.')) {
            const subKey = name.split('.')[1];
            setFormData((prev) => ({
                ...prev,
                luas: { ...prev.luas, [subKey]: value },
            }));
        } else if (name.startsWith('ketinggian.')) {
            const subKey = name.split('.')[1];
            setFormData((prev) => ({
                ...prev,
                ketinggian: { ...prev.ketinggian, [subKey]: value },
            }));
        } else if (name.startsWith('iklim.curahHujanRataRata.')) {
            const subKey = name.split('.')[2];
            setFormData((prev) => ({
                ...prev,
                iklim: {
                    ...prev.iklim,
                    curahHujanRataRata: { ...prev.iklim.curahHujanRataRata, [subKey]: value },
                },
            }));
        } else if (name.startsWith('iklim.suhuRataRata.')) {
            const subKey = name.split('.')[2];
            setFormData((prev) => ({
                ...prev,
                iklim: {
                    ...prev.iklim,
                    suhuRataRata: { ...prev.iklim.suhuRataRata, [subKey]: value },
                },
            }));
        } else if (name.startsWith('iklim.kelembabanUdaraRataRata.')) {
            const subKey = name.split('.')[2];
            setFormData((prev) => ({
                ...prev,
                iklim: {
                    ...prev.iklim,
                    kelembabanUdaraRataRata: { ...prev.iklim.kelembabanUdaraRataRata, [subKey]: value },
                },
            }));
        } else if (name.startsWith('iklim.')) {
            const subKey = name.split('.')[1];
            setFormData((prev) => ({
                ...prev,
                iklim: { ...prev.iklim, [subKey]: value },
            }));
        } else if (name.startsWith('flora.')) {
            const subKey = name.split('.')[1];
            setFormData((prev) => ({
                ...prev,
                flora: { ...prev.flora, [subKey]: value },
            }));
        } else if (name.startsWith('fauna.jumlahJenis.')) {
            const subKey = name.split('.')[2];
            setFormData((prev) => ({
                ...prev,
                fauna: {
                    ...prev.fauna,
                    jumlahJenis: { ...prev.fauna.jumlahJenis, [subKey]: value },
                },
            }));
        } else if (name.startsWith('fauna.')) {
            const subKey = name.split('.')[1];
            setFormData((prev) => ({
                ...prev,
                fauna: { ...prev.fauna, [subKey]: value },
            }));
        } else if (type === 'file' && files && files[0]) {
            const file = files[0];
            setFormData((prev) => ({
                ...prev,
                [name]: file,
            }));
            if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreviewUrl);
            }
            setImagePreviewUrl(URL.createObjectURL(file));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleNumberInputChange = (valueAsString, valueAsNumber, parentKey, subKey) => {
        setFormData((prev) => {
            const newState = { ...prev };
            if (parentKey && subKey) {
                newState[parentKey] = {
                    ...newState[parentKey],
                    [subKey]: valueAsNumber,
                };
            }
            return newState;
        });
    };

    const handleChooseImage = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async () => {
        if (!formData.image) {
            toast({
                title: "Error",
                description: "Please select an image to upload.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setIsUploadingImage(true);
        let finalImageUrl = '';

        try {
            const cloudinaryFormData = new FormData();
            cloudinaryFormData.append('file', formData.image);
            cloudinaryFormData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

            const cloudinaryAxios = axios.create();
            delete cloudinaryAxios.defaults.headers.common['Authorization'];

            const cloudinaryResponse = await cloudinaryAxios.post(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                cloudinaryFormData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            finalImageUrl = cloudinaryResponse.data.secure_url;
            toast({
                title: "Upload Successful",
                description: "Image successfully uploaded to Cloudinary.",
                status: "success",
                duration: 2000,
                isClosable: true,
            });
        } catch (uploadError) {
            setIsUploadingImage(false);
            console.error('Error uploading image to Cloudinary:', uploadError.response?.data || uploadError.message);
            toast({
                title: "Upload Failed",
                description: uploadError.response?.data?.error?.message || "Failed to upload image to Cloudinary.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        } finally {
            setIsUploadingImage(false);
        }

        // Helper function to parse multiline strings into arrays
        const parseMultilineString = (str) => str.split('\n').map(line => line.trim()).filter(Boolean);

        // Helper function to parse "Nama: Deskripsi (Detail)" format for array of objects
        const parseComplexArray = (str, type) => {
            const lines = parseMultilineString(str);
            return lines.map(line => {
                if (type === 'ekosistemHabitat' || type === 'aktivitasPengelolaan') {
                    const [nama, rest] = line.split(':', 2);
                    let deskripsi = rest ? rest.trim() : '';
                    let detail = [];
                    if (deskripsi.includes('(') && deskripsi.endsWith(')')) {
                        const detailPart = deskripsi.substring(deskripsi.indexOf('(') + 1, deskripsi.lastIndexOf(')'));
                        deskripsi = deskripsi.substring(0, deskripsi.indexOf('(')).trim();
                        detail = detailPart.split(';').map(d => d.trim()).filter(Boolean);
                    }
                    return { nama: nama?.trim() || '', deskripsi, detail: type === 'aktivitasPengelolaan' ? detail : undefined };
                } else if (type === 'floraSpecies' || type === 'faunaSpecies') {
                    const match = line.match(/(.*?)\s*\((.*?)\)\s*-\s*(.*)/);
                    if (match) {
                        return {
                            namaLokal: match[1]?.trim() || '',
                            namaIlmiah: match[2]?.trim() || '',
                            keterangan: match[3]?.trim() || ''
                        };
                    }
                    const simpleMatch = line.match(/(.*?)\s*\((.*?)\)/);
                    if (simpleMatch) {
                        return {
                            namaLokal: simpleMatch[1]?.trim() || '',
                            namaIlmiah: simpleMatch[2]?.trim() || '',
                            keterangan: ''
                        };
                    }
                    return { namaLokal: line.trim(), namaIlmiah: '', keterangan: '' };
                } else if (type === 'faunaCategory') {
                    const [kategori, jenisStr] = line.split(':', 2);
                    const jenisItems = jenisStr ? jenisStr.split(';').map(j => {
                        const match = j.match(/(.*?)\s*\((.*?)\)\s*-\s*(.*)/);
                        if (match) {
                            return {
                                namaLokal: match[1]?.trim() || '',
                                namaIlmiah: match[2]?.trim() || '',
                                keterangan: match[3]?.trim() || ''
                            };
                        }
                        const simpleMatch = j.match(/(.*?)\s*\((.*?)\)/);
                        if (simpleMatch) {
                            return {
                                namaLokal: simpleMatch[1]?.trim() || '',
                                namaIlmiah: simpleMatch[2]?.trim() || '',
                                keterangan: ''
                            };
                        }
                        return { namaLokal: j.trim(), namaIlmiah: '', keterangan: '' };
                    }).filter(Boolean) : [];
                    return { kategori: kategori?.trim() || '', jenis: jenisItems };
                }
                return {};
            });
        };

        const dataToSubmit = {
            namaResmi: formData.namaResmi,
            lokasi: formData.lokasi,
            wilayahAdministratif: parseMultilineString(formData.wilayahAdministratif),
            image: finalImageUrl,
            koordinatGeografis: {
                lintang: formData.koordinatGeografis.lintang,
                bujur: formData.koordinatGeografis.bujur,
            },
            luas: {
                value: parseFloat(formData.luas.value) || 0,
                unit: formData.luas.unit,
                referensi: formData.luas.referensi,
            },
            ketinggian: {
                min: parseFloat(formData.ketinggian.min) || 0,
                max: parseFloat(formData.ketinggian.max) || 0,
                unit: formData.ketinggian.unit,
            },
            topografi: formData.topografi,
            geologi: formData.geologi,
            iklim: {
                tipe: formData.iklim.tipe,
                curahHujanRataRata: {
                    value: formData.iklim.curahHujanRataRata.value,
                    unit: formData.iklim.curahHujanRataRata.unit,
                },
                suhuRataRata: {
                    kakiGunung: formData.iklim.suhuRataRata.kakiGunung,
                    puncak: formData.iklim.suhuRataRata.puncak,
                },
                kelembabanUdaraRataRata: {
                    value: formData.iklim.kelembabanUdaraRataRata.value,
                    unit: formData.iklim.kelembabanUdaraRataRata.unit,
                },
            },
            ekosistemHabitat: parseComplexArray(formData.ekosistemHabitat, 'ekosistemHabitat'),
            flora: {
                jumlahJenis: formData.flora.jumlahJenis,
                pohonDominan: parseComplexArray(formData.flora.pohonDominan, 'floraSpecies'),
                tumbuhanBawahSemak: parseComplexArray(formData.flora.tumbuhanBawahSemak, 'floraSpecies'),
                tumbuhanPionir: parseComplexArray(formData.flora.tumbuhanPionir, 'floraSpecies'),
                tumbuhanKhasEndemik: parseComplexArray(formData.flora.tumbuhanKhasEndemik, 'floraSpecies'),
            },
            fauna: {
                jumlahJenis: {
                    burung: formData.fauna.jumlahJenis.burung,
                    mamalia: formData.fauna.jumlahJenis.mamalia,
                    reptil: formData.fauna.jumlahJenis.reptil,
                    amfibi: formData.fauna.jumlahJenis.amfibi,
                },
                mamalia: parseComplexArray(formData.fauna.mamalia, 'faunaCategory'),
                burung: parseComplexArray(formData.fauna.burung, 'faunaCategory'),
            },
            sejarahSingkat: parseMultilineString(formData.sejarahSingkat),
            aktivitasPengelolaan: parseComplexArray(formData.aktivitasPengelolaan, 'aktivitasPengelolaan'),
            fasilitasPendukung: parseMultilineString(formData.fasilitasPendukung),
            ancamanKonservasi: parseMultilineString(formData.ancamanKonservasi),
            upayaKonservasi: parseMultilineString(formData.upayaKonservasi),
        };

        console.log('Final data to submit for National Park:', dataToSubmit);

        try {
            const { success, message } = await createNationalPark(dataToSubmit);

            if (!success) {
                toast({ title: "Error", description: message, status: "error", duration: 3000, isClosable: true });
            } else {
                toast({ title: "Success", description: message, status: "success", duration: 3000, isClosable: true });
                // Reset form
                setFormData({
                    namaResmi: '', lokasi: '', wilayahAdministratif: '', image: null,
                    koordinatGeografis: { lintang: '', bujur: '' },
                    luas: { value: '', unit: 'Hektar', referensi: '' },
                    ketinggian: { min: '', max: '', unit: 'mdpl' },
                    topografi: '', geologi: '',
                    iklim: {
                        tipe: '',
                        curahHujanRataRata: { value: '', unit: 'mm/tahun' },
                        suhuRataRata: { kakiGunung: '', puncak: '' },
                        kelembabanUdaraRataRata: { value: '', unit: '%' },
                    },
                    ekosistemHabitat: '',
                    flora: {
                        jumlahJenis: '', pohonDominan: '', tumbuhanBawahSemak: '',
                        tumbuhanPionir: '', tumbuhanKhasEndemik: '',
                    },
                    fauna: {
                        jumlahJenis: { burung: '', mamalia: '', reptil: '', amfibi: '' },
                        mamalia: '', burung: '',
                    },
                    sejarahSingkat: '', aktivitasPengelolaan: '', fasilitasPendukung: '',
                    ancamanKonservasi: '', upayaKonservasi: ''
                });
                setImagePreviewUrl(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                navigate('/NationalPark'); // Arahkan ke halaman daftar taman nasional
            }
        } catch (error) {
            toast({
                title: "Failed",
                description: error.message || "An error occurred while creating the National Park.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            console.error("Error creating National Park via store action:", error);
        }
    };

    const handleGoBack = () => {
        navigate('/NationalPark'); // Arahkan ke halaman daftar taman nasional
    };

    return (
        <Container maxW="container.md" mt={10} pb={10}>
            <Flex mb={8} align="center">
                <IconButton
                    icon={<ArrowLeftIcon />}
                    aria-label="Back to National Parks"
                    onClick={handleGoBack}
                    variant="ghost"
                    size="lg"
                    borderRadius="full"
                    _hover={{ bg: useColorModeValue('gray.200', 'whiteAlpha.200') }}
                />
                <Heading as="h1" size="2xl" textAlign="center" ml={4} color="white">
                    Add New National Park
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
                    {/* Nama Resmi */}
                    <FormControl id="namaResmi" isRequired>
                        <FormLabel>Nama Resmi</FormLabel>
                        <Input
                            name="namaResmi"
                            value={formData.namaResmi}
                            onChange={handleChange}
                            {...inputStyle}
                        />
                    </FormControl>

                    {/* Lokasi */}
                    <FormControl id="lokasi" isRequired>
                        <FormLabel>Lokasi</FormLabel>
                        <Input
                            name="lokasi"
                            value={formData.lokasi}
                            onChange={handleChange}
                            {...inputStyle}
                        />
                    </FormControl>

                    {/* Wilayah Administratif */}
                    <FormControl id="wilayahAdministratif" isRequired>
                        <FormLabel>Wilayah Administratif (Pisahkan dengan baris baru)</FormLabel>
                        <Textarea
                            name="wilayahAdministratif"
                            value={formData.wilayahAdministratif}
                            onChange={handleChange}
                            placeholder="Contoh:&#x0A;Kabupaten Boyolali&#x0A;Kabupaten Klaten"
                            {...inputStyle}
                        />
                    </FormControl>

                    {/* Image Upload */}
                    <FormControl id="image" isRequired>
                        <FormLabel>Image</FormLabel>
                        <Box>
                            {imagePreviewUrl && (
                                <Image
                                    src={imagePreviewUrl}
                                    alt="National Park Image Preview"
                                    maxH="200px"
                                    objectFit="contain"
                                    mb={2}
                                />
                            )}
                            {formData.image && typeof formData.image !== 'string' && (
                                <Text fontSize="sm" color="gray.500" mb={2}>Selected File: {formData.image.name}</Text>
                            )}
                            {!imagePreviewUrl && !formData.image && (
                                <Text fontSize="sm" color="gray.500" mb={2}>No image chosen</Text>
                            )}

                            <Button onClick={handleChooseImage} size="sm" colorScheme="blue">
                                Choose Image
                            </Button>
                            <Input
                                type="file"
                                name="image"
                                onChange={handleChange}
                                style={{ display: 'none' }}
                                ref={fileInputRef}
                                accept="image/*"
                            />
                        </Box>
                    </FormControl>

                    {/* Koordinat Geografis */}
                    <FormControl id="koordinatGeografis">
                        <FormLabel>Koordinat Geografis</FormLabel>
                        <HStack>
                            <Input
                                name="koordinatGeografis.lintang"
                                placeholder="Lintang (Contoh: 7°32′ – 7°42′ LS)"
                                value={formData.koordinatGeografis.lintang}
                                onChange={handleChange}
                                {...inputStyle}
                            />
                            <Input
                                name="koordinatGeografis.bujur"
                                placeholder="Bujur (Contoh: 110°22′ – 110°32′ BT)"
                                value={formData.koordinatGeografis.bujur}
                                onChange={handleChange}
                                {...inputStyle}
                            />
                        </HStack>
                    </FormControl>

                    {/* Luas */}
                    <FormControl id="luas" isRequired>
                        <FormLabel>Luas</FormLabel>
                        <HStack>
                            <NumberInput
                                value={formData.luas.value}
                                onChange={(valStr, valNum) => handleNumberInputChange(valStr, valNum, 'luas', 'value')}
                                min={0}
                                flex="1"
                            >
                                <NumberInputField placeholder="Value" {...inputStyle} />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            <Input
                                name="luas.unit"
                                value={formData.luas.unit}
                                onChange={handleChange}
                                placeholder="Unit (e.g., Hektar)"
                                flex="0.5"
                                {...inputStyle}
                            />
                        </HStack>
                        <Input
                            name="luas.referensi"
                            value={formData.luas.referensi}
                            onChange={handleChange}
                            placeholder="Referensi Luas (Contoh: Keputusan Menteri Kehutanan Nomor SK.653/Menhut-II/2004)"
                            mt={2}
                            {...inputStyle}
                        />
                    </FormControl>

                    {/* Ketinggian */}
                    <FormControl id="ketinggian" isRequired>
                        <FormLabel>Ketinggian</FormLabel>
                        <HStack>
                            <NumberInput
                                value={formData.ketinggian.min}
                                onChange={(valStr, valNum) => handleNumberInputChange(valStr, valNum, 'ketinggian', 'min')}
                                min={0}
                                flex="1"
                            >
                                <NumberInputField placeholder="Min (mdpl)" {...inputStyle} />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            <NumberInput
                                value={formData.ketinggian.max}
                                onChange={(valStr, valNum) => handleNumberInputChange(valStr, valNum, 'ketinggian', 'max')}
                                min={0}
                                flex="1"
                            >
                                <NumberInputField placeholder="Max (mdpl)" {...inputStyle} />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            <Input
                                name="ketinggian.unit"
                                value={formData.ketinggian.unit}
                                onChange={handleChange}
                                placeholder="Unit (e.g., mdpl)"
                                flex="0.5"
                                {...inputStyle}
                            />
                        </HStack>
                    </FormControl>

                    {/* Topografi */}
                    <FormControl id="topografi">
                        <FormLabel>Topografi</FormLabel>
                        <Textarea
                            name="topografi"
                            value={formData.topografi}
                            onChange={handleChange}
                            {...inputStyle}
                        />
                    </FormControl>

                    {/* Geologi */}
                    <FormControl id="geologi">
                        <FormLabel>Geologi</FormLabel>
                        <Textarea
                            name="geologi"
                            value={formData.geologi}
                            onChange={handleChange}
                            {...inputStyle}
                        />
                    </FormControl>

                    {/* Iklim */}
                    <FormControl id="iklim">
                        <FormLabel>Iklim</FormLabel>
                        <VStack spacing={2} align="stretch" pl={4} borderLeft="1px solid gray" borderColor="gray.200">
                            <Input
                                name="iklim.tipe"
                                placeholder="Tipe (Contoh: Tipe iklim B (basah) dan C (sedang))"
                                value={formData.iklim.tipe}
                                onChange={handleChange}
                                {...inputStyle}
                            />
                            <HStack>
                                <Input
                                    name="iklim.curahHujanRataRata.value"
                                    placeholder="Curah Hujan Rata-Rata (Contoh: 2.500 – 3.500)"
                                    value={formData.iklim.curahHujanRataRata.value}
                                    onChange={handleChange}
                                    flex="1"
                                    {...inputStyle}
                                />
                                <Input
                                    name="iklim.curahHujanRataRata.unit"
                                    value={formData.iklim.curahHujanRataRata.unit}
                                    onChange={handleChange}
                                    placeholder="Unit (e.g., mm/tahun)"
                                    flex="0.5"
                                    {...inputStyle}
                                />
                            </HStack>
                            <FormLabel mt={2}>Suhu Rata-Rata</FormLabel>
                            <HStack>
                                <Input
                                    name="iklim.suhuRataRata.kakiGunung"
                                    placeholder="Kaki Gunung (Contoh: 20°C – 28°C)"
                                    value={formData.iklim.suhuRataRata.kakiGunung}
                                    onChange={handleChange}
                                    {...inputStyle}
                                />
                                <Input
                                    name="iklim.suhuRataRata.puncak"
                                    placeholder="Puncak (Contoh: di bawah 10°C)"
                                    value={formData.iklim.suhuRataRata.puncak}
                                    onChange={handleChange}
                                    {...inputStyle}
                                />
                            </HStack>
                            <FormLabel mt={2}>Kelembaban Udara Rata-Rata</FormLabel>
                            <HStack>
                                <Input
                                    name="iklim.kelembabanUdaraRataRata.value"
                                    placeholder="Value (Contoh: Tinggi, seringkali di atas 80%)"
                                    value={formData.iklim.kelembabanUdaraRataRata.value}
                                    onChange={handleChange}
                                    flex="1"
                                    {...inputStyle}
                                />
                                <Input
                                    name="iklim.kelembabanUdaraRataRata.unit"
                                    value={formData.iklim.kelembabanUdaraRataRata.unit}
                                    onChange={handleChange}
                                    placeholder="Unit (e.g., %)"
                                    flex="0.5"
                                    {...inputStyle}
                                />
                            </HStack>
                        </VStack>
                    </FormControl>

                    {/* Ekosistem & Habitat */}
                    <FormControl id="ekosistemHabitat">
                        <FormLabel>Ekosistem & Habitat (Format: Nama: Deskripsi)</FormLabel>
                        <Textarea
                            name="ekosistemHabitat"
                            value={formData.ekosistemHabitat}
                            onChange={handleChange}
                            placeholder="Contoh:&#x0A;Kawasan Puncak dan Lereng Atas: Hutan montana dengan jenis pohon khas seperti cemara gunung."
                            {...inputStyle}
                        />
                    </FormControl>

                    {/* Flora */}
                    <FormControl id="flora">
                        <FormLabel>Flora</FormLabel>
                        <VStack spacing={2} align="stretch" pl={4} borderLeft="1px solid gray" borderColor="gray.200">
                            <Input
                                name="flora.jumlahJenis"
                                placeholder="Jumlah Jenis Flora (Contoh: Diperkirakan lebih dari 500 jenis tumbuhan berpembuluh.)"
                                value={formData.flora.jumlahJenis}
                                onChange={handleChange}
                                {...inputStyle}
                            />
                            <FormLabel mt={2}>Pohon Dominan (Format: Lokal (Ilmiah) - Keterangan)</FormLabel>
                            <Textarea
                                name="flora.pohonDominan"
                                value={formData.flora.pohonDominan}
                                onChange={handleChange}
                                placeholder="Contoh:&#x0A;Jati (Tectona grandis) - Tumbuh di daerah dataran rendah&#x0A;Damar (Agathis borneensis) - Pohon tinggi khas hutan hujan"
                                {...inputStyle}
                            />
                            <FormLabel mt={2}>Tumbuhan Bawah & Semak (Format: Lokal (Ilmiah) - Keterangan)</FormLabel>
                            <Textarea
                                name="flora.tumbuhanBawahSemak"
                                value={formData.flora.tumbuhanBawahSemak}
                                onChange={handleChange}
                                placeholder="Contoh:&#x0A;Rafflesia (Rafflesia arnoldii) - Bunga bangkai terbesar"
                                {...inputStyle}
                            />
                            <FormLabel mt={2}>Tumbuhan Pionir (Format: Lokal (Ilmiah) - Keterangan)</FormLabel>
                            <Textarea
                                name="flora.tumbuhanPionir"
                                value={formData.flora.tumbuhanPionir}
                                onChange={handleChange}
                                placeholder="Contoh:&#x0A;Rumput Gajah (Pennisetum purpureum) - Tumbuh cepat setelah gangguan"
                                {...inputStyle}
                            />
                            <FormLabel mt={2}>Tumbuhan Khas & Endemik (Format: Lokal (Ilmiah) - Keterangan)</FormLabel>
                            <Textarea
                                name="flora.tumbuhanKhasEndemik"
                                value={formData.flora.tumbuhanKhasEndemik}
                                onChange={handleChange}
                                placeholder="Contoh:&#x0A;Anggrek Bulan (Phalaenopsis amabilis) - Anggrek endemik"
                                {...inputStyle}
                            />
                        </VStack>
                    </FormControl>

                    {/* Fauna */}
                    <FormControl id="fauna">
                        <FormLabel>Fauna</FormLabel>
                        <VStack spacing={2} align="stretch" pl={4} borderLeft="1px solid gray" borderColor="gray.200">
                            <FormLabel>Jumlah Jenis</FormLabel>
                            <HStack>
                                <Input
                                    name="fauna.jumlahJenis.burung"
                                    placeholder="Burung (Contoh: lebih dari 100 jenis burung)"
                                    value={formData.fauna.jumlahJenis.burung}
                                    onChange={handleChange}
                                    {...inputStyle}
                                />
                                <Input
                                    name="fauna.jumlahJenis.mamalia"
                                    placeholder="Mamalia"
                                    value={formData.fauna.jumlahJenis.mamalia}
                                    onChange={handleChange}
                                    {...inputStyle}
                                />
                            </HStack>
                            <HStack>
                                <Input
                                    name="fauna.jumlahJenis.reptil"
                                    placeholder="Reptil"
                                    value={formData.fauna.jumlahJenis.reptil}
                                    onChange={handleChange}
                                    {...inputStyle}
                                />
                                <Input
                                    name="fauna.jumlahJenis.amfibi"
                                    placeholder="Amfibi"
                                    value={formData.fauna.jumlahJenis.amfibi}
                                    onChange={handleChange}
                                    {...inputStyle}
                                />
                            </HStack>
                            <FormLabel mt={2}>Mamalia (Format: Kategori: Lokal (Ilmiah) - Keterangan; ...)</FormLabel>
                            <Textarea
                                name="fauna.mamalia"
                                value={formData.fauna.mamalia}
                                onChange={handleChange}
                                placeholder="Contoh:&#x0A;Primata: Orangutan Sumatera (Pongo abelii) - Spesies terancam kritis; Siamang (Symphalangus syndactylus)&#x0A;Karnivora: Harimau Sumatera (Panthera tigris sumatrae) - Kucing besar endemik Sumatera"
                                {...inputStyle}
                            />
                            <FormLabel mt={2}>Burung (Format: Kategori: Lokal (Ilmiah) - Keterangan; ...)</FormLabel>
                            <Textarea
                                name="fauna.burung"
                                value={formData.fauna.burung}
                                onChange={handleChange}
                                placeholder="Contoh:&#x0A;Elang: Elang Jawa (Nisaetus bartelsi) - Burung pemangsa endemik Jawa"
                                {...inputStyle}
                            />
                        </VStack>
                    </FormControl>

                    {/* Sejarah Singkat */}
                    <FormControl id="sejarahSingkat">
                        <FormLabel>Sejarah Singkat (Pisahkan dengan baris baru)</FormLabel>
                        <Textarea
                            name="sejarahSingkat"
                            value={formData.sejarahSingkat}
                            onChange={handleChange}
                            placeholder="Contoh:&#x0A;1980: Ditetapkan sebagai Cagar Alam&#x0A;1992: Diubah statusnya menjadi Taman Nasional"
                            {...inputStyle}
                        />
                    </FormControl>

                    {/* Aktivitas Pengelolaan */}
                    <FormControl id="aktivitasPengelolaan">
                        <FormLabel>Aktivitas Pengelolaan (Format: Nama: Deskripsi (Detail1; Detail2))</FormLabel>
                        <Textarea
                            name="aktivitasPengelolaan"
                            value={formData.aktivitasPengelolaan}
                            onChange={handleChange}
                            placeholder="Contoh:&#x0A;Ekowisata: Trekking; Pengamatan Burung; Rafting&#x0A;Konservasi: Patroli Anti Perburuan; Rehabilitasi Satwa"
                            {...inputStyle}
                        />
                    </FormControl>

                    {/* Fasilitas Pendukung */}
                    <FormControl id="fasilitasPendukung">
                        <FormLabel>Fasilitas Pendukung (Pisahkan dengan baris baru)</FormLabel>
                        <Textarea
                            name="fasilitasPendukung"
                            value={formData.fasilitasPendukung}
                            onChange={handleChange}
                            placeholder="Contoh:&#x0A;Pusat Informasi&#x0A;Homestay&#x0A;Jalur Trekking"
                            {...inputStyle}
                        />
                    </FormControl>

                    {/* Ancaman Konservasi */}
                    <FormControl id="ancamanKonservasi">
                        <FormLabel>Ancaman Konservasi (Pisahkan dengan baris baru)</FormLabel>
                        <Textarea
                            name="ancamanKonservasi"
                            value={formData.ancamanKonservasi}
                            onChange={handleChange}
                            placeholder="Contoh:&#x0A;Perburuan Liar&#x0A;Perambahan Hutan&#x0A;Perubahan Iklim"
                            {...inputStyle}
                        />
                    </FormControl>

                    {/* Upaya Konservasi */}
                    <FormControl id="upayaKonservasi">
                        <FormLabel>Upaya Konservasi (Pisahkan dengan baris baru)</FormLabel>
                        <Textarea
                            name="upayaKonservasi"
                            value={formData.upayaKonservasi}
                            onChange={handleChange}
                            placeholder="Contoh:&#x0A;Peningkatan Patroli&#x0A;Penyuluhan Masyarakat&#x0A;Penanaman Kembali"
                            {...inputStyle}
                        />
                    </FormControl>


                    <MotionButton
                        onClick={handleSubmit}
                        w="full"
                        {...buttonStyle}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        isLoading={isUploadingImage || createNationalPark.loading}
                        loadingText={isUploadingImage ? "Uploading Image..." : "Adding National Park..."}
                    >
                        Add National Park
                    </MotionButton>
                </VStack>
            </MotionBox>
        </Container>
    );
};

export default CreateNationalParkPage;