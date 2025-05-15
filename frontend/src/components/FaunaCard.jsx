import React from 'react';
import {
    Box,
    Image,
    useColorModeValue,
    HStack,
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
import { useFaunaStore } from '../store/fauna'; 
import { useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const MotionBox = motion(Box);
const FaunaCard = ({ fauna }) => {
    const [updatedFauna, setUpdatedFauna] = useState(fauna); // Inisialisasi dengan nilai awal
    const initialFauna = fauna; // Simpan nilai awal fauna, nilai awal digunakan ketika user cancel / gajadi update, tapi sebenernya gaperlu di page ini deh?


    const { deleteFauna, updateFauna } = useFaunaStore(); 
    const toast = useToast();
    const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();


    const handleDeleteFauna = async (id) => {
        const { success, message } = await deleteFauna(id); 
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



    const handleUpdateFauna = async (id, updatedFauna) => {
        const { success, message } = await updateFauna(id, updatedFauna);
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
                <Link to={`/fauna/${fauna._id}`}> 
                    <Image
                        src={fauna.image && fauna.image.startsWith('http') ? fauna.image : null}
                        alt={fauna.namaLokal}
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
                    {fauna.namaLokal}
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
                    {fauna.namaIlmiah}
                    </Text>
                </VStack>


                <Divider borderColor="gray.600" opacity={0.3} mx={4} />


                <HStack px={4} py={2} spacing={3} justify="center">
                    <Link to={`/fauna/${fauna._id}`}> 
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


            {/* Update modal dan delete modal udh ga butuh sebenenrnya, tapi simpen aja disini incase mau dirubah nanti */}
            <Modal isOpen={isUpdateOpen} onClose={onUpdateClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Update Fauna</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            <Input
                                placeholder="Fauna Local Name"
                                name="namaLokal"
                                value={updatedFauna.namaLokal}
                                onChange={(e) => setUpdatedFauna({ ...updatedFauna, namaLokal: e.target.value })}
                            />
                            <Input
                                placeholder="Fauna Scientific Name"
                                name="namaIlmiah"
                                value={updatedFauna.namaIlmiah}
                                onChange={(e) => setUpdatedFauna({ ...updatedFauna, namaIlmiah: e.target.value })}
                            />
                            <Input
                                placeholder="Fauna Image URL"
                                name="image"
                                value={updatedFauna.image}
                                onChange={(e) => setUpdatedFauna({ ...updatedFauna, image: e.target.value })}
                            />
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={() => handleUpdateFauna(fauna._id, updatedFauna)}>
                            Update
                        </Button>
                        <Button variant="ghost" onClick={() => {
                            setUpdatedFauna(initialFauna); // Reset updatedFauna ke nilai awal saat cancel
                            onUpdateClose();
                        }}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>


            {/* Delete Confirmation Modal , juga sebenernya udh ga butuh tapi gapapa simpen aja disini*/}
            <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} isCentered>
                <ModalOverlay />
                <ModalContent
                    display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    <ModalHeader>Confirm Delete Fauna</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Are you sure you want to delete "{fauna.namaLokal}"? This action cannot be undone.
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="red" mr={3} onClick={() => handleDeleteFauna(fauna._id)}>
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


export default FaunaCard;