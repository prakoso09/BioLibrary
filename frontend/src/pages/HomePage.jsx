import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Icon,
  useColorModeValue,
  SimpleGrid,
  Image,
  Button,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLeaf, FaPaw, FaMountain, FaCamera } from 'react-icons/fa';
import { keyframes } from '@emotion/react';

// Impor gambar latar belakang dari direktori components
import backgroundImage from '../components/bg.jpg';
// Impor ikon baru yang Anda download
import myNatureIcon from '../components/my-nature-icon.png'; // Sesuaikan nama file ikon Anda di sini

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const animatedBackground = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const HomePage = () => {
  const textColor = useColorModeValue('#1a202c', 'whiteAlpha.900');
  const glowColor = useColorModeValue('teal.400', 'cyan.300');

  const hoverShadow = useColorModeValue(
    "0 0 20px rgba(255, 255, 255, 0.8)",
    "0 0 25px rgba(0, 255, 255, 0.8)"
  );

  const iconBg = useColorModeValue('teal.200', 'cyan.700');

  const features = [
    { label: 'Jelajahi Flora', icon: FaLeaf, link: '/Flora' },
    { label: 'Jelajahi Fauna', icon: FaPaw, link: '/Fauna' },
    { label: 'Jelajahi Taman Nasional', icon: FaMountain, link: '/Park' },
    { label: 'Scan Spesies', icon: FaCamera, link: '/Scan' },
  ];

  return (
    <MotionBox
      minH="100vh"
      px={6}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDir="column"
      bgImage={`url(${backgroundImage})`}
      bgSize="cover"
      bgPosition="center"
      bgAttachment="fixed"
      bgRepeat="no-repeat"
      position="relative"

      _before={{
        content: `""`,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bg: useColorModeValue("rgba(207, 250, 254, 0.1)", "rgba(0, 0, 0, 0.4)"),
        zIndex: 0,
      }}
    >
      <Flex direction="column" align="center" textAlign="center" mb={14} zIndex={1}>

        <Image
          src={myNatureIcon}
          alt="Nature Icon"
          boxSize="140px"
          mb={4} 
          filter={`drop-shadow(0 0 16px ${glowColor})`}
          transition="0.3s ease"
          _hover={{ transform: 'scale(1.1)' }}
        />

        <Heading
          fontSize={['4xl', '6xl']}
          fontWeight="extrabold"
          bgGradient="linear(to-l, rgb(31, 169, 155), rgb(255, 176, 19))"
          bgClip="text"
          textShadow={`0 0 10px ${glowColor}, 0 0 30px ${glowColor}`}
        >
          Biolibrary
        </Heading>
        <Text
          mt={4}
          fontSize={['md', 'lg', 'xl']}
          color={"rgba(207, 250, 254, 1)"}
          maxW="640px"
          fontWeight="medium"
        >
          Temukan keanekaragaman flora & fauna Indonesia. Eksplor, scan, dan berkontribusi dalam pelestarian hayati.
        </Text>
      </Flex>

      <SimpleGrid columns={[1, 2]} spacing={6} maxW="720px" w="full" zIndex={1}>
        {features.map(({ label, icon, link }, i) => (
          <MotionButton
            key={i}
            as={Link}
            to={link}
            leftIcon={
              <Icon
                as={icon}
                w={10}
                h={10}
                bg={iconBg}
                p={2}
                rounded="full"
                color="white"
                boxShadow="base"
              />
            }
            bgGradient={useColorModeValue(
              "linear(to-r, rgba(114, 216, 225, 0.7), rgba(193, 237, 246, 0.4))",
              "linear(to-r, rgba(0,0,0,0.5), rgba(0,0,0,0.2))"
            )}
            color={textColor}
            size="lg"
            rounded="2xl"
            py={8}
            fontWeight="bold"
            border="1px solid"
            borderColor={glowColor}
            backdropFilter="blur(12px)"
            transition="all 0.3s ease"
            _hover={{
              boxShadow: hoverShadow,
              transform: 'scale(1.05)',
              bgGradient: useColorModeValue(
                'linear(to-r, rgba(255,255,255,0.9), rgba(255,255,255,0.6))',
                'linear(to-r, rgba(0,0,0,0.7), rgba(0,0,0,0.4))'
              ),
            }}
            whileTap={{ scale: 0.97 }}
          >
            {label}
          </MotionButton>
        ))}
      </SimpleGrid>
    </MotionBox>
  );
};

export default HomePage;