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

} from '@chakra-ui/react';

import { ArrowLeftIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';

import { useNavigate, useParams } from 'react-router-dom';

import { motion } from 'framer-motion';

import { useFloraStore } from '../store/flora';

import FloraFormModal from '../components/FloraFormModal';

import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

import { getUserRole, isLoggedIn } from '../utils/auth';



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



  // Hapus state updatedFlora karena tidak diperlukan lagi

  // const [updatedFlora, setUpdatedFlora] = useState(null); // HAPUS INI



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



  useEffect(() => {

    fetchFloraById(id);

    setCurrentUserRole(getUserRole());

    setUserIsLoggedIn(isLoggedIn());

  }, [fetchFloraById, id]);



  const [currentUserRole, setCurrentUserRole] = useState(null);

  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);



  const handleGoBack = () => navigate('/Flora');



  const bg = useColorModeValue(

    'linear-gradient(to right, rgba(255,255,255,0.3), rgba(220,255,250,0.2))',

    'linear-gradient(to right, rgba(23,25,35,0.7), rgba(12,18,30,0.5))'

  );

  const borderColor = useColorModeValue('whiteAlpha.500', 'whiteAlpha.300');

  const textColor = useColorModeValue('blackAlpha.900', 'whiteAlpha.900');

  const headingColor = useColorModeValue('teal.600', 'cyan.400');



  if (loadingSingleFlora || !singleFlora) {

    return (

      <Flex justify="center" align="center" minH="80vh">

        <Spinner size="xl" color={headingColor} />

      </Flex>

    );

  }



  const isDosen = userIsLoggedIn && currentUserRole === 'Dosen';



  const attributes = [

    ['Nama Lokal', singleFlora.namaLokal],

    ['Nama Ilmiah', singleFlora.namaIlmiah],

    ['Kingdom', singleFlora.kingdom],

    ['Divisi', singleFlora.divisi],

    ['Kelas', singleFlora.kelas],

    ['Ordo', singleFlora.ordo],

    ['Famili', singleFlora.famili],

    ['Genus', singleFlora.genus],

    ['Spesies', singleFlora.spesies],

    ['Jenis Tumbuhan', singleFlora.jenisTumbuhan],

    ['Jenis Daun', singleFlora.jenisDaun],

    ['Musim Tumbuh', singleFlora.musimTumbuh],

    ['Habitat', singleFlora.habitat],

    ['Sebaran Geografis', singleFlora.sebaranGeografis],

    ['Status Konservasi', singleFlora.statusKonservasi],

  ];



  return (

    <MotionContainer

      maxW="container.md"

      mt={10}

      initial={{ opacity: 0, y: 20 }}

      animate={{ opacity: 1, y: 0 }}

      transition={{ duration: 0.5, ease: 'easeOut' }}

    >

      <Flex mb={8} align="center" justify="space-between">

        <Flex align="center">

          <IconButton

            icon={<ArrowLeftIcon />}

            aria-label="Back to Flora Library"

            onClick={handleGoBack}

            variant="ghost"

            size="lg"

            borderRadius="full"

            _hover={{ bg: useColorModeValue('gray.200', 'whiteAlpha.200') }}

          />

          <Heading as="h1" size="2xl" ml={4} color={headingColor}>

            Flora Detail

          </Heading>

        </Flex>

        {isDosen && (

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

              onClick={() => {

                // Tidak perlu setUpdatedFlora lagi, langsung buka modal

                // Karena FloraFormModal akan mengambil prop flora dari singleFlora

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

              h={400}

            />

          </Box>



          <Divider borderColor={borderColor} opacity={0.5} />



          {attributes

            .filter(([_, value]) => !!value)

            .map(([label, value]) => (

              <Box key={label} w="full">

                <Text fontWeight="bold" fontSize="xl" color={headingColor}>

                  {label}

                </Text>

                <Text fontSize="lg" color={textColor}>

                  {value}

                </Text>

              </Box>

            ))}



          {singleFlora.kegunaan && singleFlora.kegunaan.length > 0 && (

            <Box w="full">

              <Text fontWeight="bold" fontSize="xl" color={headingColor}>

                Kegunaan

              </Text>

              <VStack align="start" mt={2} spacing={1}>

                {singleFlora.kegunaan.map((use, idx) => (

                  <Text key={idx} fontSize="md" color={textColor}>

                    - {use}

                  </Text>

                ))}

              </VStack>

            </Box>

          )}



          <Divider borderColor={borderColor} opacity={0.5} />



          {singleFlora.deskripsi && (

            <Box w="full">

              <Text fontWeight="bold" fontSize="xl" color={headingColor}>

                Deskripsi

              </Text>

              <Text fontSize="lg" color={textColor} whiteSpace="pre-line">

                {singleFlora.deskripsi}

              </Text>

            </Box>

          )}

        </VStack>

      </MotionBox>



      {isDosen && (

        <>

          <FloraFormModal

            isOpen={isUpdateOpen}

            onClose={onUpdateClose}

            flora={singleFlora} // Ganti updatedFlora menjadi singleFlora

            onSubmit={async (formData) => {

              await updateFlora(formData._id, formData);

              await fetchFloraById(formData._id); // Ini akan memperbarui singleFlora di store

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

            title="Delete Flora"

            body={`Are you sure you want to delete "${singleFlora.namaLokal}"? This action cannot be undone.`}

          />

        </>

      )}

    </MotionContainer>

  );

};



export default FloraDetailPage;