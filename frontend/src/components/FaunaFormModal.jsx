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
    Select, 
} from '@chakra-ui/react';
import axios from 'axios';

const FaunaFormModal = ({ isOpen, onClose, fauna, onSubmit, isEdit }) => {
    const [formData, setFormData] = useState({
        namaIlmiah: '',
        namaLokal: '',
        namaUmumLain: '',
        image: null, 
        klasifikasiIlmiah: {
            kingdom: 'Animalia',
            filum: '',
            kelas: '',
            ordo: '',
            famili: '',
            subfamili: '',
            genus: '',
            spesies: '',
            subspesies: [],
        },
        habitat: '',
        sebaranGeografis: '',
        iklim: '',
        ukuranTubuh: {
            panjangTubuh: '',
            panjangEkor: '',
            tinggiBahu: '',
            lebarSayap: '',
            beratBadan: '',
        },
        polaMakan: '',
        makananUtama: '',
        caraBergerak: '',
        reproduksi: {
            kematanganSeksual: '',
            masaKehamilan: '',
            jumlahAnak: '',
            warnaBayi: '',
            perawatanAnak: '',
            tempatBertelur: '',
            fekunditasTinggi: '',
            perkembangan: '',
        },
        usiaRataRata: '',
        perilaku: {
            aktivitas: '',
            sosial: '',
            komunikasi: '',
            perilakuLain: '',
            pertahanan: '',
            peranEkologis: '',
        },
        statusKepunahan: {
            statusIUCNGlobal: '',
            ancaman: [],
            upayaKonservasi: [],
            alasan: '',
            manajemenKonflik: '',
            invasiIntroduksi: '',
        },
        deskripsi: '',
    });

    const fileInputRef = useRef(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const toast = useToast();

    const initialFaunaState = useRef(null);

    const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    useEffect(() => {
        if (fauna) {
            initialFaunaState.current = fauna;
        }
    }, [fauna]);


    useEffect(() => {
        if (isEdit && fauna) {
            setFormData({
                ...fauna,
                klasifikasiIlmiah: {
                    kingdom: fauna.klasifikasiIlmiah?.kingdom || 'Animalia',
                    filum: fauna.klasifikasiIlmiah?.filum || '',
                    kelas: fauna.klasifikasiIlmiah?.kelas || '',
                    ordo: fauna.klasifikasiIlmiah?.ordo || '',
                    famili: fauna.klasifikasiIlmiah?.famili || '',
                    subfamili: fauna.klasifikasiIlmiah?.subfamili || '',
                    genus: fauna.klasifikasiIlmiah?.genus || '',
                    spesies: fauna.klasifikasiIlmiah?.spesies || '',
                    subspesies: fauna.klasifikasiIlmiah?.subspesies || [],
                },
                ukuranTubuh: {
                    panjangTubuh: fauna.ukuranTubuh?.panjangTubuh || '',
                    panjangEkor: fauna.ukuranTubuh?.panjangEkor || '',
                    tinggiBahu: fauna.ukuranTubuh?.tinggiBahu || '',
                    lebarSayap: fauna.ukuranTubuh?.lebarSayap || '',
                    beratBadan: fauna.ukuranTubuh?.beratBadan || '',
                },
                reproduksi: {
                    kematanganSeksual: fauna.reproduksi?.kematanganSeksual || '',
                    masaKehamilan: fauna.reproduksi?.masaKehamilan || '',
                    jumlahAnak: fauna.reproduksi?.jumlahAnak || '',
                    warnaBayi: fauna.reproduksi?.warnaBayi || '',
                    perawatanAnak: fauna.reproduksi?.perawatanAnak || '',
                    tempatBertelur: fauna.reproduksi?.tempatBertelur || '',
                    fekunditasTinggi: fauna.reproduksi?.fekunditasTinggi || '',
                    perkembangan: fauna.reproduksi?.perkembangan || '',
                },
                perilaku: {
                    aktivitas: fauna.perilaku?.aktivitas || '',
                    sosial: fauna.perilaku?.sosial || '',
                    komunikasi: fauna.perilaku?.komunikasi || '',
                    perilakuLain: fauna.perilaku?.perilakuLain || '',
                    pertahanan: fauna.perilaku?.pertahanan || '',
                    peranEkologis: fauna.perilaku?.peranEkologis || '',
                },
                statusKepunahan: {
                    statusIUCNGlobal: fauna.statusKepunahan?.statusIUCNGlobal || '',
                    ancaman: Array.isArray(fauna.statusKepunahan?.ancaman)
                        ? fauna.statusKepunahan.ancaman.join('\n')
                        : fauna.statusKepunahan?.ancaman || '',
                    upayaKonservasi: Array.isArray(fauna.statusKepunahan?.upayaKonservasi)
                        ? fauna.statusKepunahan.upayaKonservasi.join('\n')
                        : fauna.statusKepunahan?.upayaKonservasi || '',
                    alasan: fauna.statusKepunahan?.alasan || '',
                    manajemenKonflik: fauna.statusKepunahan?.manajemenKonflik || '',
                    invasiIntroduksi: fauna.statusKepunahan?.invasiIntroduksi || '',
                },
            });
            if (fauna.image && typeof fauna.image === 'string') {
                setImagePreviewUrl(fauna.image);
            } else {
                setImagePreviewUrl(null);
            }
        } else {
            // buat preview???
            setFormData({
                namaIlmiah: '',
                namaLokal: '',
                namaUmumLain: '',
                image: null,
                klasifikasiIlmiah: {
                    kingdom: 'Animalia',
                    filum: '',
                    kelas: '',
                    ordo: '',
                    famili: '',
                    subfamili: '',
                    genus: '',
                    spesies: '',
                    subspesies: [],
                },
                habitat: '',
                sebaranGeografis: '',
                iklim: '',
                ukuranTubuh: {
                    panjangTubuh: '',
                    panjangEkor: '',
                    tinggiBahu: '',
                    lebarSayap: '',
                    beratBadan: '',
                },
                polaMakan: '',
                makananUtama: '',
                caraBergerak: '',
                reproduksi: {
                    kematanganSeksual: '',
                    masaKehamilan: '',
                    jumlahAnak: '',
                    warnaBayi: '',
                    perawatanAnak: '',
                    tempatBertelur: '',
                    fekunditasTinggi: '',
                    perkembangan: '',
                },
                usiaRataRata: '',
                perilaku: {
                    aktivitas: '',
                    sosial: '',
                    komunikasi: '',
                    perilakuLain: '',
                    pertahanan: '',
                    peranEkologis: '',
                },
                statusKepunahan: {
                    statusIUCNGlobal: '',
                    ancaman: [],
                    upayaKonservasi: [],
                    alasan: '',
                    manajemenKonflik: '',
                    invasiIntroduksi: '',
                },
                deskripsi: '',
            });
            setImagePreviewUrl(null);
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = ''; 
        }

        return () => {
            if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreviewUrl);
            }
        };
    }, [isEdit, fauna]);


    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file' && files && files[0]) {
            const file = files[0];
            setFormData((prev) => ({
                ...prev,
                [name]: file,
            }));
            if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreviewUrl);
            }
            setImagePreviewUrl(URL.createObjectURL(file));
        } else if (name.startsWith('klasifikasiIlmiah.')) {
            const field = name.split('.')[1];
            setFormData((prev) => ({
                ...prev,
                klasifikasiIlmiah: {
                    ...prev.klasifikasiIlmiah,
                    [field]: value,
                },
            }));
        } else if (name.startsWith('ukuranTubuh.')) {
            const field = name.split('.')[1];
            setFormData((prev) => ({
                ...prev,
                ukuranTubuh: {
                    ...prev.ukuranTubuh,
                    [field]: value,
                },
            }));
        } else if (name.startsWith('reproduksi.')) {
            const field = name.split('.')[1];
            setFormData((prev) => ({
                ...prev,
                reproduksi: {
                    ...prev.reproduksi,
                    [field]: value,
                },
            }));
        } else if (name.startsWith('perilaku.')) {
            const field = name.split('.')[1];
            setFormData((prev) => ({
                ...prev,
                perilaku: {
                    ...prev.perilaku,
                    [field]: value,
                },
            }));
        } else if (name.startsWith('statusKepunahan.')) {
            const field = name.split('.')[1];
            setFormData((prev) => ({
                ...prev,
                statusKepunahan: {
                    ...prev.statusKepunahan,
                    [field]: value,
                },
            }));
        }
        else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
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
                    title: "Upload Berhasil",
                    description: "Gambar berhasil diunggah ke Cloudinary.",
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                });
            } catch (uploadError) {
                setIsUploadingImage(false);
                console.error('Error uploading image to Cloudinary:', uploadError.response?.data || uploadError.message);
                toast({
                    title: "Upload Gagal",
                    description: uploadError.response?.data?.error?.message || "Gagal mengunggah gambar ke Cloudinary.",
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

        const dataToSubmit = {
            ...formData,
            image: finalImageUrl,
            klasifikasiIlmiah: {
                ...formData.klasifikasiIlmiah,
                subspesies: Array.isArray(formData.klasifikasiIlmiah.subspesies)
                    ? formData.klasifikasiIlmiah.subspesies.map(s => ({ nama: s.nama.trim(), deskripsi: s.deskripsi.trim() })).filter(s => s.nama)
                    : [],
            },
            statusKepunahan: {
                ...formData.statusKepunahan,
                ancaman: formData.statusKepunahan.ancaman
                    .split('\n')
                    .map(line => line.trim())
                    .filter(Boolean),
                upayaKonservasi: formData.statusKepunahan.upayaKonservasi
                    .split('\n')
                    .map(line => line.trim())
                    .filter(Boolean),
            }
        };

        console.log('Final data to submit from Modal (including image URL):', dataToSubmit);
        onSubmit(dataToSubmit);
        onClose();
    };

    const handleChooseImage = () => {
        fileInputRef.current?.click();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl"> 
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{isEdit ? 'Edit Fauna' : 'Add Fauna'}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4} align="stretch">
                        {/* Nama Ilmiah */}
                        <FormControl id="namaIlmiah" isRequired>
                            <FormLabel>Nama Ilmiah</FormLabel>
                            <Input
                                name="namaIlmiah"
                                value={formData.namaIlmiah}
                                onChange={handleChange}
                            />
                        </FormControl>

                        {/* Nama Lokal */}
                        <FormControl id="namaLokal" isRequired>
                            <FormLabel>Nama Lokal</FormLabel>
                            <Input
                                name="namaLokal"
                                value={formData.namaLokal}
                                onChange={handleChange}
                            />
                        </FormControl>

                        {/* Nama Umum Lain */}
                        <FormControl id="namaUmumLain">
                            <FormLabel>Nama Umum Lain</FormLabel>
                            <Input
                                name="namaUmumLain"
                                value={formData.namaUmumLain}
                                onChange={handleChange}
                            />
                        </FormControl>

                        {/* Image Upload */}
                        <FormControl id="image">
                            <FormLabel>Image</FormLabel>
                            <Box>
                                {imagePreviewUrl && (
                                    <Image
                                        src={imagePreviewUrl}
                                        alt="Fauna Image Preview"
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

                        {/* Klasifikasi Ilmiah */}
                        <Text fontSize="lg" fontWeight="bold" mt={4} mb={2}>Klasifikasi Ilmiah</Text>
                        <FormControl id="kingdom">
                            <FormLabel>Kingdom</FormLabel>
                            <Input
                                name="klasifikasiIlmiah.kingdom"
                                value={formData.klasifikasiIlmiah.kingdom}
                                onChange={handleChange}
                                disabled
                            />
                        </FormControl>
                        <FormControl id="filum">
                            <FormLabel>Filum</FormLabel>
                            <Input
                                name="klasifikasiIlmiah.filum"
                                value={formData.klasifikasiIlmiah.filum}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl id="kelas">
                            <FormLabel>Kelas</FormLabel>
                            <Input
                                name="klasifikasiIlmiah.kelas"
                                value={formData.klasifikasiIlmiah.kelas}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl id="ordo">
                            <FormLabel>Ordo</FormLabel>
                            <Input
                                name="klasifikasiIlmiah.ordo"
                                value={formData.klasifikasiIlmiah.ordo}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl id="famili">
                            <FormLabel>Famili</FormLabel>
                            <Input
                                name="klasifikasiIlmiah.famili"
                                value={formData.klasifikasiIlmiah.famili}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl id="subfamili">
                            <FormLabel>Subfamili</FormLabel>
                            <Input
                                name="klasifikasiIlmiah.subfamili"
                                value={formData.klasifikasiIlmiah.subfamili}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl id="genus">
                            <FormLabel>Genus</FormLabel>
                            <Input
                                name="klasifikasiIlmiah.genus"
                                value={formData.klasifikasiIlmiah.genus}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl id="spesies">
                            <FormLabel>Spesies</FormLabel>
                            <Input
                                name="klasifikasiIlmiah.spesies"
                                value={formData.klasifikasiIlmiah.spesies}
                                onChange={handleChange}
                            />
                        </FormControl>
                        {/* Subspesies  */}
                        <FormControl id="subspesies">
                            <FormLabel>Subspesies (Nama:Deskripsi, pisahkan dengan baris baru)</FormLabel>
                            <Textarea
                                name="klasifikasiIlmiah.subspesies"
                                value={formData.klasifikasiIlmiah.subspesies.map(s => `${s.nama}:${s.deskripsi}`).join('\n')}
                                onChange={(e) => {
                                    const lines = e.target.value.split('\n');
                                    const newSubspesies = lines.map(line => {
                                        const [nama, deskripsi] = line.split(':');
                                        return { nama: nama?.trim() || '', deskripsi: deskripsi?.trim() || '' };
                                    });
                                    setFormData((prev) => ({
                                        ...prev,
                                        klasifikasiIlmiah: {
                                            ...prev.klasifikasiIlmiah,
                                            subspesies: newSubspesies,
                                        },
                                    }));
                                }}
                            />
                        </FormControl>

                        {/* Habitat */}
                        <FormControl id="habitat">
                            <FormLabel>Habitat</FormLabel>
                            <Input
                                name="habitat"
                                value={formData.habitat}
                                onChange={handleChange}
                            />
                        </FormControl>

                        {/* Sebaran Geografis */}
                        <FormControl id="sebaranGeografis">
                            <FormLabel>Sebaran Geografis</FormLabel>
                            <Input
                                name="sebaranGeografis"
                                value={formData.sebaranGeografis}
                                onChange={handleChange}
                            />
                        </FormControl>

                        {/* Iklim */}
                        <FormControl id="iklim">
                            <FormLabel>Iklim</FormLabel>
                            <Input
                                name="iklim"
                                value={formData.iklim}
                                onChange={handleChange}
                            />
                        </FormControl>

                        {/* Ukuran Tubuh */}
                        <Text fontSize="lg" fontWeight="bold" mt={4} mb={2}>Ukuran Tubuh</Text>
                        <FormControl id="panjangTubuh">
                            <FormLabel>Panjang Tubuh</FormLabel>
                            <Input
                                name="ukuranTubuh.panjangTubuh"
                                value={formData.ukuranTubuh.panjangTubuh}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl id="panjangEkor">
                            <FormLabel>Panjang Ekor</FormLabel>
                            <Input
                                name="ukuranTubuh.panjangEkor"
                                value={formData.ukuranTubuh.panjangEkor}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl id="tinggiBahu">
                            <FormLabel>Tinggi Bahu</FormLabel>
                            <Input
                                name="ukuranTubuh.tinggiBahu"
                                value={formData.ukuranTubuh.tinggiBahu}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl id="lebarSayap">
                            <FormLabel>Lebar Sayap</FormLabel>
                            <Input
                                name="ukuranTubuh.lebarSayap"
                                value={formData.ukuranTubuh.lebarSayap}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl id="beratBadan">
                            <FormLabel>Berat Badan</FormLabel>
                            <Input
                                name="ukuranTubuh.beratBadan"
                                value={formData.ukuranTubuh.beratBadan}
                                onChange={handleChange}
                            />
                        </FormControl>

                        {/* Pola Makan */}
                        <FormControl id="polaMakan">
                            <FormLabel>Pola Makan</FormLabel>
                            <Select
                                name="polaMakan"
                                value={formData.polaMakan}
                                onChange={handleChange}
                                placeholder="Pilih Pola Makan"
                            >
                                <option value="Herbivora">Herbivora</option>
                                <option value="Karnivora">Karnivora</option>
                                <option value="Omnivora">Omnivora</option>
                                <option value="Frugivora">Frugivora</option>
                                <option value="Folivora">Folivora</option>
                            </Select>
                        </FormControl>

                        {/* Makanan Utama */}
                        <FormControl id="makananUtama">
                            <FormLabel>Makanan Utama</FormLabel>
                            <Input
                                name="makananUtama"
                                value={formData.makananUtama}
                                onChange={handleChange}
                            />
                        </FormControl>

                        {/* Cara Bergerak */}
                        <FormControl id="caraBergerak">
                            <FormLabel>Cara Bergerak</FormLabel>
                            <Input
                                name="caraBergerak"
                                value={formData.caraBergerak}
                                onChange={handleChange}
                            />
                        </FormControl>

                        {/* Reproduksi */}
                        <Text fontSize="lg" fontWeight="bold" mt={4} mb={2}>Reproduksi</Text>
                        <FormControl id="kematanganSeksual">
                            <FormLabel>Kematangan Seksual</FormLabel>
                            <Input
                                name="reproduksi.kematanganSeksual"
                                value={formData.reproduksi.kematanganSeksual}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl id="masaKehamilan">
                            <FormLabel>Masa Kehamilan</FormLabel>
                            <Input
                                name="reproduksi.masaKehamilan"
                                value={formData.reproduksi.masaKehamilan}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl id="jumlahAnak">
                            <FormLabel>Jumlah Anak</FormLabel>
                            <Input
                                name="reproduksi.jumlahAnak"
                                value={formData.reproduksi.jumlahAnak}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl id="warnaBayi">
                            <FormLabel>Warna Bayi</FormLabel>
                            <Input
                                name="reproduksi.warnaBayi"
                                value={formData.reproduksi.warnaBayi}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl id="perawatanAnak">
                            <FormLabel>Perawatan Anak</FormLabel>
                            <Input
                                name="reproduksi.perawatanAnak"
                                value={formData.reproduksi.perawatanAnak}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl id="tempatBertelur">
                            <FormLabel>Tempat Bertelur</FormLabel>
                            <Input
                                name="reproduksi.tempatBertelur"
                                value={formData.reproduksi.tempatBertelur}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl id="fekunditasTinggi">
                            <FormLabel>Fekunditas Tinggi</FormLabel>
                            <Input
                                name="reproduksi.fekunditasTinggi"
                                value={formData.reproduksi.fekunditasTinggi}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl id="perkembangan">
                            <FormLabel>Perkembangan</FormLabel>
                            <Input
                                name="reproduksi.perkembangan"
                                value={formData.reproduksi.perkembangan}
                                onChange={handleChange}
                            />
                        </FormControl>

                        {/* Usia Rata-Rata */}
                        <FormControl id="usiaRataRata">
                            <FormLabel>Usia Rata-Rata</FormLabel>
                            <Input
                                name="usiaRataRata"
                                value={formData.usiaRataRata}
                                onChange={handleChange}
                            />
                        </FormControl>

                        {/* Perilaku */}
                        <Text fontSize="lg" fontWeight="bold" mt={4} mb={2}>Perilaku</Text>
                        <FormControl id="aktivitas">
                            <FormLabel>Aktivitas</FormLabel>
                            <Select
                                name="perilaku.aktivitas"
                                value={formData.perilaku.aktivitas}
                                onChange={handleChange}
                                placeholder="Pilih Aktivitas"
                            >
                                <option value="Diurnal">Diurnal</option>
                                <option value="Nokturnal">Nokturnal</option>
                                <option value="Krepuskular">Krepuskular</option>
                            </Select>
                        </FormControl>
                        <FormControl id="sosial">
                            <FormLabel>Sosial</FormLabel>
                            <Input
                                name="perilaku.sosial"
                                value={formData.perilaku.sosial}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl id="komunikasi">
                            <FormLabel>Komunikasi</FormLabel>
                            <Input
                                name="perilaku.komunikasi"
                                value={formData.perilaku.komunikasi}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl id="perilakuLain">
                            <FormLabel>Perilaku Lain</FormLabel>
                            <Textarea
                                name="perilaku.perilakuLain"
                                value={formData.perilaku.perilakuLain}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl id="pertahanan">
                            <FormLabel>Pertahanan</FormLabel>
                            <Input
                                name="perilaku.pertahanan"
                                value={formData.perilaku.pertahanan}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl id="peranEkologis">
                            <FormLabel>Peran Ekologis</FormLabel>
                            <Input
                                name="perilaku.peranEkologis"
                                value={formData.perilaku.peranEkologis}
                                onChange={handleChange}
                            />
                        </FormControl>

                        {/* Status Kepunahan */}
                        <Text fontSize="lg" fontWeight="bold" mt={4} mb={2}>Status Kepunahan</Text>
                        <FormControl id="statusIUCNGlobal">
                            <FormLabel>Status IUCN Global</FormLabel>
                            <Input
                                name="statusKepunahan.statusIUCNGlobal"
                                value={formData.statusKepunahan.statusIUCNGlobal}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl id="ancaman">
                            <FormLabel>Ancaman (pisahkan dengan baris baru)</FormLabel>
                            <Textarea
                                name="statusKepunahan.ancaman"
                                value={Array.isArray(formData.statusKepunahan.ancaman) ? formData.statusKepunahan.ancaman.join('\n') : formData.statusKepunahan.ancaman}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl id="upayaKonservasi">
                            <FormLabel>Upaya Konservasi (pisahkan dengan baris baru)</FormLabel>
                            <Textarea
                                name="statusKepunahan.upayaKonservasi"
                                value={Array.isArray(formData.statusKepunahan.upayaKonservasi) ? formData.statusKepunahan.upayaKonservasi.join('\n') : formData.statusKepunahan.upayaKonservasi}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl id="alasan">
                            <FormLabel>Alasan Status IUCN</FormLabel>
                            <Textarea
                                name="statusKepunahan.alasan"
                                value={formData.statusKepunahan.alasan}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl id="manajemenKonflik">
                            <FormLabel>Manajemen Konflik</FormLabel>
                            <Input
                                name="statusKepunahan.manajemenKonflik"
                                value={formData.statusKepunahan.manajemenKonflik}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl id="invasiIntroduksi">
                            <FormLabel>Invasi/Introduksi</FormLabel>
                            <Input
                                name="statusKepunahan.invasiIntroduksi"
                                value={formData.statusKepunahan.invasiIntroduksi}
                                onChange={handleChange}
                            />
                        </FormControl>

                        {/* Deskripsi */}
                        <FormControl id="deskripsi" isRequired>
                            <FormLabel>Deskripsi</FormLabel>
                            <Textarea
                                name="deskripsi"
                                value={formData.deskripsi}
                                onChange={handleChange}
                            />
                        </FormControl>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button variant="ghost" onClick={() => {
                        if (initialFaunaState.current) {
                            setFormData({
                                ...initialFaunaState.current,
                                klasifikasiIlmiah: {
                                    kingdom: initialFaunaState.current.klasifikasiIlmiah?.kingdom || 'Animalia',
                                    filum: initialFaunaState.current.klasifikasiIlmiah?.filum || '',
                                    kelas: initialFaunaState.current.klasifikasiIlmiah?.kelas || '',
                                    ordo: initialFaunaState.current.klasifikasiIlmiah?.ordo || '',
                                    famili: initialFaunaState.current.klasifikasiIlmiah?.famili || '',
                                    subfamili: initialFaunaState.current.klasifikasiIlmiah?.subfamili || '',
                                    genus: initialFaunaState.current.klasifikasiIlmiah?.genus || '',
                                    spesies: initialFaunaState.current.klasifikasiIlmiah?.spesies || '',
                                    subspesies: initialFaunaState.current.klasifikasiIlmiah?.subspesies || [],
                                },
                                ukuranTubuh: {
                                    panjangTubuh: initialFaunaState.current.ukuranTubuh?.panjangTubuh || '',
                                    panjangEkor: initialFaunaState.current.ukuranTubuh?.panjangEkor || '',
                                    tinggiBahu: initialFaunaState.current.ukuranTubuh?.tinggiBahu || '',
                                    lebarSayap: initialFaunaState.current.ukuranTubuh?.lebarSayap || '',
                                    beratBadan: initialFaunaState.current.ukuranTubuh?.beratBadan || '',
                                },
                                reproduksi: {
                                    kematanganSeksual: initialFaunaState.current.reproduksi?.kematanganSeksual || '',
                                    masaKehamilan: initialFaunaState.current.reproduksi?.masaKehamilan || '',
                                    jumlahAnak: initialFaunaState.current.reproduksi?.jumlahAnak || '',
                                    warnaBayi: initialFaunaState.current.reproduksi?.warnaBayi || '',
                                    perawatanAnak: initialFaunaState.current.reproduksi?.perawatanAnak || '',
                                    tempatBertelur: initialFaunaState.current.reproduksi?.tempatBertelur || '',
                                    fekunditasTinggi: initialFaunaState.current.reproduksi?.fekunditasTinggi || '',
                                    perkembangan: initialFaunaState.current.reproduksi?.perkembangan || '',
                                },
                                perilaku: {
                                    aktivitas: initialFaunaState.current.perilaku?.aktivitas || '',
                                    sosial: initialFaunaState.current.perilaku?.sosial || '',
                                    komunikasi: initialFaunaState.current.perilaku?.komunikasi || '',
                                    perilakuLain: initialFaunaState.current.perilaku?.perilakuLain || '',
                                    pertahanan: initialFaunaState.current.perilaku?.pertahanan || '',
                                    peranEkologis: initialFaunaState.current.perilaku?.peranEkologis || '',
                                },
                                statusKepunahan: {
                                    statusIUCNGlobal: initialFaunaState.current.statusKepunahan?.statusIUCNGlobal || '',
                                    ancaman: Array.isArray(initialFaunaState.current.statusKepunahan?.ancaman)
                                        ? initialFaunaState.current.statusKepunahan.ancaman.join('\n')
                                        : initialFaunaState.current.statusKepunahan?.ancaman || '',
                                    upayaKonservasi: Array.isArray(initialFaunaState.current.statusKepunahan?.upayaKonservasi)
                                        ? initialFaunaState.current.statusKepunahan.upayaKonservasi.join('\n')
                                        : initialFaunaState.current.statusKepunahan?.upayaKonservasi || '',
                                    alasan: initialFaunaState.current.statusKepunahan?.alasan || '',
                                    manajemenKonflik: initialFaunaState.current.statusKepunahan?.manajemenKonflik || '',
                                    invasiIntroduksi: initialFaunaState.current.statusKepunahan?.invasiIntroduksi || '',
                                },
                            });
                            if (initialFaunaState.current.image && typeof initialFaunaState.current.image === 'string') {
                                setImagePreviewUrl(initialFaunaState.current.image);
                            } else {
                                setImagePreviewUrl(null);
                            }
                        } else {
                            setFormData({
                                namaIlmiah: '',
                                namaLokal: '',
                                namaUmumLain: '',
                                image: null,
                                klasifikasiIlmiah: {
                                    kingdom: 'Animalia',
                                    filum: '',
                                    kelas: '',
                                    ordo: '',
                                    famili: '',
                                    subfamili: '',
                                    genus: '',
                                    spesies: '',
                                    subspesies: [],
                                },
                                habitat: '',
                                sebaranGeografis: '',
                                iklim: '',
                                ukuranTubuh: {
                                    panjangTubuh: '',
                                    panjangEkor: '',
                                    tinggiBahu: '',
                                    lebarSayap: '',
                                    beratBadan: '',
                                },
                                polaMakan: '',
                                makananUtama: '',
                                caraBergerak: '',
                                reproduksi: {
                                    kematanganSeksual: '',
                                    masaKehamilan: '',
                                    jumlahAnak: '',
                                    warnaBayi: '',
                                    perawatanAnak: '',
                                    tempatBertelur: '',
                                    fekunditasTinggi: '',
                                    perkembangan: '',
                                },
                                usiaRataRata: '',
                                perilaku: {
                                    aktivitas: '',
                                    sosial: '',
                                    komunikasi: '',
                                    perilakuLain: '',
                                    pertahanan: '',
                                    peranEkologis: '',
                                },
                                statusKepunahan: {
                                    statusIUCNGlobal: '',
                                    ancaman: [],
                                    upayaKonservasi: [],
                                    alasan: '',
                                    manajemenKonflik: '',
                                    invasiIntroduksi: '',
                                },
                                deskripsi: '',
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

export default FaunaFormModal;