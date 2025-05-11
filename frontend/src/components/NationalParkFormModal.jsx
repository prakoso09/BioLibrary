// components/modals/NationalParkFormModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    VStack,
    Image,
    Box,
    Text,
    useToast,
    Spinner,
    HStack,
    NumberInput, // Untuk input angka
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Select // Untuk dropdown
} from '@chakra-ui/react';
import axios from 'axios';

const NationalParkFormModal = ({ isOpen, onClose, nationalPark, onSubmit, isEdit }) => {
    const [formData, setFormData] = useState({
        namaResmi: '',
        lokasi: '',
        wilayahAdministratif: '', // Akan di-parse dari string
        image: null,
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
        createdBy: '', // Akan diisi otomatis atau dari user yang login
    });

    const fileInputRef = useRef(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const toast = useToast();

    const initialNationalParkState = useRef(null);

    const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    useEffect(() => {
        if (nationalPark) {
            initialNationalParkState.current = nationalPark;
        }
    }, [nationalPark]);

    useEffect(() => {
        if (isEdit && nationalPark) {
            const mapArrayToString = (arr) => Array.isArray(arr) ? arr.join('\n') : '';
            const mapNestedArrayToString = (arr) => Array.isArray(arr) ? arr.map(item => {
                if (item.kategori && item.jenis) { // For fauna mamalia/burung
                    return `${item.kategori}: ${item.jenis.map(j => `${j.namaLokal || ''} (${j.namaIlmiah || ''}) - ${j.keterangan || ''}`).join('; ')}`;
                } else if (item.namaLokal || item.namaIlmiah) { // For flora species
                    return `${item.namaLokal || ''} (${item.namaIlmiah || ''}) - ${item.keterangan || ''}`;
                } else if (item.nama && item.deskripsi) { // For ekosistemHabitat, aktivitasPengelolaan
                    return `${item.nama}: ${item.deskripsi}${item.detail ? ' (' + item.detail.join(', ') + ')' : ''}`;
                }
                return '';
            }).filter(Boolean).join('\n') : '';

            setFormData({
                namaResmi: nationalPark.namaResmi || '',
                lokasi: nationalPark.lokasi || '',
                wilayahAdministratif: mapArrayToString(nationalPark.wilayahAdministratif),
                image: nationalPark.image || null,
                koordinatGeografis: {
                    lintang: nationalPark.koordinatGeografis?.lintang || '',
                    bujur: nationalPark.koordinatGeografis?.bujur || '',
                },
                luas: {
                    value: nationalPark.luas?.value?.toString() || '',
                    unit: nationalPark.luas?.unit || 'Hektar',
                    referensi: nationalPark.luas?.referensi || '',
                },
                ketinggian: {
                    min: nationalPark.ketinggian?.min?.toString() || '',
                    max: nationalPark.ketinggian?.max?.toString() || '',
                    unit: nationalPark.ketinggian?.unit || 'mdpl',
                },
                topografi: nationalPark.topografi || '',
                geologi: nationalPark.geologi || '',
                iklim: {
                    tipe: nationalPark.iklim?.tipe || '',
                    curahHujanRataRata: {
                        value: nationalPark.iklim?.curahHujanRataRata?.value || '',
                        unit: nationalPark.iklim?.curahHujanRataRata?.unit || 'mm/tahun',
                    },
                    suhuRataRata: {
                        kakiGunung: nationalPark.iklim?.suhuRataRata?.kakiGunung || '',
                        puncak: nationalPark.iklim?.suhuRataRata?.puncak || '',
                    },
                    kelembabanUdaraRataRata: {
                        value: nationalPark.iklim?.kelembabanUdaraRataRata?.value || '',
                        unit: nationalPark.iklim?.kelembabanUdaraRataRata?.unit || '%',
                    },
                },
                ekosistemHabitat: mapNestedArrayToString(nationalPark.ekosistemHabitat),
                flora: {
                    jumlahJenis: nationalPark.flora?.jumlahJenis || '',
                    pohonDominan: mapNestedArrayToString(nationalPark.flora?.pohonDominan),
                    tumbuhanBawahSemak: mapNestedArrayToString(nationalPark.flora?.tumbuhanBawahSemak),
                    tumbuhanPionir: mapNestedArrayToString(nationalPark.flora?.tumbuhanPionir),
                    tumbuhanKhasEndemik: mapNestedArrayToString(nationalPark.flora?.tumbuhanKhasEndemik),
                },
                fauna: {
                    jumlahJenis: {
                        burung: nationalPark.fauna?.jumlahJenis?.burung || '',
                        mamalia: nationalPark.fauna?.jumlahJenis?.mamalia || '',
                        reptil: nationalPark.fauna?.jumlahJenis?.reptil || '',
                        amfibi: nationalPark.fauna?.jumlahJenis?.amfibi || '',
                    },
                    mamalia: mapNestedArrayToString(nationalPark.fauna?.mamalia),
                    burung: mapNestedArrayToString(nationalPark.fauna?.burung),
                },
                sejarahSingkat: mapArrayToString(nationalPark.sejarahSingkat),
                aktivitasPengelolaan: mapNestedArrayToString(nationalPark.aktivitasPengelolaan),
                fasilitasPendukung: mapArrayToString(nationalPark.fasilitasPendukung),
                ancamanKonservasi: mapArrayToString(nationalPark.ancamanKonservasi),
                upayaKonservasi: mapArrayToString(nationalPark.upayaKonservasi),
                createdBy: nationalPark.createdBy || '',
            });
            if (nationalPark.image && typeof nationalPark.image === 'string') {
                setImagePreviewUrl(nationalPark.image);
            } else {
                setImagePreviewUrl(null);
            }
        } else {
            // Reset form data and preview for 'Add' mode
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
                ancamanKonservasi: '', upayaKonservasi: '', createdBy: '',
            });
            setImagePreviewUrl(null);
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Clear the selected file from input
        }

        return () => {
            if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreviewUrl);
            }
        };
    }, [isEdit, nationalPark, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        // Handle nested state for iklim, koordinatGeografis, luas, ketinggian, fauna.jumlahJenis
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
        } else if (name.startsWith('iklim.')) { // For iklim.tipe
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
        } else if (name.startsWith('fauna.')) { // For fauna mamalia/burung (if not jumlahJenis)
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

    const handleNumberInputChange = (valueAsString, valueAsNumber, name, parentKey, subKey) => {
        setFormData((prev) => {
            const newState = { ...prev };
            if (parentKey && subKey) {
                newState[parentKey] = {
                    ...newState[parentKey],
                    [subKey]: valueAsNumber,
                };
            } else if (parentKey) { // For iklim.curahHujanRataRata.value
                 newState.iklim.curahHujanRataRata = {
                    ...newState.iklim.curahHujanRataRata,
                    value: valueAsString, // Keep it as string for "2.500 – 3.500"
                };
            }
            return newState;
        });
    };

    const handleNestedChange = (parentKey, key, value) => {
        setFormData((prev) => ({
            ...prev,
            [parentKey]: {
                ...prev[parentKey],
                [key]: value,
            },
        }));
    };

    const handleDeepNestedChange = (grandparentKey, parentKey, key, value) => {
        setFormData((prev) => ({
            ...prev,
            [grandparentKey]: {
                ...prev[grandparentKey],
                [parentKey]: {
                    ...prev[grandparentKey][parentKey],
                    [key]: value,
                },
            },
        }));
    };

    const handleSubmit = async () => {
        setIsUploadingImage(true);

        let finalImageUrl = formData.image;

        if (formData.image instanceof File) {
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
            }
        } else if (formData.image === null || formData.image === '') {
            finalImageUrl = null;
        }

        setIsUploadingImage(false);

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
            createdBy: formData.createdBy, // Ini seharusnya diisi dari server atau context user login
        };

        console.log('Final data to submit from Modal (including image URL):', dataToSubmit);
        onSubmit(dataToSubmit);
        onClose();
    };

    const handleChooseImage = () => {
        fileInputRef.current?.click();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{isEdit ? 'Edit National Park' : 'Add National Park'}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4} align="stretch">
                        {/* Nama Resmi */}
                        <FormControl id="namaResmi" isRequired>
                            <FormLabel>Nama Resmi</FormLabel>
                            <Input
                                name="namaResmi"
                                value={formData.namaResmi}
                                onChange={handleChange}
                            />
                        </FormControl>

                        {/* Lokasi */}
                        <FormControl id="lokasi" isRequired>
                            <FormLabel>Lokasi</FormLabel>
                            <Input
                                name="lokasi"
                                value={formData.lokasi}
                                onChange={handleChange}
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
                            />
                        </FormControl>

                        {/* Image Upload */}
                        <FormControl id="image">
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

                                <Button onClick={handleChooseImage} size="sm" colorScheme="blue" isLoading={isUploadingImage}>
                                    {isUploadingImage ? <Spinner size="sm" mr={2} /> : null}
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
                                />
                                <Input
                                    name="koordinatGeografis.bujur"
                                    placeholder="Bujur (Contoh: 110°22′ – 110°32′ BT)"
                                    value={formData.koordinatGeografis.bujur}
                                    onChange={handleChange}
                                />
                            </HStack>
                        </FormControl>

                        {/* Luas */}
                        <FormControl id="luas">
                            <FormLabel>Luas</FormLabel>
                            <HStack>
                                <NumberInput
                                    value={formData.luas.value}
                                    onChange={(valStr, valNum) => handleNestedChange('luas', 'value', valNum)}
                                    min={0}
                                    flex="1"
                                >
                                    <NumberInputField placeholder="Value" />
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
                                />
                            </HStack>
                            <Input
                                name="luas.referensi"
                                value={formData.luas.referensi}
                                onChange={handleChange}
                                placeholder="Referensi Luas (Contoh: Keputusan Menteri Kehutanan Nomor SK.653/Menhut-II/2004)"
                                mt={2}
                            />
                        </FormControl>

                        {/* Ketinggian */}
                        <FormControl id="ketinggian">
                            <FormLabel>Ketinggian</FormLabel>
                            <HStack>
                                <NumberInput
                                    value={formData.ketinggian.min}
                                    onChange={(valStr, valNum) => handleNestedChange('ketinggian', 'min', valNum)}
                                    min={0}
                                    flex="1"
                                >
                                    <NumberInputField placeholder="Min (mdpl)" />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                <NumberInput
                                    value={formData.ketinggian.max}
                                    onChange={(valStr, valNum) => handleNestedChange('ketinggian', 'max', valNum)}
                                    min={0}
                                    flex="1"
                                >
                                    <NumberInputField placeholder="Max (mdpl)" />
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
                            />
                        </FormControl>

                        {/* Geologi */}
                        <FormControl id="geologi">
                            <FormLabel>Geologi</FormLabel>
                            <Textarea
                                name="geologi"
                                value={formData.geologi}
                                onChange={handleChange}
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
                                />
                                <HStack>
                                    <Input
                                        name="iklim.curahHujanRataRata.value"
                                        placeholder="Curah Hujan Rata-Rata (Contoh: 2.500 – 3.500)"
                                        value={formData.iklim.curahHujanRataRata.value}
                                        onChange={handleChange}
                                        flex="1"
                                    />
                                    <Input
                                        name="iklim.curahHujanRataRata.unit"
                                        value={formData.iklim.curahHujanRataRata.unit}
                                        onChange={handleChange}
                                        placeholder="Unit (e.g., mm/tahun)"
                                        flex="0.5"
                                    />
                                </HStack>
                                <FormLabel mt={2}>Suhu Rata-Rata</FormLabel>
                                <HStack>
                                    <Input
                                        name="iklim.suhuRataRata.kakiGunung"
                                        placeholder="Kaki Gunung (Contoh: 20°C – 28°C)"
                                        value={formData.iklim.suhuRataRata.kakiGunung}
                                        onChange={handleChange}
                                    />
                                    <Input
                                        name="iklim.suhuRataRata.puncak"
                                        placeholder="Puncak (Contoh: di bawah 10°C)"
                                        value={formData.iklim.suhuRataRata.puncak}
                                        onChange={handleChange}
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
                                    />
                                    <Input
                                        name="iklim.kelembabanUdaraRataRata.unit"
                                        value={formData.iklim.kelembabanUdaraRataRata.unit}
                                        onChange={handleChange}
                                        placeholder="Unit (e.g., %)"
                                        flex="0.5"
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
                                />
                                <FormLabel mt={2}>Pohon Dominan (Format: Lokal (Ilmiah) - Keterangan)</FormLabel>
                                <Textarea
                                    name="flora.pohonDominan"
                                    value={formData.flora.pohonDominan}
                                    onChange={handleChange}
                                    placeholder="Contoh:&#x0A;Jati (Tectona grandis) - Tumbuh di daerah dataran rendah&#x0A;Damar (Agathis borneensis) - Pohon tinggi khas hutan hujan"
                                />
                                <FormLabel mt={2}>Tumbuhan Bawah & Semak (Format: Lokal (Ilmiah) - Keterangan)</FormLabel>
                                <Textarea
                                    name="flora.tumbuhanBawahSemak"
                                    value={formData.flora.tumbuhanBawahSemak}
                                    onChange={handleChange}
                                    placeholder="Contoh:&#x0A;Rafflesia (Rafflesia arnoldii) - Bunga bangkai terbesar"
                                />
                                <FormLabel mt={2}>Tumbuhan Pionir (Format: Lokal (Ilmiah) - Keterangan)</FormLabel>
                                <Textarea
                                    name="flora.tumbuhanPionir"
                                    value={formData.flora.tumbuhanPionir}
                                    onChange={handleChange}
                                    placeholder="Contoh:&#x0A;Rumput Gajah (Pennisetum purpureum) - Tumbuh cepat setelah gangguan"
                                />
                                <FormLabel mt={2}>Tumbuhan Khas & Endemik (Format: Lokal (Ilmiah) - Keterangan)</FormLabel>
                                <Textarea
                                    name="flora.tumbuhanKhasEndemik"
                                    value={formData.flora.tumbuhanKhasEndemik}
                                    onChange={handleChange}
                                    placeholder="Contoh:&#x0A;Anggrek Bulan (Phalaenopsis amabilis) - Anggrek endemik"
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
                                    />
                                    <Input
                                        name="fauna.jumlahJenis.mamalia"
                                        placeholder="Mamalia"
                                        value={formData.fauna.jumlahJenis.mamalia}
                                        onChange={handleChange}
                                    />
                                </HStack>
                                <HStack>
                                    <Input
                                        name="fauna.jumlahJenis.reptil"
                                        placeholder="Reptil"
                                        value={formData.fauna.jumlahJenis.reptil}
                                        onChange={handleChange}
                                    />
                                    <Input
                                        name="fauna.jumlahJenis.amfibi"
                                        placeholder="Amfibi"
                                        value={formData.fauna.jumlahJenis.amfibi}
                                        onChange={handleChange}
                                    />
                                </HStack>
                                <FormLabel mt={2}>Mamalia (Format: Kategori: Lokal (Ilmiah) - Keterangan; ...)</FormLabel>
                                <Textarea
                                    name="fauna.mamalia"
                                    value={formData.fauna.mamalia}
                                    onChange={handleChange}
                                    placeholder="Contoh:&#x0A;Primata: Orangutan Sumatera (Pongo abelii) - Spesies terancam kritis; Siamang (Symphalangus syndactylus)&#x0A;Karnivora: Harimau Sumatera (Panthera tigris sumatrae) - Kucing besar endemik Sumatera"
                                />
                                <FormLabel mt={2}>Burung (Format: Kategori: Lokal (Ilmiah) - Keterangan; ...)</FormLabel>
                                <Textarea
                                    name="fauna.burung"
                                    value={formData.fauna.burung}
                                    onChange={handleChange}
                                    placeholder="Contoh:&#x0A;Elang: Elang Jawa (Nisaetus bartelsi) - Burung pemangsa endemik Jawa"
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
                            />
                        </FormControl>

                        {/* Created By (Read-only for edit mode, can be auto-filled for create) */}
                        {isEdit && (
                            <FormControl id="createdBy">
                                <FormLabel>Created By</FormLabel>
                                <Input
                                    name="createdBy"
                                    value={formData.createdBy}
                                    disabled // Ini biasanya diisi otomatis di backend
                                />
                            </FormControl>
                        )}
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button variant="ghost" onClick={() => {
                        // Reset form data to initial state or empty if adding new
                        if (initialNationalParkState.current) {
                            const nationalPark = initialNationalParkState.current;
                            const mapArrayToString = (arr) => Array.isArray(arr) ? arr.join('\n') : '';
                            const mapNestedArrayToString = (arr) => Array.isArray(arr) ? arr.map(item => {
                                if (item.kategori && item.jenis) {
                                    return `${item.kategori}: ${item.jenis.map(j => `${j.namaLokal || ''} (${j.namaIlmiah || ''}) - ${j.keterangan || ''}`).join('; ')}`;
                                } else if (item.namaLokal || item.namaIlmiah) {
                                    return `${item.namaLokal || ''} (${item.namaIlmiah || ''}) - ${item.keterangan || ''}`;
                                } else if (item.nama && item.deskripsi) {
                                     return `${item.nama}: ${item.deskripsi}${item.detail ? ' (' + item.detail.join(', ') + ')' : ''}`;
                                }
                                return '';
                            }).filter(Boolean).join('\n') : '';

                            setFormData({
                                namaResmi: nationalPark.namaResmi || '',
                                lokasi: nationalPark.lokasi || '',
                                wilayahAdministratif: mapArrayToString(nationalPark.wilayahAdministratif),
                                image: nationalPark.image || null,
                                koordinatGeografis: {
                                    lintang: nationalPark.koordinatGeografis?.lintang || '',
                                    bujur: nationalPark.koordinatGeografis?.bujur || '',
                                },
                                luas: {
                                    value: nationalPark.luas?.value?.toString() || '',
                                    unit: nationalPark.luas?.unit || 'Hektar',
                                    referensi: nationalPark.luas?.referensi || '',
                                },
                                ketinggian: {
                                    min: nationalPark.ketinggian?.min?.toString() || '',
                                    max: nationalPark.ketinggian?.max?.toString() || '',
                                    unit: nationalPark.ketinggian?.unit || 'mdpl',
                                },
                                topografi: nationalPark.topografi || '',
                                geologi: nationalPark.geologi || '',
                                iklim: {
                                    tipe: nationalPark.iklim?.tipe || '',
                                    curahHujanRataRata: {
                                        value: nationalPark.iklim?.curahHujanRataRata?.value || '',
                                        unit: nationalPark.iklim?.curahHujanRataRata?.unit || 'mm/tahun',
                                    },
                                    suhuRataRata: {
                                        kakiGunung: nationalPark.iklim?.suhuRataRata?.kakiGunung || '',
                                        puncak: nationalPark.iklim?.suhuRataRata?.puncak || '',
                                    },
                                    kelembabanUdaraRataRata: {
                                        value: nationalPark.iklim?.kelembabanUdaraRataRata?.value || '',
                                        unit: nationalPark.iklim?.kelembabanUdaraRataRata?.unit || '%',
                                    },
                                },
                                ekosistemHabitat: mapNestedArrayToString(nationalPark.ekosistemHabitat),
                                flora: {
                                    jumlahJenis: nationalPark.flora?.jumlahJenis || '',
                                    pohonDominan: mapNestedArrayToString(nationalPark.flora?.pohonDominan),
                                    tumbuhanBawahSemak: mapNestedArrayToString(nationalPark.flora?.tumbuhanBawahSemak),
                                    tumbuhanPionir: mapNestedArrayToString(nationalPark.flora?.tumbuhanPionir),
                                    tumbuhanKhasEndemik: mapNestedArrayToString(nationalPark.flora?.tumbuhanKhasEndemik),
                                },
                                fauna: {
                                    jumlahJenis: {
                                        burung: nationalPark.fauna?.jumlahJenis?.burung || '',
                                        mamalia: nationalPark.fauna?.jumlahJenis?.mamalia || '',
                                        reptil: nationalPark.fauna?.jumlahJenis?.reptil || '',
                                        amfibi: nationalPark.fauna?.jumlahJenis?.amfibi || '',
                                    },
                                    mamalia: mapNestedArrayToString(nationalPark.fauna?.mamalia),
                                    burung: mapNestedArrayToString(nationalPark.fauna?.burung),
                                },
                                sejarahSingkat: mapArrayToString(nationalPark.sejarahSingkat),
                                aktivitasPengelolaan: mapNestedArrayToString(nationalPark.aktivitasPengelolaan),
                                fasilitasPendukung: mapArrayToString(nationalPark.fasilitasPendukung),
                                ancamanKonservasi: mapArrayToString(nationalPark.ancamanKonservasi),
                                upayaKonservasi: mapArrayToString(nationalPark.upayaKonservasi),
                                createdBy: nationalPark.createdBy || '',
                            });
                            setImagePreviewUrl(
                                nationalPark.image && typeof nationalPark.image === 'string'
                                    ? nationalPark.image
                                    : null
                            );
                        } else {
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
                                ancamanKonservasi: '', upayaKonservasi: '', createdBy: '',
                            });
                            setImagePreviewUrl(null);
                        }
                        if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                        }
                        onClose();
                    }}>
                        Cancel
                    </Button>
                    <Button colorScheme="blue" onClick={handleSubmit} isLoading={isUploadingImage}>
                        {isUploadingImage ? 'Uploading...' : (isEdit ? 'Update' : 'Create')}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default NationalParkFormModal;