// src/components/Navbar.jsx
import {
    Container,
    Flex,
    Button, // Pastikan Button diimpor
    HStack,
    Text,
    useColorMode,
    IconButton,
    Divider,
    Tooltip,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    useDisclosure,
} from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PlusSquareIcon } from '@chakra-ui/icons';
import { IoMoon } from 'react-icons/io5';
import { LuSun } from 'react-icons/lu';
import { motion } from 'framer-motion';
import { useColorModeValue } from '@chakra-ui/react';
import { FaLeaf, FaSignOutAlt } from 'react-icons/fa'; // <--- Import FaSignOutAlt jika ingin ikon logout yang sesuai
import { isLoggedIn, logout } from '../utils/auth';

const MotionLink = motion(Link);
const MotionButton = motion(Button); // Ini sudah benar sebagai motion(Button)
const MotionIconButton = motion(IconButton); // Ini juga sudah benar sebagai motion(IconButton)

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { colorMode, toggleColorMode } = useColorMode();
    const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();

    useEffect(() => {
        setUserIsLoggedIn(isLoggedIn());
    }, [location]);

    const handleLogout = () => {
        logout();
        setUserIsLoggedIn(false);
        onClose();
        navigate('/Login');
    };

    const lightBg = 'linear-gradient(to right, rgba(72, 175, 201, 0.7), rgba(229, 239, 246, 0.7))';
    const darkBg = 'rgba(26, 32, 44, 0.7 )';
    const shadow = useColorModeValue('sm', 'dark-lg');
    const accentColor = useColorModeValue('teal.700', 'teal.300');
    const textColor = useColorModeValue('gray.700', 'gray.200');
    const iconColor = useColorModeValue('gray.600', 'yellow.400');
    const buttonHoverBg = useColorModeValue('teal.100', 'teal.700');
    // const linkHoverColor = useColorModeValue('teal.600', 'teal.400'); // Ini tidak digunakan, bisa dihapus

    return (
        <Container
            maxW={'1550px'}
            mb={0}
            px={4}
            bg={useColorModeValue(lightBg, darkBg)}
            boxShadow={shadow}
            py={3}
            rounded={'md'}
            position={'sticky'}
            top={0}
            zIndex={10}
            as={motion.div}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            backdropFilter="blur(10px)"
            border="1px solid"
            borderColor={useColorModeValue('gray.200', 'gray.700')}
        >
            <Flex justifyContent={'space-between'} alignItems={'center'}>
                <HStack spacing={2}>
                    <FaLeaf color={accentColor} />
                    <Text
                        display="inline-block"
                        fontSize={{ base: '22px', sm: '26px' }}
                        fontWeight="bold"
                        textTransform="uppercase"
                        bgGradient="linear(to-l, rgb(31, 169, 155), rgb(255, 176, 19))"
                        bgClip="text"
                        _hover={{
                            textDecoration: 'none',
                            scale: 1.05,
                            transition: 'all 0.2s ease-in-out',
                            bgGradient: 'linear(to-l, white, orange.300)',
                        }}
                    >
                        <Link to="/Home">BioLibrary</Link>
                    </Text>
                </HStack>

                <HStack spacing={4} alignItems={'center'}>
                    <Tooltip label="Home" hasArrow placement="bottom">
                        <Link to="/Home">
                            <Text
                                fontSize="30"
                                fontWeight="bold"
                                bgGradient="linear(to-r, teal.400, cyan.600)"
                                bgClip="text"
                                textAlign="center"
                                borderBottom={location.pathname === '/Home' ? '2px solid teal' : 'none'}
                                boxShadow={location.pathname === '/Home' ? '0 0 10px rgba(0, 255, 255, 0.6)' : 'none'}
                                transition="all 0.3s ease"
                                filter =  {location.pathname === '/Home' ? 'brightness(1.3)'  : 'none'}
                                _hover={{ transform: 'scale(1.15)', boxShadow: '0 0 12px rgba(0, 255, 255, 0.8)' ,  filter: 'brightness(1.3)' }}
                            >
                                🏠
                            </Text>
                        </Link>
                    </Tooltip>

                    <Tooltip label="Flora" hasArrow placement="bottom">
                        <Link to="/Flora">
                            <Text
                                fontSize="30"
                                fontWeight="bold"
                                bgGradient="linear(to-r, teal.400, cyan.600)"
                                bgClip="text"
                                textAlign="center"
                                borderBottom={location.pathname.startsWith('/Flora')  ? '2px solid teal' : 'none'}
                                boxShadow={location.pathname.startsWith('/Flora') ? '0 0 10px rgba(0, 255, 255, 0.6)' : 'none'}
                                transition="all 0.3s ease"
                                filter ={location.pathname.startsWith('/Flora') ? 'brightness(1.3)' : 'none'}
                                _hover={{ transform: 'scale(1.15)', boxShadow: '0 0 12px rgba(0, 255, 255, 0.8)' ,  filter: 'brightness(1.3)' }}
                            >
                                🍀
                            </Text>
                        </Link>
                    </Tooltip>

                    <Tooltip label="Fauna" hasArrow placement="bottom">
                        <Link to="/Fauna">
                            <Text
                                fontSize="30"
                                fontWeight="bold"
                                bgGradient="linear(to-r, teal.400, cyan.600)"
                                bgClip="text"
                                textAlign="center"
                                borderBottom={location.pathname.startsWith('/Fauna') ? '2px solid teal' : 'none'}
                                boxShadow={location.pathname.startsWith('/Fauna')? '0 0 10px rgba(0, 255, 255, 0.6)' : 'none'}
                                transition="all 0.3s ease"
                                filter ={location.pathname.startsWith('/Fauna') ? 'brightness(1.3)' : 'none'}
                                _hover={{ transform: 'scale(1.15)', boxShadow: '0 0 12px rgba(0, 255, 255, 0.8)',  filter: 'brightness(1.3)'  }}
                            >
                                🐾
                            </Text>
                        </Link>
                    </Tooltip>
                    <Tooltip label="National Park" hasArrow placement="bottom">
                        <Link to="/NationalPark">
                            <Text
                                fontSize="30"
                                fontWeight="bold"
                                bgGradient="linear(to-r, teal.400, cyan.600)"
                                bgClip="text"
                                textAlign="center"
                                borderBottom={location.pathname.startsWith('/NationalPark')  ? '2px solid teal' : 'none'}
                                boxShadow={location.pathname.startsWith('/NationalPark') ? '0 0 10px rgba(0, 255, 255, 0.6)' : 'none'}
                                transition="all 0.3s ease"
                                filter ={location.pathname.startsWith('/NationalPark') ? 'brightness(1.3)' : 'none'}
                                _hover={{ transform: 'scale(1.15)', boxShadow: '0 0 12px rgba(0, 255, 255, 0.8)' ,  filter: 'brightness(1.3)' }}
                            >
                                 ⛰️
                            </Text>
                        </Link>
                    </Tooltip>


                </HStack>

                <HStack spacing={4} alignItems={'center'}>
                    {userIsLoggedIn ? (
                        // Bagian ini adalah untuk tombol "Logout"
                        <MotionButton
                            onClick={onOpen}
                            leftIcon={<FaSignOutAlt fontSize={23} color="white" />} // <--- Atur warna ikon di sini
                            whileHover={{ scale: 1.08 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                            bg="red.500" // <--- Warna latar belakang merah
                            color="white" // <--- Warna teks putih
                            size={'sm'}
                            rounded={'md'}
                            _hover={{ bg: "red.600", color: "white" }} // <--- Warna hover merah gelap
                        >
                            Logout
                        </MotionButton>
                    ) : (
                        // Bagian ini adalah untuk tombol "Login"
                        <MotionLink
                            to="/Login"
                            whileHover={{ scale: 1.08 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        >
                            <Button // Ini sudah benar menggunakan Button
                                leftIcon={<PlusSquareIcon fontSize={23} color={accentColor} />}
                                bg={'transparent'}
                                color={textColor}
                                size={'sm'}
                                rounded={'md'}
                                _hover={{ bg: buttonHoverBg, color: textColor }}
                            >
                                Login
                            </Button>
                        </MotionLink>
                    )}
                    <MotionIconButton // Ini menggunakan MotionIconButton (motion(IconButton))
                        onClick={toggleColorMode}
                        aria-label="Toggle theme"
                        icon={colorMode === 'light' ? <IoMoon size={23} color={iconColor} /> : <LuSun size={23} color={iconColor} />}
                        size={'sm'}
                        rounded={'full'}
                        whileHover={{ scale: 1.08 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        bg={'transparent'}
                        color={iconColor}
                        _hover={{ bg: buttonHoverBg }}
                    />
                </HStack>
            </Flex>
            <Divider mt={2} borderColor={accentColor} opacity={0.5} />
            {/* AlertDialog untuk konfirmasi logout */}
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Konfirmasi Logout
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Apakah Anda yakin ingin logout?
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Batal
                            </Button>
                            <Button colorScheme="red" onClick={handleLogout} ml={3}>
                                Logout
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Container>
    );
};

export default Navbar;