// store/nationalPark.js
import { create } from "zustand";
import axios from "axios";

// Pastikan ini sesuai dengan URL backend Anda untuk endpoint Taman Nasional
// Asumsi endpoint Anda adalah /api/data/taman_nasional
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const useNationalParkStore = create((set) => ({
    nationalParks: [],
    singleNationalPark: null,
    loadingSingleNationalPark: false,
    loadingNationalParks: false, // Mengganti 'loading' agar lebih spesifik
    error: null,

    setNationalParks: (nationalParks) => set({ nationalParks }),

    createNationalPark: async (nationalParkData) => {
        set({ loadingNationalParks: true, error: null });
        try {
            // AXIOS WILL AUTOMATICALLY ATTACH THE AUTHORIZATION HEADER
            const response = await axios.post(`${API_BASE_URL}/api/data/taman_nasional`, nationalParkData);

            if (!response.data.success) {
                set({ loadingNationalParks: false });
                return { success: false, message: response.data.message || "Failed to create national park." };
            }

            set((state) => ({
                nationalParks: [...state.nationalParks, response.data.data],
                loadingNationalParks: false
            }));
            return { success: true, message: "National park created successfully." };
        } catch (error) {
            set({
                loadingNationalParks: false,
                error: error.response?.data?.message || "Failed to create national park."
            });
            console.error("Error creating national park:", error.response?.data || error.message);
            return { success: false, message: error.response?.data?.message || "Failed to create national park." };
        }
    },

    deleteNationalPark: async (id) => {
        set({ loadingNationalParks: true, error: null });
        try {
            // AXIOS WILL AUTOMATICALLY ATTACH THE AUTHORIZATION HEADER
            const response = await axios.delete(`${API_BASE_URL}/api/data/taman_nasional/${id}`);
            if (!response.data.success) {
                set({ loadingNationalParks: false });
                return { success: false, message: response.data.message };
            }
            set((state) => ({
                nationalParks: state.nationalParks.filter((park) => park._id !== id),
                loadingNationalParks: false
            }));
            return { success: true, message: "National park deleted successfully." };
        } catch (error) {
            set({
                loadingNationalParks: false,
                error: error.response?.data?.message || "Failed to delete national park."
            });
            console.error("Error deleting national park:", error.response?.data || error.message);
            return { success: false, message: error.response?.data?.message || "Failed to delete national park." };
        }
    },

    updateNationalPark: async (id, updatedNationalPark) => {
        set({ loadingNationalParks: true, error: null }); // Menggunakan loadingNationalParks untuk update
        try {
            // AXIOS WILL AUTOMATICALLY ATTACH THE AUTHORIZATION HEADER
            const response = await axios.put(`${API_BASE_URL}/api/data/taman_nasional/${id}`, updatedNationalPark);
            if (!response.data.success) {
                set({ loadingNationalParks: false });
                return { success: false, message: response.data.message || "Failed to update national park." };
            }
            set((state) => ({
                nationalParks: state.nationalParks.map((park) =>
                    park._id === id ? response.data.data : park
                ),
                singleNationalPark: state.singleNationalPark && state.singleNationalPark._id === id
                    ? response.data.data
                    : state.singleNationalPark,
                loadingNationalParks: false
            }));
            return { success: true, message: "National park updated successfully." };
        } catch (error) {
            set({
                loadingNationalParks: false,
                error: error.response?.data?.message || "Failed to update national park."
            });
            console.error("Error updating national park:", error.response?.data || error.message);
            return { success: false, message: error.response?.data?.message || "Failed to update national park." };
        }
    },

    fetchNationalParks: async () => {
        set({ loadingNationalParks: true, error: null });
        try {
            const response = await axios.get(`${API_BASE_URL}/api/data/taman_nasional`);
            set({ nationalParks: response.data.data || [], loadingNationalParks: false });
        } catch (error) {
            set({
                loadingNationalParks: false,
                error: error.response?.data?.message || "Failed to fetch national parks."
            });
            console.error("Error fetching national parks:", error.response?.data || error.message);
        }
    },

    fetchNationalParkById: async (id) => {
        set({ loadingSingleNationalPark: true, singleNationalPark: null, error: null });
        try {
            const response = await axios.get(`${API_BASE_URL}/api/data/taman_nasional/${id}`);
            if (response.data.success) {
                set({ singleNationalPark: response.data.data, loadingSingleNationalPark: false });
            } else {
                set({
                    singleNationalPark: null,
                    loadingSingleNationalPark: false,
                    error: response.data.message
                });
                console.error("Error fetching national park by ID:", response.data.message);
            }
        } catch (error) {
            set({
                singleNationalPark: null,
                loadingSingleNationalPark: false,
                error: error.response?.data?.message || "Failed to fetch national park by ID."
            });
            console.error("Error fetching national park by ID:", error.response?.data || error.message);
            return { success: false, message: error.response?.data?.message || "Failed to fetch national park by ID." };
        }
    }
}));