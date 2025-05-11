// pages/login.jsx
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  useColorModeValue,
  Text,
  useToast,
  useColorMode,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setAuthToken } from '../utils/auth'; // <--- IMPORT setAuthToken

const Login = () => {
  const { colorMode } = useColorMode();

  const borderGradient = useColorModeValue(
    "linear(to-r, teal.400, blue.600)",
    "linear(to-r, teal.300, cyan.500)"
  );
  const hoverShadow = useColorModeValue(
    "0 0 20px rgba(4, 73, 73, 0.8)",
    "0 0 25px rgba(0, 255, 255, 0.8)"
  );

  const [form, setForm] = useState({ gmail: "", password: "" });
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/data/login", form);
      
      // GANTI BARIS INI:
      // localStorage.setItem("token", response.data.token);
      // DENGAN INI:
      setAuthToken(response.data.token); // <--- PANGGIL FUNGSI DARI AUTH.JS

      toast({
        title: "Login Berhasil!",
        description: "Anda berhasil login.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      console.log("Login successful. Navigating to /..."); // Tambahkan log ini
      navigate("/"); // Ini akan menyebabkan perubahan lokasi dan memicu Navbar useEffect

    } catch (error) {
      console.error("Login error:", error.response?.data?.message || error.message); // Logging error lebih detail
      toast({
        title: "Login Gagal",
        description: error.response?.data?.message || "Terjadi kesalahan",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg={useColorModeValue("rgba(209, 251, 253, 0.9)", "gray.900")}
      p={{ base: 4, md: 6 }} 
    >
      <Box
        maxW={{ base: "xs", md: "sm", lg: "md" }}
        mx="auto"
        p={{ base: 6, md: 7 }}
        borderRadius="lg" 
        borderWidth="2px"
        borderColor="transparent"
        bgGradient={borderGradient}
        boxShadow={hoverShadow}
        transition="all 0.3s ease-in-out"
        _hover={{
          transform: "translateY(-5px)",
          boxShadow: hoverShadow,
        }}
      >
        <VStack
          spacing={5}
          as="form"
          onSubmit={handleSubmit}
          bg={useColorModeValue("white", "gray.700")}
          p={{ base: 5, md: 7 }}
          borderRadius="md"
          boxShadow="lg"
        >
          <Heading
            size="lg"
            mb={3}
            color={useColorModeValue("teal.600", "teal.300")}
            textAlign="center"
          >
            Selamat Datang Kembali!
          </Heading>
          <Text
            fontSize="sm"
            mb={3}
            color={useColorModeValue("gray.600", "gray.300")}
            textAlign="center"
          >
            Silakan masukkan detail akun Anda untuk melanjutkan.
          </Text>

          <FormControl id="gmail" isRequired>
            <FormLabel color={useColorModeValue("gray.700", "gray.200")}>Email</FormLabel> {/* Ganti 'gmail' jadi 'Email' di label */}
            <Input
              name="gmail"
              type="email" // Ganti 'gmail' jadi 'email' untuk type
              value={form.gmail}
              onChange={handleChange}
              placeholder="alamat_email@contoh.com"
              size="md"
              focusBorderColor={useColorModeValue("teal.500", "cyan.400")}
              _placeholder={{ color: useColorModeValue("gray.400", "gray.500") }}
            />
          </FormControl>

          <FormControl id="password" isRequired>
            <FormLabel color={useColorModeValue("gray.700", "gray.200")}>Password</FormLabel>
            <Input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Masukkan password Anda"
              size="md"
              focusBorderColor={useColorModeValue("teal.500", "cyan.400")}
              _placeholder={{ color: useColorModeValue("gray.400", "gray.500") }}
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="teal"
            width="full"
            size="md"
            mt={3}
            _hover={{
              bg: useColorModeValue("teal.600", "teal.400"),
              transform: "scale(1.02)",
            }}
            transition="all 0.2s ease-in-out"
          >
            Login
          </Button>

          <Text fontSize="xs" color={useColorModeValue("gray.600", "gray.400")}> 
            Belum punya akun?{" "}
            <Link href="/register" color="teal.500" fontWeight="semibold" _hover={{ textDecoration: "underline" }}>
              Daftar di sini
            </Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default Login;