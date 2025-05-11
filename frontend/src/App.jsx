import { Box, useColorModeValue } from "@chakra-ui/react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { loadAuthToken } from "./utils/auth";
import { keyframes } from "@emotion/react"; // Import keyframes

import FloraDetailPage from "./pages/FloraDetailPage";
import FaunaDetailPage from "./pages/FaunaDetailPage";
import NationalParkDetailPage from "./pages/NationalParkDetailPage";

import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import ScanPage from "./pages/ScanPage";

import FloraPage from "./pages/FloraPage";
import FaunaPage from "./pages/FaunaPage";
import NationalParkPage from "./pages/NationalParkPage";

import CreateFloraPage from "./pages/CreateFloraPage";
import CreateFaunaPage from "./pages/CreateFaunaPage";
import CreateNationalParkPage from "./pages/CreateNationalParkPage";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// =========================================================
// PERHATIAN: Tambahkan keyframes untuk animasi gradasi
// =========================================================
const animatedBackground = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

function App() {
  const location = useLocation();

  useEffect(() => {
    loadAuthToken();
  }, []);

  const showNavbar = location.pathname !== "/login" && location.pathname !== "/register";

  // =========================================================
  // PERHATIAN: Definisikan gradasi untuk Light Mode dan Dark Mode
  // =========================================================
  const appBgGradient = useColorModeValue(
    'linear-gradient(135deg, rgb(146, 237, 242), rgb(214, 234, 244), rgb(250, 253, 255))', // Gradasi untuk Light Mode
    'linear-gradient(135deg, rgb(0, 0, 0), rgb(26, 32, 44), rgb(47, 47, 76))' // Gradasi untuk Dark Mode
  );

  return (
    <Box
      minH={"100vh"}
      // =========================================================
      // PERHATIAN: Terapkan properti gradasi dan animasi
      // =========================================================
      bg={appBgGradient}
      bgSize="200% 200%" // Penting untuk animasi gradasi
      animation={`${animatedBackground} 5s ease infinite`} // Terapkan animasi
    >
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Home" element={<HomePage />} />
        <Route path="/Flora" element={<FloraPage />} />
        <Route path="/Fauna" element={<FaunaPage />} />
        <Route path="/NationalPark" element={<NationalParkPage />} />
        <Route path="/Scan" element={<ScanPage />} />
        <Route path="/CreateFlora" element={<CreateFloraPage />} />
        <Route path="/CreateFauna" element={<CreateFaunaPage />} />
        <Route path="/CreateNationalPark" element={<CreateNationalParkPage />} />
        <Route path="/flora/:id" element={<FloraDetailPage />} />
        <Route path="/fauna/:id" element={<FaunaDetailPage />} />
        <Route path="/NationalPark/:id" element={<NationalParkDetailPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Box>
  );
}

export default App;