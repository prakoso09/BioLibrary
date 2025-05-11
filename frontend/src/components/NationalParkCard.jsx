// components/NationalParkCard.jsx
import React from 'react';
import {
    Box,
    Image,
    useColorModeValue,
    HStack,
    VStack,
    Text,
    Divider,
    // useDisclosure, Modal, ModalCloseButton, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalOverlay, Input, // Hapus import ini jika tidak ada fungsionalitas update/delete di card
    Button,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
// import { useNationalParkStore } from '../store/nationalPark'; // Hapus import ini jika tidak ada fungsionalitas update/delete di card
// import { useToast } from '@chakra-ui/react'; // Hapus import ini jika tidak ada fungsionalitas update/delete di card
// import { useState, useEffect } from 'react'; // Hapus import ini jika tidak ada fungsionalitas update/delete di card
import { Link } from 'react-router-dom';

const MotionBox = motion(Box);

const NationalParkCard = ({ nationalPark }) => {
    // Hapus state dan fungsi update/delete jika tidak diperlukan di card
    // const [updatedNationalPark, setUpdatedNationalPark] = useState(nationalPark);
    // const initialNationalPark = nationalPark;
    // const { deleteNationalPark, updateNationalPark } = useNationalParkStore();
    // const toast = useToast();
    // const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure();
    // const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

    // const handleDeleteNationalPark = async (id) => { ... };
    // const handleUpdateNationalPark = async (id, updatedData) => { ... };

    const borderGradient = useColorModeValue(
        'linear(to-r, teal.300, blue.700)',
        'linear(to-r, teal.200, cyan.400)'
    );
    const hoverShadow = useColorModeValue(
        '0 0 15px rgba(8, 147, 147, 0.9)',
        '0 0 20px rgba(0, 255, 255, 0.7)'
    );


    return (
        <Box bgGradient={borderGradient} p="2px" borderRadius="xl">
            <MotionBox
                borderRadius="xl"
                overflow="hidden"
                position="relative"
                boxShadow="base"
                transition="all 0.3s ease"
                _hover={{
                    transform: 'scale(1.03)',
                    boxShadow: hoverShadow,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                display="flex"
                flexDirection="column"
            >
                <Link to={`/NationalPark/${nationalPark._id}`}>
                    <Image
                        src={nationalPark.image && nationalPark.image.startsWith('http') ? nationalPark.image : 'https://via.placeholder.com/400x230?text=No+Image'}
                        alt={nationalPark.namaResmi} // Menggunakan namaResmi
                        h="230px"
                        w="full"
                        objectFit="cover"
                        transition="0.3s"
                        _hover={{ filter: 'brightness(1.1)' }}
                        cursor="pointer"
                    />
                </Link>

                <VStack spacing={1} px={4} py={2} textAlign="center">
                    <Text
                        fontSize="xl"
                        fontWeight="bold"
                        color="rgb(3, 23, 45)"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        maxWidth="370px"
                    >
                        {nationalPark.namaResmi} {/* Menggunakan namaResmi */}
                    </Text>
                    <Text
                        fontSize="md"
                        noOfLines={1}
                        color="rgb(255, 255, 255)"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        maxWidth="370px"
                    >
                        {nationalPark.lokasi} {/* Menggunakan lokasi */}
                    </Text>
                    {/* Anda bisa menambahkan properti singkat lainnya di sini jika diperlukan, contoh luas */}
                    <Text
                        fontSize="sm"
                        noOfLines={1}
                        color="gray.600"
                        textAlign="center"
                        mt={1}
                    >
                        Area: {nationalPark.luas.value} {nationalPark.luas.unit}
                    </Text>
                </VStack>

                <Divider borderColor="gray.600" opacity={0.3} mx={4} />

                <HStack px={4} py={2} spacing={3} justify="center">
                    <Link to={`/NationalPark/${nationalPark._id}`}>
                        <Button
                            colorScheme="blue"
                            size="md"
                            aria-label="Read More"
                        >
                            Read More
                        </Button>
                    </Link>
                </HStack>
            </MotionBox>

            {/* Modal update/delete dihapus dari card karena biasanya dilakukan di halaman detail atau admin dashboard */}
            {/* <Modal isOpen={isUpdateOpen} onClose={onUpdateClose} isCentered>...</Modal> */}
            {/* <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} isCentered>...</Modal> */}
        </Box>
    );
};

export default NationalParkCard;