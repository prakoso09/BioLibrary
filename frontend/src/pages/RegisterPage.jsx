import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Heading,
  VStack,
  useColorModeValue,
  Text,
  useToast,
  useColorMode,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const { colorMode } = useColorMode();

  const borderGradient = useColorModeValue(
    "linear(to-r, teal.400, blue.600)",
    "linear(to-r, teal.300, cyan.500)"
  );
  const hoverShadow = useColorModeValue(
    "0 0 20px rgba(4, 73, 73, 0.8)",
    "0 0 25px rgba(0, 255, 255, 0.8)"
  );

  const [form, setForm] = useState({
    name: "",
    usn: "",
    gmail: "",
    password: "",
    institusi: "",
    role: "",
    nim: "",
    nidn: "",
  });

  const toast = useToast();
  const navigate = useNavigate();
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Mengirimkan permintaan register ke backend 
      const response = await axios.post("http://localhost:5000/api/data/register", form);
      
      toast({
        title: "Registrasi Berhasil!",
        description: response.data.message || "Akun Anda telah berhasil dibuat.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      
      // Redirect ke halaman login setelah registrasi berhasil
      navigate("/login");
    } catch (error) {
      toast({
        title: "Registrasi Gagal",
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
      bg={useColorModeValue("gray.50", "gray.900")}
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
          >
            Daftar Akun Baru
          </Heading>
          <Text
            fontSize="sm" 
            mb={3} 
            color={useColorModeValue("gray.600", "gray.300")}
            textAlign="center"
          >
            Silakan isi detail di bawah untuk membuat akun Anda.
          </Text>
            {/* Input nama */}
          <FormControl id="name" isRequired>
            <FormLabel color={useColorModeValue("gray.700", "gray.200")}>Nama Lengkap</FormLabel>
            <Input
              name="name" 
              value={form.name}
              onChange={handleChange}
              placeholder="Nama Lengkap Anda"
              size="md"
              focusBorderColor={useColorModeValue("teal.500", "cyan.400")}
              _placeholder={{ color: useColorModeValue("gray.400", "gray.500") }}
            />
          </FormControl>
          <FormControl id="usn" isRequired>
            <FormLabel color={useColorModeValue("gray.700", "gray.200")}>Username</FormLabel>
            <Input  
              name="usn"
              value={form.usn}
              onChange={handleChange}
              placeholder="Nama Pengguna Anda"
              size="md" // Ukuran input
              focusBorderColor={useColorModeValue("teal.500", "cyan.400")} 
              _placeholder={{ color: useColorModeValue("gray.400", "gray.500") }} 
            />
          </FormControl>

          <FormControl id="gmail" isRequired>
            <FormLabel color={useColorModeValue("gray.700", "gray.200")}>Email</FormLabel>
            <Input
              name="gmail"
              type="email"
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
              placeholder="Buat password"
              size="md"
              focusBorderColor={useColorModeValue("teal.500", "cyan.400")}
              _placeholder={{ color: useColorModeValue("gray.400", "gray.500") }}
            />
          </FormControl>

            <FormControl id="institusi" isRequired>
            <FormLabel color={useColorModeValue("gray.700", "gray.200")}>Institusi</FormLabel>
            <Input
              name="institusi"
              type="institusi"
              value={form.institusi}
              onChange={handleChange}
              placeholder="Nama Institusi Anda"
              size="md"
              focusBorderColor={useColorModeValue("teal.500", "cyan.400")}
              _placeholder={{ color: useColorModeValue("gray.400", "gray.500") }}
            />
          </FormControl>


          <FormControl id="role" isRequired>
            <FormLabel color={useColorModeValue("gray.700", "gray.200")}>Role</FormLabel>
            <Select
              name="role"
              placeholder="Pilih role"
              value={form.role}
              onChange={handleChange}
              size="md" 
              focusBorderColor={useColorModeValue("teal.500", "cyan.400")}
            >
              <option value="Mahasiswa">Mahasiswa</option>
              <option value="Dosen">Dosen</option>
            </Select>
          </FormControl>

          {form.role === "Mahasiswa" && (
            <FormControl id="nim" isRequired>
              <FormLabel color={useColorModeValue("gray.700", "gray.200")}>NIM</FormLabel>
              <Input
                name="nim"
                value={form.nim}
                onChange={handleChange}
                placeholder="Nomor Induk Mahasiswa"
                size="md"
                focusBorderColor={useColorModeValue("teal.500", "cyan.400")}
                _placeholder={{ color: useColorModeValue("gray.400", "gray.500") }}
              />
            </FormControl>
          )}

          {form.role === "Dosen" && (
            <FormControl id="nidn" isRequired>
              <FormLabel color={useColorModeValue("gray.700", "gray.200")}>NIDN</FormLabel>
              <Input
                name="nidn"
                value={form.nidn}
                onChange={handleChange}
                placeholder="Nomor Induk Dosen Nasional"
                size="md"
                focusBorderColor={useColorModeValue("teal.500", "cyan.400")}
                _placeholder={{ color: useColorModeValue("gray.400", "gray.500") }}
              />
            </FormControl>
          )}

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
            Daftar
          </Button>

          <Text fontSize="xs" color={useColorModeValue("gray.600", "gray.400")}>
            Sudah punya akun?{" "}
            <Link
              href="/login"
              color="teal.500"
              fontWeight="semibold"
              _hover={{ textDecoration: "underline" }}
            >
              Login di sini
            </Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default Register;