import React from 'react';
import {
    Box,
    Image,
    useColorModeValue,
    HStack,
    IconButton,
    VStack,
    Text,
    Divider,
    useDisclosure,
    Modal,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalOverlay,
    Button, 
    Input
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useFloraStore } from '../store/flora';
import { useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const MotionBox = motion(Box);
const FloraCard = ({ flora }) => {
    const [updatedFlora, setUpdatedFlora] = useState(flora); // Inisialisasi dengan nilai awal
    const initialFlora = flora; // Simpan nilai awal flora


    const { deleteFlora, updateFlora } = useFloraStore();
    const toast = useToast();
    const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();


    const handleDeleteFlora = async (id) => {
        const { success, message } = await deleteFlora(id);
        if (!success) {
            toast({
                title: 'Error',
                description: message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } else {
            toast({
                title: 'Success',
                description: message,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        }
        onDeleteClose();
    }



    const handleUpdateFlora = async (id, updatedFlora) => {
        const { success, message } = await updateFlora(id, updatedFlora);
        if (!success) {
            toast({
                title: 'Error',
                description: message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } else {
            toast({
                title: 'Success',
                description: message,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        }
        onUpdateClose();

        
    }
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
                <Link to={`/flora/${flora._id}`}> 
                    <Image
                        src={flora.image && flora.image.startsWith('http') ? flora.image : null}
                        alt={flora.namaLokal}
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
                    {flora.namaLokal}
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
                    {flora.namaIlmiah}
                    </Text>
                </VStack>


                <Divider borderColor="gray.600" opacity={0.3} mx={4} />

                <HStack px={4} py={2} spacing={3} justify="center">
                    <Link to={`/flora/${flora._id}`}> {/* Bungkus Button dengan Link */}
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


            {/* Update Modal yg udah ga dibuthin sebenernya */}
            <Modal isOpen={isUpdateOpen} onClose={onUpdateClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Update Flora</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            <Input
                                placeholder="Flora Local Name"
                                name="namaLokal"
                                value={updatedFlora.namaLokal}
                                onChange={(e) => setUpdatedFlora({ ...updatedFlora, namaLokal: e.target.value })}
                            />
                            <Input
                                placeholder="Flora Scientific Name"
                                name="namaIlmiah"
                                value={updatedFlora.namaIlmiah}
                                onChange={(e) => setUpdatedFlora({ ...updatedFlora, namaIlmiah: e.target.value })}
                            />
                            <Input
                                placeholder="Flora Image URL"
                                name="image"
                                value={updatedFlora.image}
                                onChange={(e) => setUpdatedFlora({ ...updatedFlora, image: e.target.value })}
                            />
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={() => handleUpdateFlora(flora._id, updatedFlora)}>
                            Update
                        </Button>
                        <Button variant="ghost" onClick={() => {
                            setUpdatedFlora(initialFlora); // Reset updatedFlora ke nilai awal saat cancel
                            onUpdateClose();
                        }}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>


            {/* Delete Confirmation Modal yg udah gabutuh juga sebenernya */}
            <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} isCentered>
                <ModalOverlay />
                <ModalContent
                    display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    <ModalHeader>Confirm Delete Flora</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Are you sure you want to delete "{flora.namaLokal}"? This action cannot be undone.
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="red" mr={3} onClick={() => handleDeleteFlora(flora._id)}>
                            Delete
                        </Button>
                        <Button variant="ghost" onClick={onDeleteClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};


export default FloraCard;