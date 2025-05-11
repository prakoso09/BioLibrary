import React from 'react'
import { Box, Text, VStack, Icon, Input, useColorModeValue, Center, Button, Image } from '@chakra-ui/react';
import { FaCamera } from 'react-icons/fa'; // Untuk ikon kamera
import { useState } from 'react'; // Untuk mengelola state gambar

const ScanPage = () => {
  // Menggunakan pola warna dari halaman login Anda
  const borderGradient = useColorModeValue(
    "linear(to-r, teal.400, blue.600)",
    "linear(to-r, teal.300, cyan.500)"
  );
  const hoverShadow = useColorModeValue(
    "0 0 20px rgba(4, 73, 73, 0.8)",
    "0 0 25px rgba(0, 255, 255, 0.8)"
  );

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  return (
    // Menghilangkan properti bgGradient dari Center karena background sudah diatur di route awal
    <Center minH="100vh" p={4}>
      <Box
        // Menggunakan latar belakang putih transparan di mode terang dan abu-abu gelap di mode gelap
        bg={useColorModeValue("whiteAlpha.900", "gray.700")}
        p={8}
        borderRadius="lg"
        // Menggunakan borderGradient untuk border pada box utama (seperti halaman login)
        borderWidth="2px"
        borderColor="transparent"
        bgGradient={borderGradient} // Gradien ini akan menjadi border transparan
        boxShadow={hoverShadow} // Menggunakan shadow yang sama
        transition="all 0.3s ease-in-out"
        _hover={{
          transform: "translateY(-5px)",
          boxShadow: hoverShadow,
        }}
        textAlign="center"
        maxW="md"
        w="full"
      >
        {/* Konten di dalam Box, pastikan tidak terlalu rapat dengan border */}
        <VStack
          spacing={6}
          bg={useColorModeValue("white", "gray.800")} // Latar belakang untuk VStack di dalam Box
          p={{ base: 5, md: 7 }}
          borderRadius="md"
          boxShadow="lg"
        >
          {/* Bagian "Under Construction" */}
          <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="extrabold" color={useColorModeValue("teal.600", "teal.300")}>
            Under Construction !!
          </Text>

          {/* Bagian pertanyaan dan ajakan */}
          <Text fontSize={{ base: "lg", md: "xl" }} color={useColorModeValue("gray.700", "gray.300")} mt={4}>
            Find unidentifiable species?
          </Text>
          <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="semibold" color={useColorModeValue("gray.700", "gray.200")}>
            Let's scan them!
          </Text>

          {/* Ikon Kamera */}
          <Icon as={FaCamera} w={12} h={12} color={useColorModeValue("teal.600", "cyan.400")} />

          {/* Tempat untuk input gambar */}
          <Box
            border="2px dashed"
            borderColor={useColorModeValue("gray.400", "gray.500")}
            borderRadius="md"
            p={6}
            w="full"
            minH="200px"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
            onClick={() => document.getElementById('image-upload').click()}
            _hover={{ borderColor: useColorModeValue("teal.500", "cyan.400") }}
            position="relative"
            bg={useColorModeValue("gray.50", "gray.700")} // Latar belakang area input gambar
          >
            {selectedImage ? (
              <Image src={selectedImage} alt="Selected" maxH="180px" objectFit="contain" />
            ) : (
              <VStack spacing={2}>
                <Text fontSize="lg" color={useColorModeValue("gray.600", "gray.400")}>Drag and drop your image here, or</Text>
                <Button
                  colorScheme="teal"
                  size="sm"
                  bg={useColorModeValue("teal.500", "teal.400")}
                  _hover={{ bg: useColorModeValue("teal.600", "teal.300") }}
                >
                  Browse Files
                </Button>
              </VStack>
            )}
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
          </Box>

          {/* Tombol Scan (opsional, bisa ditambahkan fungsionalitas nanti) */}
          <Button
            colorScheme="teal" // Menggunakan colorScheme teal
            size="lg"
            mt={4}
            isDisabled={!selectedImage}
            bg={useColorModeValue("teal.500", "cyan.500")} // Warna solid untuk tombol
            _hover={{
              bg: useColorModeValue("teal.600", "cyan.600"),
              transform: "scale(1.02)",
            }}
            transition="all 0.2s ease-in-out"
          >
            Scan Now
          </Button>
        </VStack>
      </Box>
    </Center>
  );
};

export default ScanPage;